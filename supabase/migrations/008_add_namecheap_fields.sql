-- Add Namecheap-specific fields to domains table
ALTER TABLE domains 
  ADD COLUMN IF NOT EXISTS purchase_source TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS namecheap_order_id TEXT,
  ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT FALSE;

-- Add index for purchase_source
CREATE INDEX IF NOT EXISTS idx_domains_purchase_source ON domains(purchase_source);

-- Add comment for documentation
COMMENT ON COLUMN domains.purchase_source IS 'Source of domain purchase: namecheap, manual, etc.';
COMMENT ON COLUMN domains.namecheap_order_id IS 'Order ID from Namecheap when domain was purchased through API';
COMMENT ON COLUMN domains.auto_renew IS 'Whether domain has auto-renewal enabled';


