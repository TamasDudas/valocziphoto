import { store } from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';

export default function CategoryForm() {
    return (
        <Form
            action={store()}
            method="POST"
            className="space-y-4"
            resetOnSuccess
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

            <Button type="submit">Létrehozás</Button>
        </Form>
    );
}
