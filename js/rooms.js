import axios from "axios";
import { toast } from "./utils";

async function getRooms() {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms`, {
    withCredentials: true,
  });
  return res.data;
}

document.addEventListener("DOMContentLoaded", () => {
  const roomContainer = document.querySelector("#rooms-container");
  try {
    let rooms = getRooms();
    console.log(rooms);
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
    document.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("book-now-btn") ||
        e.target.closest(".book-now-btn")
      ) {
        e.preventDefault();
        const btn = e.target.classList.contains("book-now-btn")
          ? e.target
          : e.target.closest(".book-now-btn");
        const roomId = btn.dataset.id;

        const dialog = document.getElementById(`dialog-${roomId}`);
        if (dialog) {
          dialog.showModal();
          dialog.querySelectorAll("input[type='date']").forEach((input) => {
            input.setAttribute("min", new Date().toISOString().split("T")[0]);
          });
          const form = dialog.querySelector(".book-form");
          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const user = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/users/me`,
              {
                withCredentials: true,
              }
            );
            const formdata = new FormData(form);
            formdata.append("reserved_room", roomId);
            formdata.append("booked_by", user.data.id);
            try {
              const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/reservations`,
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
        } else {
          console.error(`Dialog not found for room ${roomId}`);
        }
      }

      if (
        e.target.classList.contains("close-btn") ||
        e.target.closest(".close-btn")
      ) {
        e.preventDefault();
        const closeBtn = e.target.classList.contains("close-btn")
          ? e.target
          : e.target.closest(".close-btn");
        const dialog = closeBtn.closest("dialog");
        if (dialog) dialog.close();
      }
    });
  } catch (error) {
    console.error("Error loading rooms:", error);
    toast("error", "Failed to load rooms");
  }
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
              <p
                class="leading-relaxed mb-3"
                style="font-family: 'Merriweather Sans', sans-serif"
              >
                ${description}
              </p>
              <div class="flex items-center flex-wrap">
                <dialog
                  class="edit-dialog bg-transparent border-none outline-0 shadow-none p-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-lg"
                  style="font-family: 'Merriweather Sans', sans-serif"
                  id="dialog-${id}"
                >
                  <form
                    method="POST"
                    name="book-form"
                    class="book-form flex flex-col gap-3 relative p-4 bg-[blanchedalmond] border border-orange-900 rounded-lg"
                    data-id="${id}}"
                  >
                    <span
                      data-id="${id}}"
                      class="close-btn rounded-circle flex items-center justify-center absolute bg-red-600 text-white rounded-tr-lg cursor-pointer"
                      style="
                        top: 1px;
                        right: 1px;
                        translate: -50%, -50%;
                        width: 24px;
                        height: 24px;
                      "
                      >x</span
                    >
                    <h3 class="text-xl font-bold">Book Room ${name}</h3>
                    <input type="hidden" name="reserved_room" value="${id}" />
                    <div class="mb-4">
                      <label
                        for="start_date"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="start_date"
                        name="start_date"
                        type="date"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div class="mb-4">
                      <label
                        for="end_date"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date
                      </label>
                      <input
                        id="end_date"
                        name="end_date"
                        type="date"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <button
                      class="bg-blue-600 text-white py-2 rounded-sm cursor-pointer"
                      type="submit"
                    >
                      Book now!
                    </button>
                  </form>
                </dialog>
                <button
                  data-id="${id}"
                  class="book-now-btn cursor-pointer bg-blue-500 text-white py-1 px-2 inline-flex items-center rounded-sm"
                >
                  Book now
                </button>
              </div>
            </div>
          </div>
        </div>
    `;
};
