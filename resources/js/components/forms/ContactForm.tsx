import { store } from '@/actions/App/Http/Controllers/ContactController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';
export default function ContactForm() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Írj nekünk!</h2>
      </div>

      <Form
        action={store()}
        method="POST"
        className="flex w-full max-w-xl flex-col gap-4"
        resetOnSuccess
      >
        <div>
          <Label>Név</Label>
          <Input type="text" name="name" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" name="email" />
        </div>
        <div>
          <Label>Tárgy</Label>
          <Input type="text" name="subject" />
        </div>
        <div>
          <Label>Üzenet</Label>
          <Textarea
            rows={8}
            placeholder="Írd ide az üzeneted..."
            name="message"
          ></Textarea>
        </div>
        <Button type="submit" className="m-auto mt-8 w-3xs">
          Küldés
        </Button>
      </Form>
    </div>
  );
}
