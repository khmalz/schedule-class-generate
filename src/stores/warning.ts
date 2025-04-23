import { defineStore } from "pinia";

export const useWarningsStore = defineStore("warnings", {
  state: () => ({
    warnings: [] as string[],
  }),
  actions: {
    addWarning(warning: string) {
      this.warnings.push(warning);
    },
    removeWarning(index: number) {
      this.warnings.splice(index, 1);
    },
    clearWarnings() {
      this.warnings = [];
    },
  },
});
