import { store } from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';

export default function CategoryForm() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <Form
        action={store()}
        method="POST"
        resetOnSuccess
        className="flex w-full max-w-xl flex-col gap-8"
      >
        <div>
          <Label htmlFor="name">Kategória neve</Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Kategória neve"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Kategória leírása</Label>
          <Input
            id="description"
            type="text"
            name="description"
            placeholder="Kategória leírása"
          />
        </div>

        <Button type="submit" className="m-auto mt-8 w-3xs">
          Létrehozás
        </Button>
      </Form>
    </div>
  );
}
