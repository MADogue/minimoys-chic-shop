import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-semibold tracking-wide">EV</div>
          <div className="mt-1 text-xs uppercase tracking-[0.25em] text-primary-foreground/70">
            Eventaya Service
          </div>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            Groupe d'achat en ligne en RDC. Vêtements, chaussures, téléphones et accessoires
            sélectionnés avec soin, livrés partout au pays.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Boutique</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/boutique">Tous les produits</Link></li>
            <li><Link to="/categories">Catégories</Link></li>
            <li><Link to="/favoris">Favoris</Link></li>
            <li><Link to="/panier">Panier</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Aide</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/mon-compte">Mon compte</Link></li>
            <li><Link to="/mes-commandes">Mes commandes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li>Kinshasa, République Démocratique du Congo</li>
            <li>WhatsApp : +243 000 000 000</li>
            <li>contact@eventaya.cd</li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full border border-primary-foreground/20 p-2 hover:bg-primary-foreground/10">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-primary-foreground/20 p-2 hover:bg-primary-foreground/10">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="WhatsApp" className="rounded-full border border-primary-foreground/20 p-2 hover:bg-primary-foreground/10">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Eventaya Service. Tous droits réservés.</p>
          <p>Paiement à la livraison · Mobile Money (à venir)</p>
        </div>
      </div>
    </footer>
  );
}
