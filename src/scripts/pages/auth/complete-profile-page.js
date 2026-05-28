import Swal from "sweetalert2";
import { completeProfile } from "../../data/api.js";

const CompleteProfilePage = {
  async render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-white px-4 py-12">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Lengkapi Profil</h2>
            <p class="text-gray-600 mt-2">Pilih tipe SIM dan perangkat yang digunakan</p>
          </div>

          <form class="space-y-6" id="profile-form">

            <div>
              <label class="block text-base mb-2 font-semibold">Tipe SIM</label>
              <select id="plan_type" class="w-full p-3 border rounded-lg">
                <option value="">-- Pilih --</option>
                <option value="Prepaid">Prepaid</option>
                <option value="Postpaid">Postpaid</option>
              </select>
            </div>

            <div>
              <label class="block text-base mb-2 font-semibold">Device Brand</label>
              <select id="device_brand" class="w-full p-3 border rounded-lg">
                <option value="">-- Pilih --</option>
                <option>Samsung</option>
                <option>Apple</option>
                <option>Xiaomi</option>
                <option>Oppo</option>
                <option>Vivo</option>
                <option>Realme</option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-[#5C3E94] text-white font-bold rounded-lg">
              Simpan & Lanjut
            </button>

          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById("profile-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const device_brand = document.getElementById("device_brand").value;
      const plan_type = document.getElementById("plan_type").value;
      const pendingUserId = localStorage.getItem("pending_user_id");

      if (!pendingUserId) {
        Swal.fire("Sesi Habis", "Silakan login ulang.", "error").then(() => {
          window.location.hash = "#/login";
        });
        return;
      }

      if (!device_brand || !plan_type) {
        Swal.fire("Lengkapi!", "Semua field wajib diisi", "warning");
        return;
      }

      Swal.fire({ title: "Menyimpan...", didOpen: () => Swal.showLoading() });

      const result = await completeProfile(pendingUserId, device_brand, plan_type);

      if (result.success) {
        Swal.fire(
          "Berhasil!",
          "Profil Anda sudah lengkap. Selamat datang!",
          "success"
        ).then(() => {
          localStorage.removeItem("pending_user_id");
          localStorage.setItem("user_id", pendingUserId);

          window.location.hash = "#/";
        });
      } else {
        Swal.fire("Error", result.error || "Terjadi kesalahan", "error");
      }
    });
  },
};

export default CompleteProfilePage;