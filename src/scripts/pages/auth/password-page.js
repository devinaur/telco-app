import Swal from "sweetalert2";
import { completeRegistration } from "../../data/api.js";

const PasswordPage = {
  async render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-white px-4 py-12">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center space-y-6">
            <h2 class="text-4xl font-bold text-gray-900">Buat Password Baru</h2>
            <p class="mt-2 text-gray-600">
              Amankan akun Anda dengan password yang kuat, unik, dan mudah Anda ingat.
            </p>
          </div>

          <form class="space-y-6" id="password-form">
            <div>
              <label class="block text-base font-medium text-gray-900 mb-3">Password Baru</label>
              <div class="relative">
                <input
                  id="password"
                  type="password"
                  required
                  class="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#5C3E94] text-sm bg-[#FFF5F5] transition-all shadow-md focus:shadow-lg"
                  placeholder="Minimal 6 karakter">

                <button
                  type="button"
                  id="toggle-password"
                  class="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#5C3E94] focus:outline-none transition-colors">
                  <i class="fa-solid fa-eye-slash text-xl"></i>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-base font-medium text-gray-900 mb-3">Konfirmasi Password</label>
              <div class="relative">
                <input
                  id="confirm-password"
                  type="password"
                  required
                  class="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#5C3E94] text-sm bg-[#FFF5F5] transition-all shadow-md focus:shadow-lg"
                  placeholder="Ulangi password">

                <button
                  type="button"
                  id="toggle-confirm-password"
                  class="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#5C3E94] focus:outline-none transition-colors">
                  <i class="fa-solid fa-eye-slash text-xl"></i>
                </button>
              </div>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                class="w-full py-4 px-4 border-2 border-[#5C3E94] text-base font-bold rounded-full text-black bg-white hover:bg-[#5C3E94] hover:text-white focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const toggleInput = (inputId, toggleBtnId) => {
      const inputField = document.getElementById(inputId);
      const toggleBtn = document.getElementById(toggleBtnId);

      if (inputField && toggleBtn) {
        toggleBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const type = inputField.getAttribute("type") === "password" ? "text" : "password";
          inputField.setAttribute("type", type);
          toggleBtn.querySelector("i").className =
            type === "password"
              ? "fa-solid fa-eye-slash text-xl"
              : "fa-solid fa-eye text-xl";
        });
      }
    };

    toggleInput("password", "toggle-password");
    toggleInput("confirm-password", "toggle-confirm-password");

    const form = document.getElementById("password-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const email = localStorage.getItem("temp_reg_email");

      if (password.length < 6) {
        Swal.fire("Error", "Password minimal 6 karakter", "warning");
        return;
      }

      if (password !== confirmPassword) {
        Swal.fire("Error", "Password konfirmasi tidak cocok", "warning");
        return;
      }

      Swal.fire({ title: "Menyimpan...", didOpen: () => Swal.showLoading() });

      try {
        const result = await completeRegistration(email, password, confirmPassword);

        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Registrasi Berhasil!",
            text: "Silakan lengkapi profil Anda.",
            confirmButtonColor: "#5C3E94",
          }).then(() => {
            localStorage.removeItem("temp_reg_email");

            localStorage.setItem("pending_user_id", result.user_id);

            window.location.hash = "#/complete-profile";
          });
        } else {
          Swal.fire("Gagal", result.error || "Gagal menyimpan password", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Terjadi kesalahan sistem", "error");
      }
    });
  },
};

export default PasswordPage;