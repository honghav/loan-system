import Swal from "sweetalert2";
import { ref } from "vue";

export const loadingSwal = ref(false);
// const { t } = useI18n();

export default function swalModal(
  title: string = "Are you sure?",
  description: string = "You won't be able to revert this!",
  // icon: "error" | "warning" | "success" | "info" | "question" = "success",
  image: string = "/images/gif/Success.gif",
  color: string = "primary",
  confirmBtnText?: string,
  onConfirm?: () => void | Promise<void>,
): Promise<boolean> {
  const { $i18n } = useNuxtApp();
  return Swal.fire({
    html: `
      <div class="w-full">
        <div class="w-full h-56 rounded-full  flex items-center justify-center  text-8xl ">
         <img
            src=${image}
            alt="loading"
            class="w-56 object-cover">
        </div>
      
        <div class="text-center px-8 pb-8 pt-4">
          <h2 class="text-xl font-bold text-secondary mb-2">
            ${title}
          </h2>

          <p class="text-gray-500 text-lg mb-6">
            ${typeof $i18n.t(description) === "string" ? $i18n.t(description) : JSON.stringify($i18n.t(description))}
          </p>
        </div>
      </div>

    `,
    // icon: icon,
    showCancelButton: true,
    cancelButtonText: $i18n.t("close"),
    confirmButtonText: confirmBtnText,
    buttonsStyling: false,
    customClass: {
      confirmButton: `${color} hover:bg-secondary/20 text-white px-6 py-2 rounded-full mx-2 order-2 `,
      cancelButton:
        "bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full mx-2 order-1 ",
    },
  }).then(async (res) => {
    if (res.isConfirmed && onConfirm) {
      await onConfirm();
    }

    return res.isConfirmed;
  });
}
