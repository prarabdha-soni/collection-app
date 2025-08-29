-- Create function to get recent loans for syncing
CREATE OR REPLACE FUNCTION public.get_recent_loans(hours_ago INTEGER DEFAULT 24)
RETURNS TABLE (
  loan_id TEXT,
  status TEXT,
  recovery_amount DECIMAL,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.loan_id,
    l.status,
    l.recovery_amount,
    l.last_payment_date,
    l.notes,
    l.updated_at
  FROM loans l
  WHERE l.updated_at >= NOW() - INTERVAL '1 hour' * hours_ago
  ORDER BY l.updated_at DESC;
END;
$$;