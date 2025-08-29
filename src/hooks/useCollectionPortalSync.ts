import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  syncCount: number;
}

interface CollectionPortalData {
  loan_id: string;
  status: string;
  recovery_amount?: number;
  last_payment_date?: string;
  notes?: string;
}

export function useCollectionPortalSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    syncCount: 0
  });
  const { toast } = useToast();

  // Set up real-time subscriptions for data changes
  useEffect(() => {
    // Subscribe to loan updates
    const loansChannel = supabase
      .channel('loans-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loans'
        },
        (payload) => {
          console.log('Loan change detected:', payload);
          handleLoanChange(payload);
        }
      )
      .subscribe();

    // Subscribe to visit updates
    const visitsChannel = supabase
      .channel('visits-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visits'
        },
        (payload) => {
          console.log('Visit change detected:', payload);
          handleVisitChange(payload);
        }
      )
      .subscribe();

    setSyncStatus(prev => ({ ...prev, isConnected: true }));

    return () => {
      supabase.removeChannel(loansChannel);
      supabase.removeChannel(visitsChannel);
      setSyncStatus(prev => ({ ...prev, isConnected: false }));
    };
  }, []);

  const handleLoanChange = async (payload: any) => {
    // Only sync updates (not inserts or deletes)
    if (payload.eventType === 'UPDATE') {
      const loan = payload.new;
      
      try {
        // Send update to Collection Portal via webhook
        await syncToCollectionPortal({
          type: 'loan_update',
          data: {
            loan_id: loan.loan_id,
            status: loan.status,
            recovery_amount: loan.recovery_amount,
            last_payment_date: loan.last_payment_date,
            notes: loan.notes
          }
        });

        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          syncCount: prev.syncCount + 1
        }));

      } catch (error) {
        console.error('Failed to sync loan to Collection Portal:', error);
        toast({
          title: "Sync Error",
          description: "Failed to sync loan data to Collection Portal",
          variant: "destructive"
        });
      }
    }
  };

  const handleVisitChange = async (payload: any) => {
    if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
      const visit = payload.new;
      
      try {
        await syncToCollectionPortal({
          type: 'visit_completion',
          data: {
            visit_id: visit.id,
            loan_id: visit.loan_id,
            outcome: visit.outcome,
            notes: visit.notes,
            completed_at: visit.completed_at
          }
        });

        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          syncCount: prev.syncCount + 1
        }));

        toast({
          title: "Visit Synced",
          description: "Visit completion synced to Collection Portal",
        });

      } catch (error) {
        console.error('Failed to sync visit to Collection Portal:', error);
        toast({
          title: "Sync Error",
          description: "Failed to sync visit data to Collection Portal",
          variant: "destructive"
        });
      }
    }
  };

  const syncToCollectionPortal = async (syncData: any) => {
    const { data, error } = await supabase.functions.invoke('collection-portal-sync', {
      body: syncData
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const manualSync = async () => {
    try {
      // Fetch recent changes and sync them
      const { data: recentLoans, error } = await supabase
        .rpc('get_recent_loans', { hours_ago: 24 }) as {
          data: Array<{
            loan_id: string;
            status: string;
            recovery_amount: number;
            last_payment_date: string;
            notes: string;
            updated_at: string;
          }> | null;
          error: any;
        };

      if (error) {
        throw error;
      }

      if (recentLoans && Array.isArray(recentLoans)) {
        for (const loan of recentLoans) {
          await syncToCollectionPortal({
            type: 'loan_update',
            data: {
              loan_id: loan.loan_id,
              status: loan.status,
              recovery_amount: loan.recovery_amount,
              last_payment_date: loan.last_payment_date,
              notes: loan.notes
            }
          });
        }
      }

      const syncCount = recentLoans?.length || 0;
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        syncCount: prev.syncCount + syncCount
      }));

      toast({
        title: "Manual Sync Completed",
        description: `Synced ${syncCount} loan records`,
      });

    } catch (error) {
      console.error('Manual sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Manual sync to Collection Portal failed",
        variant: "destructive"
      });
    }
  };

  const receiveFromCollectionPortal = async (data: CollectionPortalData) => {
    try {
      const { data: syncResult, error } = await supabase.functions.invoke('collection-portal-sync', {
        body: {
          type: 'webhook_from_collection_portal',
          payload: {
            event_type: 'loan_update',
            data
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Data Received",
        description: "Successfully received update from Collection Portal",
      });

    } catch (error) {
      console.error('Failed to receive data from Collection Portal:', error);
      toast({
        title: "Receive Error",
        description: "Failed to process data from Collection Portal",
        variant: "destructive"
      });
    }
  };

  return {
    syncStatus,
    manualSync,
    receiveFromCollectionPortal,
    syncToCollectionPortal
  };
}