// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("DaChiudereOggi");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("DaChiudereOggi");
import { useEffect, useState } from "react";
import { Badge, Button, Card, usePrototype, useTable } from "../floware";

function leggiData(testo) {__mk();
  const valore = testo.trim();
  if (!valore) return Number.NaN;
  if (!valore.includes("/")) return new Date(valore).getTime();
  const parti = valore.split(" ");
  const data = parti[0].split("/");
  if (data.length !== 3) return Number.NaN;
  const ora = (parti[1] || "23:59").split(":");
  const giorno = Number(data[0]);
  const mese = Number(data[1]);
  const anno = Number(data[2]);
  const ore = Number(ora[0]);
  const minuti = Number(ora[1] || "0");
  const risultato = new Date(anno, mese - 1, giorno, ore, minuti);
  if (risultato.getFullYear() !== anno || risultato.getMonth() !== mese - 1 || risultato.getDate() !== giorno || ore < 0 || ore > 23 || minuti < 0 || minuti > 59) return Number.NaN;
  return risultato.getTime();
}

export default function DaChiudereOggi() {__mk();
  const registro = useTable("registro-richieste");
  const cruscotto = useTable("cruscotto");
  const { openDetail } = usePrototype();
  const [adesso, setAdesso] = useState(() => (__mk(), Date.now()));
  useEffect(() => {__mk();
    let attivo = true;
    setTimeout(() => {__mk(); if (attivo) setAdesso(Date.now()); }, 30000);
    return () => {__mk(); attivo = false; };
  }, [adesso]);
  if (!registro || !cruscotto) return <Card title="Da chiudere oggi"><p>Dati delle richieste non disponibili.</p></Card>;
  const richiesta = registro.column("Richiesta");
  const priorita = registro.column("Priorità");
  const incaricato = registro.column("Incaricato");
  const stato = registro.column("Stato");
  const nomeCruscotto = cruscotto.column("Richiesta");
  const scadenza = cruscotto.column("Scadenza");
  if (richiesta < 0 || stato < 0 || nomeCruscotto < 0 || scadenza < 0) return <Card title="Da chiudere oggi"><p>Per mostrare gli avvisi servono Richiesta e Stato nel Registro, Richiesta e Scadenza nel Cruscotto.</p></Card>;
  const oggi = new Date(adesso);
  const fine = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate(), 23, 59, 59, 999).getTime();
  const inizio = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()).getTime();
  const elenco = registro.rows.map((riga, indice) => {__mk();
    const collegata = cruscotto.rows.find((altra) => (__mk(), altra[nomeCruscotto] === riga[richiesta]));
    const data = collegata ? collegata[scadenza] || "" : "";
    return { riga, indice, data, termine: leggiData(data) };
  }).filter((voce) => {__mk();
    const statoAttuale = (voce.riga[stato] || "").trim().toLowerCase();
    return statoAttuale !== "chiusa" && statoAttuale !== "chiuso" && Number.isFinite(voce.termine) && voce.termine <= fine;
  }).sort((a, b) => (__mk(), a.termine - b.termine));
  return <Card title="Da chiudere oggi">
    <div className="space-y-3 text-(--mk-text)">
      <p className="text-sm text-(--mk-muted)">Scadenze entro il {oggi.toLocaleDateString("it-IT")}, comprese quelle arretrate. Scadenze dal Cruscotto; stato e incarico dal Registro richieste. Collegamento per titolo della richiesta.</p>
      {elenco.length === 0 ? <p>Nessuna segnalazione da chiudere entro oggi.</p> : <>
        <Badge tone="primary">Richieste da chiudere: {elenco.length}</Badge>
        <div className="space-y-3">{elenco.map((voce) => (__mk(), <div key={voce.indice} className="space-y-2 rounded-lg border border-(--mk-border) p-3">
          <div className="font-semibold">{voce.riga[richiesta]}</div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={priorita >= 0 && (voce.riga[priorita] === "Bloccante" || voce.riga[priorita] === "Urgente") ? "danger" : "neutral"}>Priorità: {priorita >= 0 ? voce.riga[priorita] || "Non indicata" : "Non indicata"}</Badge>
            {voce.termine < inizio && <Badge tone="danger">Arretrata</Badge>}
          </div>
          <p className="text-sm">Incaricato: {incaricato >= 0 ? voce.riga[incaricato] || "Da assegnare" : "Da assegnare"}</p>
          <p className="text-sm">Scadenza: {voce.data}</p>
          <Button variant="secondary" onClick={() => (__mk(), openDetail("registro-richieste", voce.indice))}>Apri richiesta</Button>
        </div>))}</div>
      </>}
      <p className="text-sm text-(--mk-muted)">La data corrente viene aggiornata automaticamente ogni 30 secondi.</p>
    </div>
  </Card>;
}
