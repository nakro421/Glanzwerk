import React, { useMemo, useState } from 'react';

const SERVICE_CONFIG = {
  'Büroreinigung': {
    unit: 'Stunden',
    min: 35,
    max: 45,
    defaultPrice: 40,
    defaultQuantity: 10,
    defaultFrequency: 4,
    note: 'Ideal für Büros, Kanzleien und kleine Gewerbekunden.',
  },
  'Fensterreinigung': {
    unit: 'm²',
    min: 3,
    max: 6,
    defaultPrice: 4,
    defaultQuantity: 50,
    defaultFrequency: 1,
    note: 'Innen, außen und Rahmen können separat berechnet werden.',
  },
  'Treppenhausreinigung': {
    unit: 'Objekt/Monat',
    min: 80,
    max: 250,
    defaultPrice: 120,
    defaultQuantity: 1,
    defaultFrequency: 1,
    note: 'Perfekt für feste monatliche Verträge mit Hausverwaltungen.',
  },
  'Praxisreinigung': {
    unit: 'Stunden',
    min: 45,
    max: 70,
    defaultPrice: 55,
    defaultQuantity: 8,
    defaultFrequency: 8,
    note: 'Hygiene, Dokumentation und Zuverlässigkeit rechtfertigen höhere Preise.',
  },
  'Grundreinigung': {
    unit: 'm²',
    min: 6,
    max: 15,
    defaultPrice: 9,
    defaultQuantity: 100,
    defaultFrequency: 1,
    note: 'Preis je nach Verschmutzung, Bodenart und Aufwand anpassen.',
  },
};

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function calculateQuote({
  service,
  quantity,
  price,
  frequency,
  materialCost,
  travelCost,
  employeeHours,
  employeeRate,
  taxRate,
}) {
  const multiplier = service === 'Treppenhausreinigung' ? 1 : toNumber(frequency);
  const netPerJob = toNumber(quantity) * toNumber(price);
  const monthlyNet = netPerJob * multiplier;
  const monthlyMaterial = toNumber(materialCost) * multiplier;
  const monthlyTravel = toNumber(travelCost) * multiplier;
  const employeeCost = toNumber(employeeHours) * toNumber(employeeRate) * multiplier;
  const totalCosts = monthlyMaterial + monthlyTravel + employeeCost;
  const profitNet = monthlyNet - totalCosts;
  const vat = monthlyNet * (toNumber(taxRate) / 100);
  const gross = monthlyNet + vat;
  const margin = monthlyNet > 0 ? (profitNet / monthlyNet) * 100 : 0;

  return {
    netPerJob,
    monthlyNet,
    totalCosts,
    profitNet,
    vat,
    gross,
    margin,
    employeeCost,
    multiplier,
  };
}

function IconBadge({ children }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white text-xl shadow-lg">
      {children}
    </span>
  );
}

function SmallIcon({ children }) {
  return <span className="text-2xl leading-none">{children}</span>;
}

export default function App() {
  const [service, setService] = useState('Büroreinigung');
  const [quantity, setQuantity] = useState(SERVICE_CONFIG['Büroreinigung'].defaultQuantity);
  const [price, setPrice] = useState(SERVICE_CONFIG['Büroreinigung'].defaultPrice);
  const [frequency, setFrequency] = useState(SERVICE_CONFIG['Büroreinigung'].defaultFrequency);
  const [materialCost, setMaterialCost] = useState(30);
  const [travelCost, setTravelCost] = useState(20);
  const [employeeHours, setEmployeeHours] = useState(0);
  const [employeeRate, setEmployeeRate] = useState(15);
  const [taxRate, setTaxRate] = useState(19);
  const [customerName, setCustomerName] = useState('Musterkunde GmbH');
  const [objectName, setObjectName] = useState('Büro / Objekt');

  const selected = SERVICE_CONFIG[service];

  const result = useMemo(
    () =>
      calculateQuote({
        service,
        quantity,
        price,
        frequency,
        materialCost,
        travelCost,
        employeeHours,
        employeeRate,
        taxRate,
      }),
    [service, quantity, price, frequency, materialCost, travelCost, employeeHours, employeeRate, taxRate]
  );

  const applyService = (name) => {
    const config = SERVICE_CONFIG[name];
    setService(name);
    setPrice(config.defaultPrice);
    setQuantity(config.defaultQuantity);
    setFrequency(config.defaultFrequency);
  };

  const euro = (value) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value || 0);

  const offerText = `Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage. Für ${customerName} kalkulieren wir die Leistung "${service}" im Objekt "${objectName}" wie folgt:\n\nMenge: ${quantity} ${selected.unit}\nPreis netto pro Einheit: ${euro(price)}\nMonatlicher Nettopreis: ${euro(result.monthlyNet)}\nMwSt.: ${euro(result.vat)}\nGesamtbetrag brutto: ${euro(result.gross)}\n\nDas Angebot basiert auf professioneller Ausführung, zuverlässiger Terminplanung und sauberer Dokumentation.\n\nMit freundlichen Grüßen\nGlanzwerk Gebäudereinigung`;

  const copyOffer = async () => {
    await navigator.clipboard.writeText(offerText);
    alert('Angebotstext wurde kopiert.');
  };

  const downloadOffer = () => {
    const blob = new Blob([offerText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `angebot-${customerName || 'kunde'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white p-4 md:p-6 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white rounded-[32px] shadow-2xl p-6 md:p-8 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-slate-100 rounded-full blur-3xl opacity-80" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <IconBadge>✦</IconBadge>
                  <p className="text-blue-600 font-bold tracking-[0.25em] uppercase text-sm md:text-base">
                    Glanzwerk Gebäudereinigung
                  </p>
                </div>
                <h1 className="text-4xl md:text-6xl font-black mt-2">Preisrechner & Angebots-System</h1>
                <p className="text-lg md:text-xl text-slate-600 mt-3">Wir bringen Glanz in Ihr Objekt.</p>
              </div>
              <div className="bg-slate-950 text-white rounded-3xl p-5 min-w-[220px]">
                <p className="text-sm text-blue-200">Aktueller Gewinn</p>
                <p className="text-3xl font-black mt-1">{euro(result.profitNet)}</p>
                <p className="text-sm text-slate-300 mt-2">Marge: {result.margin.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 bg-white rounded-[32px] shadow-2xl p-6 md:p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <SmallIcon>🧮</SmallIcon>
              <h2 className="text-3xl font-black">Angebot kalkulieren</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="font-bold">Kunde</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">Objekt</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" value={objectName} onChange={(event) => setObjectName(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">Leistung</span>
                <select className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" value={service} onChange={(event) => applyService(event.target.value)}>
                  {Object.keys(SERVICE_CONFIG).map((name) => <option key={name}>{name}</option>)}
                </select>
              </label>

              <label className="space-y-2">
                <span className="font-bold">Menge / {selected.unit}</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">Preis pro Einheit netto</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} />
                <p className="text-sm text-slate-500">Empfohlen: {selected.min}–{selected.max} €</p>
              </label>

              <label className="space-y-2">
                <span className="font-bold">Einsätze pro Monat</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg disabled:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={frequency} disabled={service === 'Treppenhausreinigung'} onChange={(event) => setFrequency(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">Materialkosten pro Einsatz</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={materialCost} onChange={(event) => setMaterialCost(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">Fahrtkosten pro Einsatz</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={travelCost} onChange={(event) => setTravelCost(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">Mitarbeiterstunden pro Einsatz</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={employeeHours} onChange={(event) => setEmployeeHours(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">Mitarbeiterkosten pro Stunde</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={employeeRate} onChange={(event) => setEmployeeRate(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="font-bold">MwSt. in %</span>
                <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" type="number" min="0" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} />
              </label>

              <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100">
                <p className="font-black text-blue-700 mb-2">Hinweis</p>
                <p className="text-slate-700 text-sm leading-relaxed">{selected.note}</p>
              </div>
            </div>
          </section>

          <aside className="bg-gradient-to-br from-slate-950 via-blue-900 to-blue-700 rounded-[32px] shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -left-10 bottom-0 w-52 h-52 rounded-full bg-blue-300/10" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3"><SmallIcon>📊</SmallIcon> Ergebnis</h2>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between border-b border-white/20 pb-3"><span>Netto pro Auftrag</span><b>{euro(result.netPerJob)}</b></div>
                <div className="flex justify-between border-b border-white/20 pb-3"><span>Monatsumsatz netto</span><b>{euro(result.monthlyNet)}</b></div>
                <div className="flex justify-between border-b border-white/20 pb-3"><span>Kosten monatlich</span><b>{euro(result.totalCosts)}</b></div>
                <div className="flex justify-between border-b border-white/20 pb-3"><span>Mitarbeiterkosten</span><b>{euro(result.employeeCost)}</b></div>
                <div className="flex justify-between border-b border-white/20 pb-3"><span>Gewinn netto</span><b>{euro(result.profitNet)}</b></div>
                <div className="flex justify-between border-b border-white/20 pb-3"><span>Marge</span><b>{result.margin.toFixed(1)}%</b></div>
                <div className="flex justify-between border-b border-white/20 pb-3"><span>MwSt.</span><b>{euro(result.vat)}</b></div>
                <div className="flex justify-between text-2xl pt-3"><span>Brutto Rechnung</span><b>{euro(result.gross)}</b></div>
              </div>
            </div>
          </aside>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-[32px] shadow-2xl p-6 border border-slate-200 hover:scale-[1.02] transition-all">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2"><SmallIcon>€</SmallIcon> Preis-Tabelle</h3>
            <div className="space-y-3">
              {Object.entries(SERVICE_CONFIG).map(([name, data]) => (
                <button key={name} onClick={() => applyService(name)} className="w-full flex justify-between gap-4 rounded-2xl border p-4 hover:bg-blue-50 text-left transition-colors">
                  <span className="font-bold">{name}</span>
                  <span className="whitespace-nowrap">{data.min}–{data.max} €</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-2xl p-6 border border-slate-200 hover:scale-[1.02] transition-all xl:col-span-2">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2"><SmallIcon>📄</SmallIcon> Angebotstext</h3>
            <div className="flex gap-3 mb-4 flex-wrap">
              <button onClick={copyOffer} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold transition-colors">Text kopieren</button>
              <button onClick={downloadOffer} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold transition-colors">Angebot herunterladen</button>
              <button onClick={() => window.print()} className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-5 py-3 rounded-2xl font-bold transition-colors">Drucken / PDF</button>
            </div>
            <textarea className="w-full min-h-[310px] bg-slate-100 rounded-2xl p-5 text-sm leading-relaxed border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100" value={offerText} readOnly />
          </div>

          <div className="bg-white rounded-[32px] shadow-2xl p-6 border border-slate-200 hover:scale-[1.02] transition-all">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2"><SmallIcon>📈</SmallIcon> Regeln</h3>
            <ul className="space-y-3 text-slate-700">
              <li>✅ Nicht unter 35 €/Std. anbieten</li>
              <li>✅ Fahrtzeit immer einrechnen</li>
              <li>✅ Material separat berücksichtigen</li>
              <li>✅ Bei Hygiene/Praxis Aufschlag nehmen</li>
              <li>✅ Monatsverträge bevorzugen</li>
              <li>✅ Brutto und netto sauber trennen</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
