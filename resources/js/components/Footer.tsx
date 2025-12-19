import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-14">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Bemutatkozás */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Valóczi Photo</h3>
            <p className="text-sm text-muted-foreground">
              Professzionális fotós szolgáltatások esküvőkre, eseményekre és
              portré fotózásra.
            </p>
          </div>

          {/* Navigáció */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigáció</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Főoldal
              </Link>
              <Link
                href="/rolunk"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Rólunk
              </Link>
              <Link
                href="/kapcsolat"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Kapcsolat
              </Link>
              <Link
                href="/aszf"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                ÁSZF
              </Link>
            </nav>
          </div>

          {/* Elérhetőségek */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Elérhetőség</h3>
            <div className="flex flex-col space-y-3 text-sm">
              <a
                href="mailto:info@valocziphoto.hu"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                info@valocziphoto.hu
              </a>
              <a
                href="tel:+36301234567"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                +36 ?????????
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kövess minket</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/valocziphoto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background transition-colors hover:bg-accent"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/valocziphoto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background transition-colors hover:bg-accent"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Valóczi Photo. Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}
