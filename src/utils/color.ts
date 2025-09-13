export const colorOptions = [
  { name: "zinc-950", hex: "#09090b", border: "border-gray-500" },
  { name: "red-900", hex: "#7f1d1d", border: "border-red-500" },
  { name: "amber-700", hex: "#b45309", border: "border-amber-900" },
  { name: "yellow-700", hex: "#a65f00", border: "border-yellow-800" },
  { name: "emerald-900", hex: "#064e3b", border: "border-emerald-500" },
  { name: "cyan-950", hex: "#083344", border: "border-cyan-400" },
  { name: "fuchsia-800", hex: "#86198f", border: "border-fuchsia-900" },
  { name: "pink-500", hex: "#ec4899", border: "border-pink-700" },
  { name: "slate-700", hex: "#334155", border: "border-slate-400" },
];

export const colorHex: Record<string, string> = Object.fromEntries(
  colorOptions.map((opt) => [opt.name, opt.hex])
);
