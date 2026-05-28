import Swal from "sweetalert2";
import { registerUser } from "../../data/api.js";

const RegisterPage = {
  async render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-white px-4 py-12">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Daftar</h2>
            <p class="mt-2 text-gray-600">Daftarkan Diri Anda</p>
          </div>

          <form class="space-y-6" id="register-form" novalidate>
            <div>
              <label class="block text-base font-medium text-gray-900 mb-3">Nama Lengkap</label>
              <div class="relative">
                <input
                  id="name"
                  type="text"
                  class="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#5C3E94] text-sm bg-[#FFF5F5] transition-all shadow-md focus:shadow-lg"
                  placeholder="Contoh: Budi Santoso">
              </div>
            </div>

            <div>
              <label class="block text-base font-medium text-gray-900 mb-3">Email</label>
              <div class="relative">
                <input
                  id="email"
                  type="email"
                  class="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#5C3E94] text-sm bg-[#FFF5F5] transition-all shadow-md focus:shadow-lg"
                  placeholder="nama@email.com">
              </div>
            </div>

            <div>
              <label class="block text-base font-medium text-gray-900 mb-3">Nomor HP</label>
              <div class="relative">
                <span class="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm font-bold z-10">+62</span>
                <input
                  id="phone"
                  type="tel"
                  class="w-full pl-16 pr-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#5C3E94] text-sm bg-[#FFF5F5] transition-all shadow-md focus:shadow-lg"
                  placeholder="8123456789">
              </div>
              <p
                class="text-xs text-red-500 mt-2 hidden text-center"
                id="phone-warning">
                * Tidak perlu memasukkan angka 0 di depan.
              </p>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                class="w-full py-4 px-4 border-2 border-[#5C3E94] text-base font-bold rounded-full text-black bg-white hover:bg-[#5C3E94] hover:text-white focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                Daftar Sekarang
              </button>
            </div>

            <div class="flex items-center justify-center gap-3 py-2">
              <div class="flex-1 border-t border-gray-300"></div>
              <span class="text-sm text-gray-600">atau daftar dengan</span>
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
              <span class="text-sm text-gray-600">Sudah punya akun? </span>
              <a href="#/login" class="text-sm font-bold text-[#5C3E94] hover:underline">Login disini</a>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById("register-form");
    const phoneInput = document.getElementById("phone");
    const phoneWarning = document.getElementById("phone-warning");

    phoneInput.addEventListener("input", (e) => {
      if (e.target.value.startsWith("0")) {
        phoneWarning.classList.remove("hidden");
        e.target.classList.add("border-red-500", "bg-red-50");
      } else {
        phoneWarning.classList.add("hidden");
        e.target.classList.remove("border-red-500", "bg-red-50");
      }
    });

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();

      if (!name) {
        Swal.fire("Validasi Gagal", "Nama lengkap wajib diisi", "warning");
        return;
      }

      if (!validateEmail(email)) {
        Swal.fire("Validasi Gagal", "Format email tidak valid", "warning");
        return;
      }

      if (phone.startsWith("0")) {
        Swal.fire(
          "Format Salah",
          "Nomor HP tidak boleh diawali angka 0. Silakan hapus 0 di depan.",
          "warning"
        );
        return;
      }

      if (!/^\d{9,14}$/.test(phone)) {
        Swal.fire(
          "Validasi Gagal",
          "Nomor HP harus berupa angka dan valid (9-14 digit)",
          "warning"
        );
        return;
      }

      Swal.fire({ title: "Memproses...", didOpen: () => Swal.showLoading() });

      try {
        const result = await registerUser(name, email, phone);

        if (result.success) {
          localStorage.setItem("temp_reg_email", email);

          if (result.is_existing) {
            Swal.fire({
              icon: "info",
              title: "Akun Sudah Terdaftar",
              html: `
                <div class="text-left text-sm text-gray-600 space-y-2">
                  <p>Email <b>${email}</b> sudah terdaftar tetapi belum terverifikasi.</p>
                  <p>Silakan masukkan kode OTP yang sudah dikirim sebelumnya.</p>
                  <p class="mt-2 text-purple-700 font-semibold">
                    <i class="fas fa-info-circle"></i> Jika kode OTP sudah kedaluwarsa, silakan tekan tombol "Kirim Ulang" di halaman berikutnya.
                  </p>
                </div>
              `,
              confirmButtonText: "Lanjut Masukkan OTP",
              confirmButtonColor: "#5C3E94",
              showCancelButton: false,
            }).then(() => {
              window.location.hash = "#/otp";
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "OTP Terkirim!",
              text: "Silakan cek email Anda untuk kode verifikasi.",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              window.location.hash = "#/otp";
            });
          }
        } else {
          Swal.fire(
            "Gagal",
            result.error || "Terjadi kesalahan pada server",
            "error"
          );
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Gagal terhubung ke server", "error");
      }
    });
  },
};

export default RegisterPage;