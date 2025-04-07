import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
export function toast(status, message) {
  let color;
  const statusColor = {
    success: "#007e34",
    error: "#cc0001",
    warning: "#ff8800",
  };
  color = statusColor[status] || "#007e34";
  Toastify({
    text: message,
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: color,
      color: "white",
      fontSize: "1.2rem",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

export function setMinDate(el) {
  let now = new Date();

  let day = ("0" + now.getDate()).slice(-2);
  let month = ("0" + (now.getMonth() + 1)).slice(-2);

  let today = now.getFullYear() + "-" + month + "-" + day;
  el.setAttribute("min", today);
}
