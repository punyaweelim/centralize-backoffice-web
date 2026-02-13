import { sysApi, authApi } from "./apiInstance";
import { attachInterceptors } from "./attachInterceptors";

attachInterceptors(sysApi);
attachInterceptors(authApi);