const app = Vue.createApp({
    data() {
      return {
        title: "Benvenuto al sistema di aste",
        auctions: [
          { id: 1, title: "Quadro antico", price: 200 },
          { id: 2, title: "Macchina d'epoca", price: 5000 },
        ],
      };
    },
  });
  app.mount("#app");
  