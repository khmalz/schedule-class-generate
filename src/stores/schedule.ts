import type { ScheduleItem, ScheduleMap } from "@/types/schedule";
import { defineStore } from "pinia";

export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    schedule: {} as ScheduleMap,
  }),

  actions: {
    addSchedule(day: string, item: ScheduleItem) {
      if (!this.schedule[day]) {
        this.schedule[day] = [];
      }
      this.schedule[day].push(item);
    },

    resetSchedule() {
      this.schedule = {};
    },
  },
});
