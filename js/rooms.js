import axios from "axios";
import { toast } from "./utils";

async function getRooms() {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms`);
  return res.data;
}

document.addEventListener("DOMContentLoaded", () => {
  //   const form = document.querySelector("#register-form");
  //   form.addEventListener("submit", async (e) => {
  //     e.preventDefault();
  //     const formdata = new FormData(form);
  //     try {
  //       const res = await axios.post(
  //         `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
  //         formdata,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       const data = res.data;
  //       toast("success", data.message);
  //       setTimeout(() => {
  //         window.location.href = "/login";
  //       }, 2000);
  //     } catch (error) {
  //       if (error.response) {
  //         console.log("Status:", error.response.status);
  //         toast("error", error.response.data?.message || "Unknown error");
  //       } else {
  //         toast("error", "Network error or server not responding");
  //       }
  //     }
  //   });
  const roomContainer = document.querySelector("#rooms-container");
  let rooms = getRooms();
  rooms.then((res) => {
    try {
      res.data?.map((room) => {
        if (room.image.file_path) {
          roomContainer.innerHTML += roomJSX({
            ...room,
            image: `${import.meta.env.VITE_BACKEND_URL}/upload/get_image/${
              room.image.name
            }`,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
});

const roomJSX = ({ id, price, name, description, image }) => {
  return `
    <div id="room-${id}" class="p-4 md:w-1/3">
    <div
      class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden"
    >
      <img
        class="lg:h-48 md:h-36 w-full object-cover object-center"
        src="${image}"
        alt="blog"
      />
      <div class="p-6">
        <h2
          class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
        >
          DAYCATION
        </h2>
        <h1 class="title-font text-lg font-medium text-gray-900 mb-3">
          ${name}
        </h1>
        <p class="leading-relaxed mb-3" style='font-family: "Merriweather Sans", sans-serif;'>
        ${description}
        </p>
        <div class="flex items-center flex-wrap" style='font-family: "Merriweather Sans", sans-serif;'>
          <a
            class="text-blue-500 inline-flex items-center md:mb-2 lg:mb-0"
            >Learn More
            <svg
              class="w-4 h-4 ml-2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
    `;
    
};
