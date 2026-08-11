CREATE TABLE public.products (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  category TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  badge TEXT,
  is_new BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (id, name, description, price, original_price, category, brand, image, rating, review_count, stock, is_new) VALUES
('hoodie-premium','Hoodie Premium Noir','Sweat à capuche coupe oversize en coton lourd 380g. Confort maximal, tenue impeccable, coloris intemporel.',25000,32000,'vetements','MS Essentials','hero',4.6,128,24,true),
('sneakers-ms','Sneakers MS Classic','Sneakers minimalistes en cuir souple, semelle amortissante, silhouette épurée pour un style quotidien.',45000,NULL,'chaussures','MS Studio','cat-shoes',4.8,214,12,false),
('montre-elegante','Montre Élégante Steel','Montre analogique cadran noir, bracelet acier inoxydable. Étanche 3ATM, design minimaliste unisexe.',30000,38000,'montres','MS Timepieces','cat-watches',4.4,76,18,false),
('sac-a-dos-ms','Sac à dos MS Urban','Sac à dos structuré en cuir vegan, compartiment laptop 15", plusieurs poches organisées.',20000,NULL,'sacs','MS Studio','cat-bags',4.5,92,30,true),
('ecouteurs-sans-fil','Écouteurs Sans-fil Pro','Écouteurs Bluetooth 5.3, réduction de bruit active, autonomie 24h avec le boîtier de charge.',15000,22000,'electronique','MS Audio','cat-audio',4.3,340,45,false),
('smartphone-noir','Smartphone Noir 128Go','Écran AMOLED 6.5", double SIM, batterie 5000mAh, triple caméra 50MP. Débloqué tous opérateurs.',280000,NULL,'telephones','MS Mobile','cat-phones',4.7,58,8,false),
('tshirt-minimaliste','T-shirt Minimaliste Blanc','T-shirt coton bio 220g, coupe régulière, finitions premium. Basique indispensable.',8000,NULL,'vetements','MS Essentials','cat-clothing',4.2,189,60,false),
('casque-audio','Casque Audio Studio','Casque circum-aural, drivers 40mm, son studio équilibré, coussinets mémoire de forme.',55000,68000,'electronique','MS Audio','cat-audio',4.9,44,15,true);