import {
  store,
  update,
} from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, router, usePage } from '@inertiajs/react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
}

interface Props {
  category?: Category;
}

export default function CategoryForm({ category }: Props) {
  const isEditing = !!category;
  const { errors } = usePage().props;

  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <Form
        method={isEditing ? 'patch' : 'post'}
        action={isEditing ? update.url(category.id) : store.url()}
        resetOnSuccess={!isEditing}
        options={{
          preserveScroll: true,
        }}
        className="flex w-full max-w-xl flex-col gap-8"
      >
        {({ processing }) => (
          <>
            {isEditing && (
              <h1 className="text-2xl font-bold">Kategória szerkesztése</h1>
            )}

            <div>
              <Label htmlFor="name">Kategória neve</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={category?.name || ''}
                placeholder="Kategória neve"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Kategória leírása</Label>
              <Input
                id="description"
                name="description"
                type="text"
                defaultValue={category?.description || ''}
                placeholder="Kategória leírása"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="meta_title">Meta Title (SEO)</Label>
              <Input
                id="meta_title"
                name="meta_title"
                type="text"
                defaultValue={category?.meta_title || ''}
                placeholder="SEO title (max 60 karakter)"
                maxLength={60}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Keresőmotorokban megjelenő cím. Ha üres, a kategória neve lesz.
              </p>
              {errors.meta_title && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.meta_title}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="meta_description">Meta Description (SEO)</Label>
              <Textarea
                id="meta_description"
                name="meta_description"
                defaultValue={category?.meta_description || ''}
                placeholder="SEO leírás (max 160 karakter)"
                maxLength={160}
                rows={3}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Keresőmotorokban megjelenő leírás. Ha üres, a kategória leírása
                lesz.
              </p>
              {errors.meta_description && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.meta_description}
                </p>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={processing}>
                  {processing ? 'Mentés...' : 'Mentés'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit(`/categories/${category.id}`)}
                  className="flex-1"
                  disabled={processing}
                >
                  Mégse
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                className="m-auto mt-8 w-3xs"
                disabled={processing}
              >
                {processing ? 'Létrehozás...' : 'Létrehozás'}
              </Button>
            )}
          </>
        )}
      </Form>
    </div>
  );
}
