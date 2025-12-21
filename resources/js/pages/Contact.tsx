import ContactForm from '@/components/forms/ContactForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Contact() {
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';

  return (
    <AppLayout>
      <Head>
        <title>Kapcsolat - Valóczi Photo</title>
        <meta
          name="description"
          content="Lépj kapcsolatba velünk! Valóczi László és Kőhalmi Eszter - professzionális fotósok. Esküvői, portré és esemény fotózás."
        />

        {/* Canonical URL */}
        <link rel="canonical" href={`${appUrl}/kapcsolat`} />

        {/* Open Graph */}
        <meta property="og:title" content="Kapcsolat - Valóczi Photo" />
        <meta
          property="og:description"
          content="Lépj kapcsolatba velünk! Professzionális fotózás Valóczi Lászlótól és Kőhalmi Esztertől."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${appUrl}/kapcsolat`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Kapcsolat - Valóczi Photo" />
        <meta
          name="twitter:description"
          content="Lépj kapcsolatba velünk! Professzionális fotózás."
        />
      </Head>
      <ContactForm />
    </AppLayout>
  );
}
