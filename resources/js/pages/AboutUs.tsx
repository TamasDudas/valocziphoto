import aboutImage from '@/assets/images/ezster-es-laci.jpg';
import AppLayout from '@/layouts/app-layout';

export default function AboutUs() {
  return (
    <AppLayout>
      <div className="my-8 flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/2">
          <img
            src={aboutImage}
            alt="Eszter és Laci"
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
        <div className="w-full md:m-auto md:w-1/2">
          <h2 className="mb-8 text-center text-4xl">Profil</h2>
          <p>
            Instafilter, hashtag művészkép…? Ha ennél többre vágysz, kérlek,
            olvasd el a következő pár sort!  Kezdhetnénk azzal, hogy mit
            tanultunk, hol és mikor, vagy valami légbőlkapott, kitalált stílust
            kisajátítva, annak elvont, nagyon szakmainak tűnő magyarázatával… de
            ez a lényegen nem változtat: Amikor fotózunk, kik is vagyunk mi? Mi
            vagyunk minden ötleted megvalósítója. – Nem erőltetjük rád a saját
            elképzeléseinket. A gondolataid mögötti kreativitás. – Segítünk
            exkluzív módon megvalósítani. A jól elkapott pillanat. – Ugye nem
            szolgál magyarázatra? A kompromisszum a divatos és az időtlen
            között. – Mindenki páratlan, így minden ihlet más és más. És akik
            segítenek, ha nincs ötleted. – A referenciáink alapján láthatod,
            hogy nem feltétlenül az aktuális trendet követjük, hanem azt
            keressük, ami Neked áll jól.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
