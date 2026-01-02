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
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: {
    data: Category[];
  };
}

export default function Categories({ categories }: Props) {
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;

    router.delete(`/categories/${categoryToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setCategoryToDelete(null);
      },
    });
  };

  return (
    <>
      <AppLayout>
        <div className="py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-xl sm:rounded-lg">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Kategóriák kezelése</h2>
                <div className="space-y-4">
                  {categories.data.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-4"
                    >
                      <div className="text-lg font-medium">{category.name}</div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            router.visit(`/categories/${category.id}/edit`)
                          }
                          variant="outline"
                        >
                          Szerkesztés
                        </Button>
                        <Button
                          onClick={() => setCategoryToDelete(category)}
                          variant="destructive"
                        >
                          Törlés
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categories.data.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      Még nincs kategória létrehozva.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>

      {/* AlertDialog a kategória törlésének megerősítéséhez */}
      <AlertDialog
        /* Az open prop azt szabályozza, hogy az AlertDialog nyitva van-e vagy sem.
            Itt !!categoryToDelete azt jelenti, hogy nyitva van, ha van kiválasztott kategória törlésre (categoryToDelete nem null).
            A !! (dupla negáció) explicit módon boolean-ra konvertálja az értéket, biztosítva, hogy az open prop mindig boolean típusú legyen.
            Nem használhatjuk közvetlenül a setCategoryToDelete-et, mert az egy setter függvény, amely beállítja az állapotot,
            de az open-nek az állapot aktuális értékére (boolean-ra) van szüksége. */
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztosan törlöd a kategóriát?</AlertDialogTitle>
            <AlertDialogDescription>
              Törlöd ezt a kategóriát: <strong>{categoryToDelete?.name}</strong>
              <br />
              <br />
              Ez a művelet nem vonható vissza. A kategória törlésre kerül, de a
              képek megmaradnak a galériában.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégse</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>
              Kategória törlése
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
