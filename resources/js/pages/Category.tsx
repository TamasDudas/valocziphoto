import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Image {
  id: number;
  filename: string;
  original_filename: string;
  alt_text?: string;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  featured_image_id?: number;
  featured_image?: Image;
  images: Image[];
}

export default function CategoryGallery() {
  const { category, auth } = usePage<{
    category: Category;
    auth: { user?: any };
  }>().props;
  const [imageToRemove, setImageToRemove] = useState<Image | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // SEO meta adatok előkészítése
  const metaTitle = category?.meta_title || category?.name || 'Kategória';
  const metaDescription =
    category?.meta_description ||
    category?.description ||
    `${category?.name} - Valóczi Photo galéria`;
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';
  const ogImageUrl = category?.featured_image
    ? `${appUrl}${category.featured_image.image_url}`
    : `${appUrl}/images/default-og.jpg`;
  const canonicalUrl = `${appUrl}/categories/${category?.slug}`;

  // Szűrjük ki a kiemelt képet a többi közül
  const otherImages =
    category?.images?.filter((img) => img.id !== category?.featured_image_id) ||
    [];

  const confirmRemoveImage = () => {
    if (!imageToRemove) return;

    router.post(
      `/categories/${category.id}/detach-image`,
      {
        image_id: imageToRemove.id,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setImageToRemove(null);
        },
      },
    );
  };

  return (
    <AppLayout>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <div>
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Kiemelt kép felül */}
              {category.featured_image && (
                <div className="mt-6 mb-8">
                  <div className="relative h-[40vh] md:h-[50vh] lg:h-[85vh]">
                    <img
                      src={category.featured_image.image_url}
                      alt={
                        category.featured_image.alt_text ||
                        category.featured_image.original_filename
                      }
                      className="h-full w-full rounded-2xl object-cover object-center shadow-lg"
                    />
                  </div>
                </div>
              )}

              {/* Cím és leírás középen alatta */}
              <div className="my-12 text-center">
                <h1 className="mb-4 text-4xl font-bold">
                  {category?.name || 'Kategória név hiányzik'}
                </h1>
                {category?.description && (
                  <p className="lg:px-60 dark:text-gray-200">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Galéria */}
              {otherImages.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Galéria</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {otherImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative cursor-pointer overflow-hidden rounded bg-input transition-transform hover:scale-105"
                        onClick={() =>
                          setLightboxIndex(otherImages.indexOf(image))
                        }
                      >
                        <img
                          src={image.image_url}
                          alt={image.alt_text || image.original_filename}
                          className="h-48 w-full object-cover"
                        />
                        <div className="p-2">
                          <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                            {image.original_filename}
                          </p>
                          {auth.user && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageToRemove(image);
                              }}
                              variant="destructive"
                              size="sm"
                              className="mt-2 w-full"
                            >
                              Eltávolítás
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Üres állapot */}
              {!category.featured_image && otherImages.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">
                    Ehhez a kategóriához még nincsenek képek hozzárendelve.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AlertDialog a kép eltávolításának megerősítéséhez */}
      <AlertDialog
        open={!!imageToRemove}
        onOpenChange={(open) => !open && setImageToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztosan eltávolítod?</AlertDialogTitle>
            <AlertDialogDescription>
              Eltávolítod ezt a képet a kategóriából:{' '}
              <strong>{imageToRemove?.original_filename}</strong>
              <br />
              <br />A kép megmarad a galériában, és más kategóriákban is
              elérhető marad.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégse</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveImage}>
              Eltávolítás
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={otherImages.map((image) => ({
          src: image.image_url,
          alt: image.alt_text || image.original_filename,
          title: image.original_filename,
        }))}
      />
    </AppLayout>
  );
}
