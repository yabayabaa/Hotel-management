import axios from "axios";
import { toast } from "./utils";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#register-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formdata = new FormData(form);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      toast("success", data.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.log("Status:", error.response.status);
        toast("error", error.response.data?.message || "Unknown error");
      } else {
        toast("error", "Network error or server not responding");
      }
    }
  });
});
