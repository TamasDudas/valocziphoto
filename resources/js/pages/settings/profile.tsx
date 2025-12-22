import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profil beállítások',
    href: edit().url,
  },
];

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profil beállítások" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Profil információk"
            description="Név és email frissítés"
          />

          <Form
            {...ProfileController.update.form()}
            options={{
              preserveScroll: true,
            }}
            className="space-y-6"
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Név</Label>

                  <Input
                    id="name"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.name}
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Teljes név"
                  />

                  <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email cím</Label>

                  <Input
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.email}
                    name="email"
                    required
                    autoComplete="username"
                    placeholder="Email cím"
                  />

                  <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && auth.user.email_verified_at === null && (
                  <div>
                    <p className="-mt-4 text-sm text-muted-foreground">
                      Az email címed nincs ellenőrizve.{' '}
                      <Link
                        href={send()}
                        as="button"
                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                      >
                        Kattints ide az ellenőrző email újraküldéséhez.
                      </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        A megerősítő linket elküldtük az email címedre.
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button
                    disabled={processing}
                    data-test="update-profile-button"
                  >
                    Mentés
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-neutral-600">Mentve</p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
