export function parseTime(time: string) {
  const [startStr, endStr] = time.split("-").map((s) => s.trim());
  const today = new Date().toISOString().split("T")[0];

  const start = new Date(`${today}T${normalizeTime(startStr)}`);
  const end = new Date(`${today}T${normalizeTime(endStr)}`);

  return { start, end };
}

export function normalizeTime(input: string): string {
  const parts = input.replace(/\./g, ":").split(":");
  let [hour] = parts;
  const [minute] = parts;

  if (hour.length === 1) hour = `0${hour}`;
  if (hour === "24") hour = "00";

  const hh = hour.padStart(2, "0");
  const mm = (minute || "00").padStart(2, "0");

  return `${hh}:${mm}:00`;
}

export function convertTimeToNumber({
  time,
  isFloor = false,
  isCeil = false,
}: {
  time: Date;
  isFloor?: boolean;
  isCeil?: boolean;
}): number {
  const hour = time.getHours();
  const minute = time.getMinutes();

  if (isFloor) {
    return hour;
  }

  if (isCeil) {
    return minute === 0 ? hour : hour + 1;
  }

  return hour + minute / 60;
}

export function formatHourMinute(time: string): string {
  const [hour, minute] = time.split(".").map((part) => part.padStart(2, "0"));
  return `${hour}.${minute}`;
}
