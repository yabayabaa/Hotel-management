import axios from "axios";
import { toast } from "./utils";
import Cookies from "js-cookie";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");
  const errorMsgEl = document.querySelector("#error-msg");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formdata = new FormData(loginForm);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      Cookies.set("jwt", data.jwt, { expires: 1, path: "/", secure: true });

      toast("success", data.message);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.log("Status:", error.response.status);
        toast("error", error.response.data?.message || "Unknown error");
      } else {
        toast("error", "Network error or server not responding");
        console.log("");
      }
    }
  });
});
