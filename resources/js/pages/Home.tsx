import boritoKep from '@/assets/images/borito.jpg';

import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  images_count?: number;
  featured_image?: {
    id: number;
    image_url: string;
    original_filename: string;
  };
}

interface Props {
  canRegister?: boolean;
  categories: {
    data: Category[];
  };
}

export default function Home({ canRegister = true, categories }: Props) {
  const categoryList = categories.data;
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';
  const ogImageUrl = `${appUrl}${boritoKep}`;

  return (
    <AppLayout>
      <Head>
        <title>Valóczi Photo - Professzionális Fotózás</title>
        <meta
          name="description"
          content="Valóczi László és Kőhalmi Eszter professzionális fotós galériája. Esküvői, portré és esemény fotózás."
        />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta
          property="og:title"
          content="Valóczi Photo - Professzionális Fotózás"
        />
        <meta
          property="og:description"
          content="Valóczi László és Kőhalmi Eszter professzionális fotós galériája. Esküvői, portré és esemény fotózás."
        />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={appUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Valóczi László és Kőhalmi Eszter - Professzionális Fotózás"
        />
        <meta
          name="twitter:description"
          content="Valóczi László és Kőhalmi Eszter professzionális fotós galériája."
        />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <div className="h-52 w-full sm:h-44 md:h-80 lg:h-[28rem]">
        <img
          src={boritoKep}
          alt="Borító kép"
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div>
        {categoryList.length === 0 ? (
          <p className="text-gray-500">Nincsenek kategóriák.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {categoryList.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
              >
                {category.featured_image && (
                  <img
                    src={category.featured_image.image_url}
                    alt={category.name}
                    className="h-100 w-full object-cover"
                  />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
