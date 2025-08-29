import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncEvent {
  type: 'loan_update' | 'visit_update' | 'task_update' | 'collection_activity';
  entity_id: string;
  data: any;
  source: 'fos' | 'collection_portal';
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, action, payload } = await req.json();

    console.log('Collection Portal Sync Event:', { type, action, payload });

    switch (type) {
      case 'loan_status_sync':
        await handleLoanStatusSync(supabaseClient, payload);
        break;
      
      case 'visit_completion_sync':
        await handleVisitCompletionSync(supabaseClient, payload);
        break;
      
      case 'collection_activity_sync':
        await handleCollectionActivitySync(supabaseClient, payload);
        break;
      
      case 'webhook_from_collection_portal':
        await handleCollectionPortalWebhook(supabaseClient, payload);
        break;
      
      default:
        throw new Error(`Unknown sync type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Sync completed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Collection Portal Sync Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function handleLoanStatusSync(supabaseClient: any, payload: any) {
  const { loan_id, status, recovery_amount, last_payment_date, notes } = payload;
  
  // Update loan in FOS database
  const { error } = await supabaseClient
    .from('loans')
    .update({
      status,
      recovery_amount,
      last_payment_date,
      notes: notes || null,
      updated_at: new Date().toISOString()
    })
    .eq('loan_id', loan_id);

  if (error) {
    throw new Error(`Failed to update loan status: ${error.message}`);
  }

  console.log(`Loan ${loan_id} status synced successfully`);
}

async function handleVisitCompletionSync(supabaseClient: any, payload: any) {
  const { visit_id, outcome, notes, completed_at } = payload;
  
  // Update visit in FOS database
  const { error } = await supabaseClient
    .from('visits')
    .update({
      status: 'completed',
      outcome,
      notes,
      completed_at: completed_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', visit_id);

  if (error) {
    throw new Error(`Failed to update visit completion: ${error.message}`);
  }

  console.log(`Visit ${visit_id} completion synced successfully`);
}

async function handleCollectionActivitySync(supabaseClient: any, payload: any) {
  const { loan_id, activity_type, amount, notes, timestamp } = payload;
  
  // Create a task based on collection activity
  const { error } = await supabaseClient
    .from('tasks')
    .insert({
      title: `Collection Activity: ${activity_type}`,
      description: `Amount: ${amount}. Notes: ${notes}`,
      type: 'Collection',
      status: 'completed',
      priority: 'medium',
      loan_id,
      due_at: timestamp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`Failed to create collection activity task: ${error.message}`);
  }

  console.log(`Collection activity for loan ${loan_id} synced successfully`);
}

async function handleCollectionPortalWebhook(supabaseClient: any, payload: any) {
  // Handle incoming webhooks from Collection Portal
  const { event_type, data } = payload;
  
  switch (event_type) {
    case 'payment_received':
      await handleLoanStatusSync(supabaseClient, {
        loan_id: data.loan_id,
        status: 'current',
        recovery_amount: data.amount,
        last_payment_date: data.payment_date,
        notes: `Payment received: ${data.amount}`
      });
      break;
      
    case 'loan_defaulted':
      await handleLoanStatusSync(supabaseClient, {
        loan_id: data.loan_id,
        status: 'default',
        notes: `Loan defaulted: ${data.reason}`
      });
      break;
      
    default:
      console.log(`Unhandled webhook event: ${event_type}`);
  }
}