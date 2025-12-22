import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
  requiresConfirmation?: boolean;
  twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kétfaktoros hitelesítés',
    href: show.url(),
  },
];

export default function TwoFactor({
  requiresConfirmation = false,
  twoFactorEnabled = false,
}: TwoFactorProps) {
  const {
    qrCodeSvg,
    hasSetupData,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
  } = useTwoFactorAuth();
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kétfaktoros hitelesítés" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Kétfaktoros hitelesítés"
            description="Kezeld a kétfaktoros hitelesítés beállításait"
          />
          {twoFactorEnabled ? (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="default">Engedélyezve</Badge>
              <p className="text-muted-foreground">
                A kétfaktoros hitelesítés engedélyezése esetén a
                bejelentkezéskor egy biztonságos, véletlenszerű PIN-kódot kell
                megadnod, amelyet a telefonodon lévő TOTP-támogatott
                alkalmazásból olvashatsz le.
              </p>

              <TwoFactorRecoveryCodes
                recoveryCodesList={recoveryCodesList}
                fetchRecoveryCodes={fetchRecoveryCodes}
                errors={errors}
              />

              <div className="relative inline">
                <Form {...disable.form()}>
                  {({ processing }) => (
                    <Button
                      variant="destructive"
                      type="submit"
                      disabled={processing}
                    >
                      <ShieldBan /> 2FA letiltása
                    </Button>
                  )}
                </Form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start space-y-4">
              <Badge variant="destructive">Letiltva</Badge>
              <p className="text-muted-foreground">
                A kétfaktoros hitelesítés engedélyezésekor a bejelentkezéskor
                egy biztonságos PIN-kódot kell megadnod. Ez a PIN-kód egy
                TOTP-támogatott alkalmazásból olvasható le a telefonodon.
              </p>

              <div>
                {hasSetupData ? (
                  <Button onClick={() => setShowSetupModal(true)}>
                    <ShieldCheck />
                    Beállítás folytatása
                  </Button>
                ) : (
                  <Form
                    {...enable.form()}
                    onSuccess={() => setShowSetupModal(true)}
                  >
                    {({ processing }) => (
                      <Button type="submit" disabled={processing}>
                        <ShieldCheck />
                        2FA engedélyezése
                      </Button>
                    )}
                  </Form>
                )}
              </div>
            </div>
          )}

          <TwoFactorSetupModal
            isOpen={showSetupModal}
            onClose={() => setShowSetupModal(false)}
            requiresConfirmation={requiresConfirmation}
            twoFactorEnabled={twoFactorEnabled}
            qrCodeSvg={qrCodeSvg}
            manualSetupKey={manualSetupKey}
            clearSetupData={clearSetupData}
            fetchSetupData={fetchSetupData}
            errors={errors}
          />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
