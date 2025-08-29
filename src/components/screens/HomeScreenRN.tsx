import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Bell, Menu, Clock, Search, Phone } from 'lucide-react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function HomeScreen() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState<Date | null>(null);
  const { user } = useAuth();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const queryClient = useQueryClient();

  const { data: visitsData = [] } = useQuery({
    queryKey: ['visits', user?.id, startOfToday.toDateString()],
    queryFn: async () => {
      if (!user) return [] as any[];
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_at', startOfToday.toISOString())
        .lte('scheduled_at', endOfToday.toISOString());
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: tasksData = [] } = useQuery({
    queryKey: ['tasks', user?.id, startOfToday.toDateString()],
    queryFn: async () => {
      if (!user) return [] as any[];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .gte('due_at', startOfToday.toISOString())
        .lte('due_at', endOfToday.toISOString());
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const plannedVisits = (visitsData as any[]).filter(v => v.status === 'planned');
  const completedVisits = (visitsData as any[]).filter(v => v.status === 'completed');
  const pendingVisits = (visitsData as any[]).filter(v => v.status === 'pending');

  const isWithinWorkingHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 9 && hours < 18;
  };

  const calculateDuration = () => {
    if (!clockTime) return "";
    const now = new Date();
    const diff = now.getTime() - clockTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleClockIn = () => {
    if (!isWithinWorkingHours()) {
      Alert.alert("Clock-in restricted", "You can only clock-in between 9 AM and 6 PM.");
      return;
    }
    setIsClockedIn(true);
    setClockTime(new Date());
    Alert.alert("Clocked In", "You have successfully clocked in.");
  };

  const handleClockOut = () => {
    if (!isWithinWorkingHours()) {
      Alert.alert("Clock-out restricted", "You can only clock-out between 9 AM and 6 PM.");
      return;
    }
    Alert.alert(
      "Clock Out",
      "Are you sure you want to clock out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clock Out",
          onPress: () => {
            setIsClockedIn(false);
            const duration = calculateDuration();
            Alert.alert("Clocked Out", `You worked for ${duration} today.`);
          }
        }
      ]
    );
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      handleClockOut();
    } else {
      handleClockIn();
    }
  };

  useEffect(() => {
    const seed = async () => {
      if (!user) return;
      const seededKey = `seeded-${user.id}-${startOfToday.toDateString()}`;
      if (global.localStorage?.getItem(seededKey)) return;

      if ((visitsData as any[]).length === 0 && (tasksData as any[]).length === 0) {
        const visitPayload = [
          { user_id: user.id, customer_name: 'Anita Desai', status: 'planned', scheduled_at: new Date(new Date().setHours(10,30,0,0)).toISOString(), address: 'Andheri East, Mumbai' },
          { user_id: user.id, customer_name: 'Rajesh Kumar', status: 'completed', scheduled_at: new Date(new Date().setHours(9,45,0,0)).toISOString(), completed_at: new Date(new Date().setHours(9,45,0,0)).toISOString() },
          { user_id: user.id, customer_name: 'Neha Gupta', status: 'pending', scheduled_at: new Date(new Date().setHours(12,0,0,0)).toISOString() },
        ];

        const taskPayload = [
          { user_id: user.id, title: 'Follow-up call - Rajesh Kumar', type: 'Call', status: 'pending', due_at: new Date(new Date().setHours(11,0,0,0)).toISOString() },
          { user_id: user.id, title: 'Verify documents - Priya Sharma', type: 'Verification', status: 'pending', due_at: new Date(new Date().setHours(14,30,0,0)).toISOString() },
          { user_id: user.id, title: 'Reminder SMS - Amit Patel', type: 'SMS', status: 'pending', due_at: new Date(new Date().setHours(17,0,0,0)).toISOString() },
        ];

        await supabase.from('visits').insert(visitPayload as any[]);
        await supabase.from('tasks').insert(taskPayload as any[]);

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['visits', user.id, startOfToday.toDateString()] }),
          queryClient.invalidateQueries({ queryKey: ['tasks', user.id, startOfToday.toDateString()] }),
        ]);

        global.localStorage?.setItem(seededKey, '1');
      }
    };
    seed();
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconButton}>
            <Menu size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color="white" />
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>187</Text>
            </View>
          </View>
        </View>

        {/* Agent Info Card */}
        <View style={styles.agentCard}>
          <View style={styles.agentInfo}>
            <View style={styles.agentRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>S</Text>
              </View>
              <View style={styles.agentDetails}>
                <Text style={styles.agentName}>Spandan</Text>
                <Text style={styles.agentRole}>Sales - demo</Text>
              </View>
            </View>
            <View style={styles.clockSection}>
              <TouchableOpacity 
                onPress={handleClockToggle}
                style={[styles.clockButton, isClockedIn ? styles.clockOutButton : styles.clockInButton]}
              >
                <Clock size={16} color="white" />
                <Text style={styles.clockButtonText}>
                  {isClockedIn ? "Clock-Out" : "Clock-In"}
                </Text>
              </TouchableOpacity>
              {clockTime && (
                <Text style={styles.clockTime}>
                  {isClockedIn ? "In" : "Out"} at {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Max. Limit</Text>
              <Text style={styles.metricValue}>₹10.00</Text>
              <Text style={styles.metricSubtitle}>Lac</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Collection in Hand</Text>
              <Text style={styles.metricValue}>₹600</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Available Limit</Text>
              <Text style={styles.metricValue}>₹9.99</Text>
              <Text style={styles.metricSubtitle}>Lac</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Look Into Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Look into</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={[styles.lookIntoItem, styles.successBackground]}>
              <View style={styles.lookIntoLeft}>
                <View style={[styles.lookIntoIcon, styles.successIcon]}>
                  <Text style={styles.iconEmoji}>📋</Text>
                </View>
                <Text style={styles.lookIntoText}>Mark visit on unallocated loans</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Search size={16} color="gray" />
                <Text style={styles.actionButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.lookIntoItem, styles.errorBackground]}>
              <View style={styles.lookIntoLeft}>
                <View style={[styles.lookIntoIcon, styles.errorIcon]}>
                  <Text style={styles.iconEmoji}>⚠️</Text>
                </View>
                <Text style={styles.lookIntoText}>7 Missed PTP/Visit/Call</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.lookIntoItem, styles.infoBackground]}>
              <View style={styles.lookIntoLeft}>
                <View style={[styles.lookIntoIcon, styles.infoIcon]}>
                  <Text style={styles.iconEmoji}>👤</Text>
                </View>
                <Text style={styles.lookIntoText}>Facing an issue? Get support</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Today's Calendar */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Calendar</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.calendarMetrics}>
              <TouchableOpacity style={[styles.metricCard, styles.defaultBackground]}>
                <Text style={styles.metricTitle}>Planned Visits</Text>
                <Text style={styles.metricValue}>{plannedVisits.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.metricCard, styles.successBackground]}>
                <Text style={styles.metricTitle}>Completed Visits</Text>
                <Text style={styles.metricValue}>{completedVisits.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.metricCard, styles.warningBackground]}>
                <Text style={styles.metricTitle}>Pending Visits</Text>
                <Text style={styles.metricValue}>{pendingVisits.length}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.performanceCard}>
              <Text style={styles.performanceText}>
                Check your collection performance!
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  agentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 16,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  agentDetails: {
    gap: 2,
  },
  agentName: {
    fontWeight: '600',
    fontSize: 18,
    color: '#111827',
  },
  agentRole: {
    fontSize: 14,
    color: '#6b7280',
  },
  clockSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  clockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clockInButton: {
    backgroundColor: '#3b82f6',
  },
  clockOutButton: {
    backgroundColor: '#ef4444',
  },
  clockButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  clockTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricSubtitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  lookIntoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  lookIntoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  lookIntoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  lookIntoText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#111827',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  successBackground: {
    backgroundColor: '#f0fdf4',
  },
  successIcon: {
    backgroundColor: '#22c55e',
  },
  errorBackground: {
    backgroundColor: '#fef2f2',
  },
  errorIcon: {
    backgroundColor: '#ef4444',
  },
  infoBackground: {
    backgroundColor: '#eff6ff',
  },
  infoIcon: {
    backgroundColor: '#3b82f6',
  },
  calendarMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  defaultBackground: {
    backgroundColor: '#f3f4f6',
  },
  warningBackground: {
    backgroundColor: '#fef3c7',
  },
  performanceCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  performanceText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
  },
});