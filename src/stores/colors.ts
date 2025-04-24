import { defineStore } from "pinia";

export const useColorStore = defineStore("color", {
  state: () => ({
    colors: [
      "bg-green-300",
      "bg-yellow-300",
      "bg-blue-300",
      "bg-pink-300",
      "bg-purple-300",
      "bg-rose-300",
      "bg-orange-300",
      "bg-lime-300",
      "bg-teal-300",
    ] as string[],
    originalColors: [
      "bg-green-300",
      "bg-yellow-300",
      "bg-blue-300",
      "bg-pink-300",
      "bg-purple-300",
      "bg-rose-300",
      "bg-orange-300",
      "bg-lime-300",
      "bg-teal-300",
    ] as string[],
  }),

  actions: {
    getRandomColor() {
      if (this.colors.length === 0) {
        this.resetColors();
      }

      const randomIndex = Math.floor(Math.random() * this.colors.length);
      const color = this.colors[randomIndex];
      this.colors.splice(randomIndex, 1);
      return color;
    },

    // Reset warna ke urutan awal
    resetColors() {
      this.colors = [...this.originalColors];
      this.shuffleColors();
    },

    // Fungsi untuk mengacak urutan warna
    shuffleColors() {
      for (let i = this.colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.colors[i], this.colors[j]] = [this.colors[j], this.colors[i]];
      }
    },
  },
});
