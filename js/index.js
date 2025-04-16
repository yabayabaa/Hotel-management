import axios from "axios";
import { toast } from "./utils";
import Cookies from "js-cookie";

async function getUser() {
  const user = axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
    withCredentials: true,
  });
  return user.data;
}

document.addEventListener("DOMContentLoaded", () => {
  getUser().then((data) => console.log(data));
});
