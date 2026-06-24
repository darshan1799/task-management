import { toast } from "react-toastify";

type ToastState = "success" | "error" | "warning" | "info";

export default function showMessage(
  message: string,
  state: ToastState
): void {
  switch (state) {
    case "success":
      toast.success(message);
      break;

    case "error":
      toast.error(message);
      break;

    case "warning":
      toast.warning(message);
      break;

    case "info":
      toast.info(message);
      break;

    default:
      toast(message);
  }
}
