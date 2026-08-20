ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS commune text,
  ADD COLUMN IF NOT EXISTS quartier text;