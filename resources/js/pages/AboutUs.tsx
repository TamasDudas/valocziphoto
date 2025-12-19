import aboutImage from '@/assets/images/ezster-es-laci.jpg';
import Banner from '@/components/Banner';
import AppLayout from '@/layouts/app-layout';

export default function AboutUs() {
  return (
    <AppLayout>
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
