import React, { useMemo, useState } from 'react';

const PHONE = '0176 12345678';
const PHONE_TEL = '+4917612345678';
const PHONE_LINK = '4917612345678';
const EMAIL = 'info@glanzwerk-reinigung.de';

const SERVICE_PRICES = {
  Büroreinigung: 1.25,
  Treppenhausreinigung: 120,
  Fensterreinigung: 4,
  Praxisreinigung: 55,
  Haushaltsreinigung: 35,
  Grundreinigung: 9,
};

function Logo({ hero = false }) {
  return (
    <img
      src="/logo.png"
      alt="Glanzwerk Gebäudereinigung"
      className={hero ? 'w-[300px] md:w-[520px]' : 'w-[180px] md:w-[240px]'}
    />
  );
}

function App() {
  const [service, setService] = useState('Büroreinigung');
  const [size, setSize] = useState(100);
  const [interval, setInterval] = useState('wöchentlich');
  const [extras, setExtras] = useState({
    fenster: false,
    desinfektion: false,
    grund: false,
    anfahrt: false,
  });

  const factor =
    interval === 'täglich'
      ? 20
      : interval === 'wöchentlich'
        ? 4
        : interval === '2x monatlich'
          ? 2
          : 1;

  const price = useMemo(() => {
    const safeSize = Number(size || 0);

    const base =
      service === 'Treppenhausreinigung'
        ? SERVICE_PRICES[service] * factor
        : safeSize * SERVICE_PRICES[service] * factor;

    const add =
      (extras.fenster ? safeSize * 2 : 0) +
      (extras.desinfektion ? safeSize * 0.08 : 0) +
      (extras.grund ? safeSize * 1.5 : 0) +
      (extras.anfahrt ? 20 : 0);

    return base + add;
  }, [service, size, factor, extras]);

  const whatsappText = encodeURIComponent(
    'Hallo Glanzwerk, ich möchte eine kostenlose Anfrage stellen.'
  );

  const toggleExtra = (key) => {
    setExtras((old) => ({
      ...old,
      [key]: !old[key],
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-[#071735]">
      <header className="bg-white shadow-lg">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4">
          <Logo />

          <nav className="hidden gap-8 text-sm font-black uppercase lg:flex">
            <a href="#start" className="text-[#0064df]">Startseite</a>
            <a href="#leistungen">Leistungen</a>
            <a href="#preise">Preise</a>
            <a href="#ueber">Über uns</a>
            <a href="#kontakt">Kontakt</a>
          </nav>

          <a
            href={`https://wa.me/${PHONE_LINK}?text=${whatsappText}`}
            className="hidden rounded-md bg-[#0064df] px-6 py-3 text-sm font-black uppercase text-white md:block"
          >
            Anfrage
          </a>
        </div>
      </header>

      <main id="start">
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
            <div>
              <h1 className="text-[42px] font-black uppercase leading-none md:text-[64px]">
                Wir bringen
                <br />
                <span className="text-[#0064df]">Glanz</span>
                <br />
                in Ihr Objekt.
              </h1>

              <p className="mt-6 max-w-[520px] text-lg leading-relaxed">
                Professionelle Gebäudereinigung für Büros, Praxen,
                Treppenhäuser, Haushalte und Gewerbeobjekte.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="rounded-md bg-[#0064df] px-8 py-4 text-center font-black uppercase text-white"
                >
                  Jetzt anrufen
                </a>

                <a
                  href={`https://wa.me/${PHONE_LINK}?text=${whatsappText}`}
                  className="rounded-md border-2 border-[#0064df] px-8 py-4 text-center font-black uppercase text-[#0064df]"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex justify-center rounded-[28px] bg-white p-8 shadow-2xl">
              <Logo hero />
            </div>
          </div>
        </section>

        <section id="leistungen" className="mx-auto max-w-[1300px] px-6 py-12">
          <h2 className="mb-8 text-center text-3xl font-black uppercase">
            Unsere Leistungen
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Büroreinigung',
              'Treppenhausreinigung',
              'Fensterreinigung',
              'Praxisreinigung',
              'Haushaltsreinigung',
              'Grundreinigung',
            ].map((item) => (
              <div key={item} className="rounded-xl bg-white p-7 shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0064df] font-black text-white">
                  ✓
                </div>
                <h3 className="text-lg font-black uppercase">{item}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Zuverlässige, gründliche und professionelle Reinigung nach Ihren Anforderungen.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="preise" className="mx-auto max-w-[1300px] px-6 pb-12">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="bg-[#0064df] px-6 py-5 text-sm font-black uppercase text-white">
              Preisrechner – kostenlos & unverbindlich
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-2">
              <div>
                <label className="text-sm font-black uppercase">Leistung auswählen</label>
                <select
                  className="mt-2 w-full rounded-md border px-4 py-3"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {Object.keys(SERVICE_PRICES).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="text-sm font-black uppercase">Objektgröße</span>
                    <input
                      className="mt-2 w-full rounded-md border px-4 py-3"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </label>

                  <label>
                    <span className="text-sm font-black uppercase">Intervall</span>
                    <select
                      className="mt-2 w-full rounded-md border px-4 py-3"
                      value={interval}
                      onChange={(e) => setInterval(e.target.value)}
                    >
                      <option>wöchentlich</option>
                      <option>2x monatlich</option>
                      <option>monatlich</option>
                      <option>täglich</option>
                    </select>
                  </label>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  {[
                    ['fenster', 'Fensterreinigung'],
                    ['desinfektion', 'Desinfektion'],
                    ['grund', 'Grundreinigung'],
                    ['anfahrt', 'Anfahrt'],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={extras[key]}
                        onChange={() => toggleExtra(key)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-7 text-center">
                <p className="text-sm font-bold uppercase">Ihr Preis</p>
                <p className="mt-3 text-5xl font-black text-[#0064df]">
                  {price.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  €
                </p>
                <p className="mt-2 text-sm">inkl. MwSt.</p>

                <a
                  href={`https://wa.me/${PHONE_LINK}?text=${whatsappText}`}
                  className="mt-6 block rounded-md bg-[#0064df] px-6 py-4 font-black uppercase text-white"
                >
                  Angebot anfordern
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="ueber" className="mx-auto max-w-[1300px] px-6 pb-12">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-black uppercase">Über uns</h2>
            <p className="mt-4 max-w-[900px] leading-relaxed">
              Glanzwerk Gebäudereinigung steht für Qualität, Zuverlässigkeit und höchste Sauberkeitsstandards.
              Wir reinigen Büros, Praxen, Treppenhäuser und Objekte aller Art – gründlich, pünktlich und professionell.
            </p>
          </div>
        </section>

        <section id="kontakt" className="mx-auto max-w-[1300px] px-6 pb-12">
          <div className="grid overflow-hidden rounded-xl bg-gradient-to-r from-[#071735] to-[#0064df] text-white shadow-2xl md:grid-cols-3">
            <a href={`tel:${PHONE_TEL}`} className="p-7 text-center">
              <p className="text-sm uppercase">Telefon</p>
              <p className="mt-2 text-2xl font-black">{PHONE}</p>
            </a>

            <a href={`mailto:${EMAIL}`} className="p-7 text-center">
              <p className="text-sm uppercase">E-Mail</p>
              <p className="mt-2 text-xl font-black">{EMAIL}</p>
            </a>

            <a
              href={`https://wa.me/${PHONE_LINK}?text=${whatsappText}`}
              className="bg-[#0064df] p-7 text-center"
            >
              <p className="text-sm uppercase">WhatsApp</p>
              <p className="mt-2 text-2xl font-black">Anfrage senden</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;