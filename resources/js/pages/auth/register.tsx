import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
  return (
    <AuthLayout
      title="Fiók létrehozása"
      description="Add meg az adataidat az alábbi mezőkben a fiók létrehozásához"
    >
      <Head title="Regisztráció" />
      <Form
        {...store.form()}
        resetOnSuccess={['password', 'password_confirmation']}
        disableWhileProcessing
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Név</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="name"
                  name="name"
                  placeholder="Teljes név"
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email cím</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  tabIndex={2}
                  autoComplete="email"
                  name="email"
                  placeholder="pelda@email.hu"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Jelszó</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  tabIndex={3}
                  autoComplete="new-password"
                  name="password"
                  placeholder="Jelszó"
                />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">
                  Jelszó megerősítése
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  tabIndex={4}
                  autoComplete="new-password"
                  name="password_confirmation"
                  placeholder="Jelszó megerősítése"
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <Button
                type="submit"
                className="mt-2 w-full"
                tabIndex={5}
                data-test="register-user-button"
              >
                {processing && <Spinner />}
                Fiók létrehozása
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Már van fiókod?{' '}
              <TextLink href={login()} tabIndex={6}>
                Bejelentkezés
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
