const buttons = document.querySelectorAll(".buttons .btn");
const notifications = document.querySelector(".notifications");

const removeToast = (toast) => {
  toast.classList.add("remove");
  setTimeout(() => toast.remove(), 5000);
};
// fa-check-circle
// fa-times-circle
// fa-exclamation-circle
// fa-info-circle
const toastDetails = {
  success: {
    icon: "fa-check-circle",
    message: "Success : this is a success toast",
  },
  error: {
    icon: "fa-times-circle",
    message: "Error : this is a error toast",
  },
  warning: {
    icon: "fa-exclamation-circle",
    message: "Warning : this is a warning toast",
  },
  info: {
    icon: "fa-info-circle",
    message: "Warning : this is a info toast",
  },
};
const handleCreateToast = (id) => {
  const { icon, message } = toastDetails[id];

  const toast = document.createElement("li");
  toast.className = `toast ${id}`;
  toast.innerHTML = `
  <div class="column">
          <i class="fa ${icon}"></i>
          <span>${message}</span>
        </div>
        <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>
  `;
  notifications.appendChild(toast);
  setTimeout(() => removeToast(toast), 5000);
};
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    handleCreateToast(button.id);
  });
});