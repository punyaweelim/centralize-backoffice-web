import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const authStorage = {
  /* ====================
     ACCESS TOKEN
  ==================== */

  // setAccessToken(token: string) {
  //   const hasPersistentRefreshToken = !!Cookies.get(REFRESH_TOKEN_KEY);

  //   if (hasPersistentRefreshToken) {
  //     // remember me → cookie
  //     Cookies.set(ACCESS_TOKEN_KEY, token, {
  //       expires: 1,
  //       secure: location.protocol === "https:",
  //       sameSite: "strict",
  //     });
  //     sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  //   } else {
  //     // session only
  //     sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  //     Cookies.remove(ACCESS_TOKEN_KEY);
  //   }
  // },

  setAccessToken(token: string, persistent?: boolean) {
  const persist =
    persistent ?? !!Cookies.get(REFRESH_TOKEN_KEY);
    console.log('token', token);
    console.log('persist', persist);

  if (persist) {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 0.25,
    secure: location.protocol === "https:",
    sameSite: "lax",
  });
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
} else {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  Cookies.remove(ACCESS_TOKEN_KEY);
}
},


  getAccessToken(): string | null {
    return (
      Cookies.get(ACCESS_TOKEN_KEY) ??
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },

  removeAccessToken() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /* ====================
     REFRESH TOKEN
  ==================== */

  setRefreshToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      Cookies.set(REFRESH_TOKEN_KEY, token, {
        expires: 7,
        secure: location.protocol === "https:",
        sameSite: "lax",
      });
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } else {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
      Cookies.remove(REFRESH_TOKEN_KEY);
    }
  },

  getRefreshToken(): string | null {
    return (
      Cookies.get(REFRESH_TOKEN_KEY) ??
      sessionStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },

  removeRefreshToken() {
    Cookies.remove(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearAll() {
    this.removeAccessToken();
    this.removeRefreshToken();
  },
};
