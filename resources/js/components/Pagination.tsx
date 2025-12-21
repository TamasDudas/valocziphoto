import { Link } from '@inertiajs/react';

// Laravel pagination link típusa
interface PaginationLink {
  url: string | null; // null ha nem kattintható (pl. "..." vagy disabled)
  label: string; // Szöveg: "1", "2", "Next", "Previous", "&laquo;", "&raquo;"
  active: boolean; // true ha ez az aktuális oldal
}

interface Props {
  links: PaginationLink[]; // Laravel automatikusan generálja ezeket
}

export default function Pagination({ links }: Props) {
  // Magyar fordítás a gombokhoz
  const translateLabel = (label: string): string => {
    return label.replace('Previous', 'Előző').replace('Next', 'Következő');
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {links.map((link, index) => {
        const translatedLabel = translateLabel(link.label);

        // Ha nincs URL (disabled link vagy "..."), csak szövegként jelenítjük meg
        if (!link.url) {
          return (
            <span
              key={index}
              className="px-3 py-2 text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: translatedLabel }}
              //^^^^^^^^
              //Gomb szöveg magyarosítva
            />
          );
        }

        // Aktív oldal - kiemelt stílus
        if (link.active) {
          return (
            <span
              key={index}
              className="rounded bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              dangerouslySetInnerHTML={{ __html: translatedLabel }}
            />
          );
        }

        // Kattintható link - Inertia Link komponens (SPA navigáció)
        return (
          <Link
            key={index}
            href={link.url}
            preserveScroll // Ne ugorjon az oldal tetejére kattintáskor
            className="rounded px-3 py-2 text-sm hover:bg-accent"
            dangerouslySetInnerHTML={{ __html: translatedLabel }}
          />
        );
      })}
    </div>
  );
}
