import axios from "@/httpd";

const auth = {
  lineLogin: async (accessToken: string) => {
    const res = await axios.post(
      `/login`,
      {
        access_token: accessToken,
      },
      {
        withCredentials: true,
        baseURL: import.meta.env.VITE_API_BASE_DOMAIN,
      }
    );
    //todo ログイン失敗時の処理
    return res;
  },
  login: async () => {
    //console.log("login:", csrf);
    const res = await axios.post(`/login`);
    const resme = await axios.get(`/me`);

    return resme;
  },
  me: async () => {
    const res = await axios.get(`/me`);
    console.log("user:", res.data);
    return res.data;
  },
  logout: async () => {
    const res = await axios.post(`/logout`, {});
    //todo ログアウト失敗時の処理
    return true;
  },
};

export default auth;
