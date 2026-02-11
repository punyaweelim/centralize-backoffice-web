import Swal, { SweetAlertOptions } from "sweetalert2";

export function showErrorPopup(message: string) {
  const options: SweetAlertOptions = {
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#d33",
  };

  Swal.fire(options);
}

export function showSuccessPopup(message: string) {
  const options: SweetAlertOptions = {
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#30a702",
  };

  Swal.fire(options);
}

export function showWarningPopup(message: string) {
  const options: SweetAlertOptions = {
    icon: "warning",
    title: "Warning",
    text: message,
    confirmButtonColor: "#FFA500",
  };

  Swal.fire(options);
}