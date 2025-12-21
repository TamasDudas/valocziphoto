import aboutImage from '@/assets/images/ezster-es-laci.jpg';
import Banner from '@/components/Banner';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AboutUs() {
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';
  const ogImageUrl = `${appUrl}${aboutImage}`;

  return (
    <AppLayout>
      <Head>
        <title>Rólunk - Valóczi Photo</title>
        <meta
          name="description"
          content="Valóczi László és Kőhalmi Eszter - professzionális fotósok. Nem erőltetjük rád a saját elképzeléseinket, hanem azt keressük, ami Neked áll jól."
        />

        {/* Canonical URL */}
        <link rel="canonical" href={`${appUrl}/rolunk`} />

        {/* Open Graph */}
        <meta property="og:title" content="Rólunk - Valóczi Photo" />
        <meta
          property="og:description"
          content="Valóczi László és Kőhalmi Eszter - professzionális fotósok. Kreatív fotózás, ami Neked áll jól."
        />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${appUrl}/rolunk`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rólunk - Valóczi Photo" />
        <meta
          name="twitter:description"
          content="Valóczi László és Kőhalmi Eszter - professzionális fotósok."
        />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <Banner
        aboutImage={aboutImage}
        title={'Profil'}
        text={
          <>
            <p>
              Instafilter, hashtag művészkép…? Ha ennél többre vágysz, kérlek,
              olvasd el a következő pár sort!  Kezdhetnénk azzal, hogy mit
              tanultunk, hol és mikor, vagy valami légbőlkapott, kitalált
              stílust kisajátítva, annak elvont, nagyon szakmainak tűnő
              magyarázatával… de ez a lényegen nem változtat: Amikor fotózunk,
              kik is vagyunk mi? Mi vagyunk minden ötleted megvalósítója.
            </p>
            <p className="mt-2">
              – Nem erőltetjük rád a saját elképzeléseinket. A gondolataid
              mögötti kreativitás.
            </p>
            <p className="mt-2">
              – Segítünk exkluzív módon megvalósítani. A jól elkapott pillanat.
            </p>
            <p className="mt-2">
              – Ugye nem szolgál magyarázatra? A kompromisszum a divatos és az
              időtlen között.
            </p>
            <p className="mt-2">
              – Mindenki páratlan, így minden ihlet más és más. És akik
              segítenek, ha nincs ötleted.
            </p>
            <p className="mt-2">
              – A referenciáink alapján láthatod, hogy nem feltétlenül az
              aktuális trendet követjük, hanem azt keressük, ami Neked áll jól.
            </p>
          </>
        }
      />
    </AppLayout>
  );
}
