// stores/buyNow.ts
import { defineStore } from "pinia";
import type { BuyNowDTO } from "~/model_dto/cart.dto";

export const useBuyNowStore = defineStore("buyNow", {
  state: () => ({
    item: null as BuyNowDTO | null,
  }),

  getters: {
    buyNowItem: (state) => state.item,

    totalPrice: (state) => (state.item ? state.item.qty * state.item.price : 0),
  },

  actions: {
    setBuyNow(product: BuyNowDTO) {
      // Same product -> increase qty
      if (
        this.item &&
        this.item.product_id === product.product_id
        // this.item.variant_id === product.variant_id
      ) {
        this.item.qty += product.qty;
        // this.item.total_price = this.item.qty * this.item.price;
      } else {
        // Different product -> replace
        this.item = {
          ...product,
          qty: product.qty || 1,
          // total_price: (product.qty || 1) * product.price,
        };
      }
    },

    updateQty(qty: number) {
      if (!this.item) return;

      this.item.qty = qty;
      this.item.total_price = qty * this.item.price;
    },

    clearBuyNow() {
      this.item = null;
    },
  },
});
