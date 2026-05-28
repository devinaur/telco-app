import Swal from "sweetalert2";
import { login } from "../../data/api.js";

const LoginPage = {
  async render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-white px-4 py-12">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Selamat Datang</h2>
            <p class="mt-2 text-gray-600">Silakan login ke akun Anda</p>
          </div>

          <form class="space-y-6" id="login-form" novalidate>
            <div>
              <label for="email" class="block text-base font-medium text-gray-900 mb-3">
                Email / Nomor HP
              </label>
              <div class="relative">
                <input
                  id="email"
                  name="email"
                  type="text"
                  class="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#5C3E94] text-sm bg-[#FFF5F5] transition-all shadow-md focus:shadow-lg"
                  placeholder="Masukkan Email atau Nomor HP">
              </div>
            </div>

            <div>
              <label for="password" class="block text-base font-medium text-gray-900 mb-3">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  class="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#5C3E94] text-sm bg-[#FFF5F5] transition-all shadow-md focus:shadow-lg"
                  placeholder="Masukkan Password">
                <button
                  type="button"
                  id="toggle-password"
                  class="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#5C3E94] focus:outline-none transition-colors">
                  <i class="fa-solid fa-eye-slash text-xl"></i>
                </button>
              </div>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                class="w-full py-4 px-4 border-2 border-[#5C3E94] text-base font-bold rounded-full text-black bg-white hover:bg-[#5C3E94] hover:text-white focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                Masuk
              </button>
            </div>

            <div class="flex items-center justify-center gap-3 py-2">
              <div class="flex-1 border-t border-gray-300"></div>
              <span class="text-sm text-gray-600">atau masuk dengan</span>
              <div class="flex-1 border-t border-gray-300"></div>
            </div>

            <div class="flex justify-center gap-4 pt-2">
              <button
                type="button"
                class="w-16 h-16 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all shadow-md hover:shadow-lg">
                <i class="fa-brands fa-google text-2xl text-gray-700"></i>
              </button>
              <button
                type="button"
                class="w-16 h-16 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all shadow-md hover:shadow-lg">
                <i class="fa-brands fa-apple text-2xl text-gray-700"></i>
              </button>
            </div>

            <div class="text-center pt-2">
              <span class="text-sm text-gray-600">Belum punya akun? </span>
              <a href="#/register" class="text-sm font-bold text-[#5C3E94] hover:underline">
                Daftar
              </a>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const passwordField = document.getElementById("password");
    const toggleButton = document.getElementById("toggle-password");

    if (toggleButton && passwordField) {
      toggleButton.addEventListener("click", (e) => {
        e.preventDefault();
        const type =
          passwordField.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordField.setAttribute("type", type);
        toggleButton.querySelector("i").className =
          type === "password"
            ? "fa-solid fa-eye-slash text-xl"
            : "fa-solid fa-eye text-xl";
      });
    }

    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email) {
        Swal.fire(
          "Peringatan",
          "Email atau Nomor HP tidak boleh kosong",
          "warning"
        );
        return;
      }

      if (!password) {
        Swal.fire("Peringatan", "Password tidak boleh kosong", "warning");
        return;
      }

      const btn = form.querySelector("button[type='submit']");
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      btn.disabled = true;

      try {
        const result = await login(email, password);

        if (result.success) {
          localStorage.setItem("user_id", result.user.id);
          localStorage.setItem("user_name", result.user.name);
          localStorage.setItem("customer_id", result.user.customer_id);

          Swal.fire({
            icon: "success",
            title: "Login Berhasil",
            text: `Selamat datang kembali, ${result.user.name}!`,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.hash = "#/";
            window.location.reload();
          });
        } else {
          Swal.fire(
            "Gagal",
            result.error || "Kombinasi akun tidak ditemukan",
            "error"
          );
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal terhubung ke server", "error");
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  },
};

export default LoginPage;