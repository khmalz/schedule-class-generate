import type { ScheduleMap } from "@/types/schedule";
import { convertTimeToNumber, formatHourMinute, parseTime } from "@/utils/time";
import { useScheduleStore } from "@/stores/schedule";
import { useColorStore } from "@/stores/colors";
import { useWarningsStore } from "@/stores/warning";

export function scheduleParser() {
  const scheduleStore = useScheduleStore();
  const colorsStore = useColorStore();
  const warningsStore = useWarningsStore();

  function generateSchedule(input: string): [ScheduleMap, number, number] {
    let min_time: Date | null = null;
    let max_time: Date | null = null;

    const dayMap: Record<string, string> = {
      senin: "Senin",
      monday: "Senin",
      selasa: "Selasa",
      tuesday: "Selasa",
      rabu: "Rabu",
      wednesday: "Rabu",
      kamis: "Kamis",
      thursday: "Kamis",
      jumat: "Jumat",
      friday: "Jumat",
      sabtu: "Sabtu",
      saturday: "Sabtu",
      minggu: "Minggu",
      sunday: "Minggu",
    };

    const lines = input.trim().split("\n");
    let currentDay = "";

    lines.forEach((line: string) => {
      line = line.trim();
      if (line === "") return;

      const cleanedLine = line.toLowerCase().replace(/\s*:\s*$/, ":");
      const key = cleanedLine.split(":")[0];
      const foundDay = dayMap[key];

      if (foundDay) {
        currentDay = foundDay;
      } else if (currentDay) {
        const [subject, time, desc] = line.split(",").map((p) => p.trim());
        const formattedTime = time.split("-").map(formatHourMinute).join("-");
        const { start, end } = parseTime(formattedTime);

        if (!min_time || start < min_time) min_time = start;
        if (!max_time || end > max_time) max_time = end;

        const color = colorsStore.getRandomColor();
        scheduleStore.addSchedule(currentDay, { subject, time: formattedTime, desc, color });
      }
    });

    if (!min_time || !max_time) return [scheduleStore.schedule, 8, 17];

    const min_number: number = convertTimeToNumber({ time: min_time, isFloor: true });
    let max_number: number = convertTimeToNumber({ time: max_time, isCeil: true });

    if (max_number > 24 || max_number === 0) max_number = 23;

    return [scheduleStore.schedule, min_number, max_number];
  }

  function validateInput(input: string): string[] {
    warningsStore.clearWarnings();
    if (!input) return ["⚠️ Please enter some input."];

    const errors: string[] = [];
    const lines = input.trim().split("\n");
    const validDayPattern = /^[A-Za-z]+:$/;
    const timePattern = /^\d{1,2}\.\d{2}-\d{1,2}\.\d{2}$/;
    let currentDay = "";

    lines.forEach((line, index) => {
      line = line.trim();
      if (line === "") return;

      if (validDayPattern.test(line)) {
        currentDay = line.toLowerCase().replace(":", "");
      } else if (currentDay) {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length !== 3) {
          errors.push(
            `⚠️ Line ${index + 1} is not valid. Must contain subject, time, and description.`
          );
          return;
        }

        const desc = parts[2];
        if (desc.length > 45) {
          errors.push(`⚠️ Description have to be less than 45 characters.`);
        }

        const time = parts[1];
        if (!timePattern.test(time)) {
          errors.push(
            `⚠️ Invalid time format at line ${index + 1}: "${time}". Use format (e.g., 10.00-11.00)`
          );
        }
      } else {
        errors.push(`⚠️ Cannot determine day for line ${index + 1}: "${line}"`);
      }
    });

    return errors;
  }

  return {
    generateSchedule,
    validateInput,
  };
}
