import Swal from "sweetalert2";
import { verifyOtp, resendOtp } from "../../data/api.js";

const OtpPage = {
  async render() {
    const email = localStorage.getItem("temp_reg_email") || "email Anda";
    return `
      <div class="min-h-screen flex items-center justify-center bg-white px-6 py-12">
        <div class="max-w-md w-full text-center space-y-8">
          <div class="flex justify-center mb-6">
            <div class="w-24 h-24 bg-[#F3F0FF] rounded-full flex items-center justify-center shadow-sm">
              <i class="fa-solid fa-envelope text-5xl text-[#5C3E94]"></i>
            </div>
          </div>

          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Verifikasi Email</h2>
            <p class="text-gray-600 text-base">
              Masukkan 4 digit kode yang telah dikirim ke <br>
              <span class="font-bold text-[#5C3E94]">${email}</span>
            </p>
          </div>

          <form id="otp-form" class="space-y-8 mt-8">
            <div class="flex justify-center gap-4">
              <input type="text" maxlength="1" class="otp-input w-20 h-20 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-3xl font-extrabold text-gray-900 focus:bg-white focus:border-[#5C3E94] focus:outline-none transition-all shadow-md focus:shadow-xl" />
              <input type="text" maxlength="1" class="otp-input w-20 h-20 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-3xl font-extrabold text-gray-900 focus:bg-white focus:border-[#5C3E94] focus:outline-none transition-all shadow-md focus:shadow-xl" />
              <input type="text" maxlength="1" class="otp-input w-20 h-20 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-3xl font-extrabold text-gray-900 focus:bg-white focus:border-[#5C3E94] focus:outline-none transition-all shadow-md focus:shadow-xl" />
              <input type="text" maxlength="1" class="otp-input w-20 h-20 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-3xl font-extrabold text-gray-900 focus:bg-white focus:border-[#5C3E94] focus:outline-none transition-all shadow-md focus:shadow-xl" />
            </div>

            <button
              type="submit"
              class="w-full py-4 px-6 border-2 border-[#5C3E94] text-lg font-bold rounded-full text-black bg-white hover:bg-[#5C3E94] hover:text-white focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Lanjutkan
            </button>
          </form>

          <p class="text-center text-gray-600 text-sm mt-6">
            Tidak menerima kode?
            <button
              id="resend-otp"
              class="text-[#5C3E94] font-bold hover:underline ml-1 focus:outline-none">
              Kirim Ulang
            </button>
          </p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const inputs = document.querySelectorAll(".otp-input");
    inputs[0].focus();

    const updateInputStyle = (input) => {
      if (input.value) {
        input.classList.add("bg-white", "border-[#5C3E94]");
        input.classList.remove("bg-gray-50", "border-gray-200");
      } else {
        input.classList.remove("bg-white", "border-[#5C3E94]");
        input.classList.add("bg-gray-50", "border-gray-200");
      }
    };

    inputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        updateInputStyle(e.target);
        if (e.target.value.length === 1 && index < 3) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && index > 0 && e.target.value === "") {
          inputs[index - 1].focus();
        }
      });

      input.addEventListener("focus", (e) => updateInputStyle(e.target));
      input.addEventListener("blur", (e) => updateInputStyle(e.target));
    });

    const form = document.getElementById("otp-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let otpCode = "";
      inputs.forEach((i) => (otpCode += i.value));

      if (otpCode.length < 4) {
        Swal.fire("Peringatan", "Harap masukkan 4 digit kode.", "warning");
        return;
      }

      Swal.fire({ title: "Memverifikasi...", didOpen: () => Swal.showLoading() });
      const email = localStorage.getItem("temp_reg_email");

      try {
        const result = await verifyOtp(email, otpCode);

        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Terverifikasi!",
            text: "Silakan atur password Anda.",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.hash = "#/password-setup";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: result.error || "Kode tidak valid",
            confirmButtonText: "Coba Lagi",
          });
        }
      } catch (err) {
        Swal.fire(
          "Error",
          "Verifikasi gagal. Silakan coba lagi.",
          "error"
        );
      }
    });

    document
      .getElementById("resend-otp")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        const email = localStorage.getItem("temp_reg_email");
        if (!email) {
          Swal.fire(
            "Error",
            "Email tidak ditemukan. Silakan daftar ulang.",
            "error"
          ).then(() => (window.location.hash = "#/register"));
          return;
        }

        Swal.fire({
          title: "Mengirim kode baru...",
          didOpen: () => Swal.showLoading(),
        });

        try {
          const result = await resendOtp(email);
          if (result.success) {
            Swal.fire({
              icon: "success",
              title: "Kode Terkirim!",
              text: "Kode verifikasi baru telah dikirim ke email Anda.",
              confirmButtonColor: "#5C3E94",
            });
          } else {
            Swal.fire("Error", result.error, "error");
          }
        } catch (error) {
          Swal.fire("Error", "Gagal mengirim ulang OTP.", "error");
        }
      });
  },
};

export default OtpPage;