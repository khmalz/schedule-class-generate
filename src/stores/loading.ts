import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    startLoading() {
      this.isLoading = true;
      Swal.fire({
        title: "Wait, Generating...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    },
    stopLoading() {
      this.isLoading = false;
      Swal.close();
    },
  },
});
