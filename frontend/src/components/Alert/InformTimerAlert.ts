import Swal from "sweetalert2";

export default function WarningAlert(text: string, time: number) {
  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: true,
    timer: time,
    timerProgressBar: true,
    confirmButtonText: "확인",
  });
  Toast.fire({
    icon: "success",
    text: text,
  });
}
