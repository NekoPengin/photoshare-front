import { defineStore } from "pinia";
import auth from "@/auth";

export const userStore = defineStore({
  id: "user",
  state: () => ({
    authenticated: false,
    /** @type {'string' | 'null'} */
    accessToken: null,
    /** @type { name: string }} */
    user: { name: "" },
  }),
  getters: {
    //user: (state) => state.user,
    //authenticated: (state) => state.authenticated,
  },
  actions: {
    async login(accessToken: string) {
      console.log(`accessToken:${accessToken}`)
      const res = await auth.lineLogin(accessToken);
      if (!res.success) return false;
      this.authenticated = true;
      this.user = await auth.me();
      this.accessToken = res.token
    },
    async logout() {
      if (this.authenticated) {
        liff.logout();
        await auth.logout();
        this.authenticated = false;
        this.accessToken = null;
      }
    },
    async me() {
      if (this.authenticated) {
        this.user = await auth.me();
      }
    },
  },
});
