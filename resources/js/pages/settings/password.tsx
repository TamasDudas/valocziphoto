import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/user-password';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Jelszó beállítások',
    href: edit().url,
  },
];

export default function Password() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Jelszó beállítás" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Jelszó frissítése"
            description="Győződjön meg arról, hogy fiókja hosszú, véletlenszerű jelszót használ a biztonság érdekében"
          />

          <Form
            {...PasswordController.update.form()}
            options={{
              preserveScroll: true,
            }}
            resetOnError={[
              'password',
              'password_confirmation',
              'current_password',
            ]}
            resetOnSuccess
            onError={(errors) => {
              if (errors.password) {
                passwordInput.current?.focus();
              }

              if (errors.current_password) {
                currentPasswordInput.current?.focus();
              }
            }}
            className="space-y-6"
          >
            {({ errors, processing, recentlySuccessful }) => (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="current_password">Jelenlegi jelszó</Label>

                  <Input
                    id="current_password"
                    ref={currentPasswordInput}
                    name="current_password"
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="current-password"
                    placeholder="Jelenlegi jelszó"
                  />

                  <InputError message={errors.current_password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Új jelszó</Label>

                  <Input
                    id="password"
                    ref={passwordInput}
                    name="password"
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder="Új jelszó"
                  />

                  <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    Jelszó megerősítése
                  </Label>

                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder="Jelszó megerősítése"
                  />

                  <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    disabled={processing}
                    data-test="update-password-button"
                  >
                    Jelszó Mentése
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-neutral-600">Mentés</p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
