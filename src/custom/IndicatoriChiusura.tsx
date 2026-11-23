// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("IndicatoriChiusura");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("IndicatoriChiusura");
import { useTable, type CellProps } from "../floware";

export default function IndicatoriChiusura({ pageId, row, value }: CellProps) {__mk();
  const table = useTable(pageId);
  if (!table) return <span>{value}</span>;
  const p = table.column("Priorità");
  const s = table.column("Stato");
  const priorita = p >= 0 ? row[p] : "";
  const stato = s >= 0 ? row[s] : "";
  return <div className="space-y-2 py-1 text-(--mk-text)">
    <div className="font-medium">{value}</div>
    <div className="flex flex-wrap gap-2 text-xs">
      {priorita === "Bloccante" && <span className="rounded border border-current px-2 py-1 font-semibold text-(--mk-danger)">Priorità: Bloccante</span>}
      {priorita === "Urgente" && <span className="rounded border-2 border-current px-2 py-1 font-semibold text-(--mk-primary)">Priorità: Urgente</span>}
      {stato === "Chiusa" && <span className="rounded bg-(--mk-primary) px-2 py-1 font-semibold text-(--mk-on-primary)">Stato: Chiusa</span>}
      {stato === "Da verificare" && <span className="rounded border border-dashed border-current px-2 py-1 font-semibold text-(--mk-primary)">Stato: Da verificare</span>}
    </div>
  </div>;
}
