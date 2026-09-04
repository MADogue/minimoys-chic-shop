-- orders: validate guest checkout content
DROP POLICY "Anyone can create an order" ON public.orders;
CREATE POLICY "Anyone can create an order" ON public.orders
FOR INSERT TO anon, authenticated
WITH CHECK (
  customer_name IS NOT NULL AND char_length(customer_name) BETWEEN 2 AND 100
  AND customer_contact IS NOT NULL AND char_length(customer_contact) BETWEEN 6 AND 30
  AND commune IS NOT NULL AND char_length(commune) BETWEEN 2 AND 100
  AND quartier IS NOT NULL AND char_length(quartier) BETWEEN 2 AND 100
  AND total >= 0 AND total < 100000000
  AND status = 'pending'::order_status
  AND channel = 'whatsapp'
);

-- product_views: only existing products, bounded session id
DROP POLICY "Anyone can record a product view" ON public.product_views;
CREATE POLICY "Anyone can record a product view" ON public.product_views
FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id)
  AND (session_id IS NULL OR char_length(session_id) <= 100)
);