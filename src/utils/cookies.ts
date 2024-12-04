import Cookies from "js-cookie";
import { USER_TOKEN_KEY } from "@/constant/cookies";
export const getToken = () => {
    return Cookies.get(USER_TOKEN_KEY);
};
export const setToken = (token: string) => {
    Cookies.set(USER_TOKEN_KEY, token);
};
export const removeToken = () => {
    Cookies.remove(USER_TOKEN_KEY);
};