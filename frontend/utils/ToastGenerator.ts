import { toast } from "react-toastify";

/* toast error message */
export function ToastErrorMessage(message: string) {
  toast.error(message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    closeButton: true,
  });
}
/* toast success message */
export function ToastSuccessMessage(message: string) {
  toast.success(message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    closeButton: true,
  });
}
