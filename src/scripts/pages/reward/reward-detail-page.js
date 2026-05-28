import Swal from 'sweetalert2';
import { parseActivePathname } from '../../routes/url-parser.js';
import { getRewardDetail, redeemReward } from "../../data/api.js";

const RewardDetailPage = {
  async render() {
    return `
      <div id="detail-container" class="w-full min-h-screen pb-12">
        <div class="flex justify-center items-center h-screen">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700"></div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const url = parseActivePathname();
    const reward = await getRewardDetail(url.id);
    const container = document.getElementById("detail-container");

    if (!reward || reward.error) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-screen px-4 text-center">
          <div class="bg-red-100 p-4 rounded-full mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Reward Tidak Ditemukan</h2>
          <p class="text-gray-600 mb-6">Reward sudah dihapus atau tidak tersedia.</p>
          <a href="#/reward" class="bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg">
            Kembali ke Katalog
          </a>
        </div>`;
      return;
    }
    
    const initial = reward.initial_stock || reward.quantity || 100;
    const current = reward.quantity;
    const stockPercentage = Math.min((current / initial) * 100, 100);

    const isLow = current < 20;
    const barColor = current === 0 ? "bg-gray-500" : isLow ? "bg-red-500" : "bg-purple-600";
    const statusText = current === 0 ? "Stok Habis" : isLow ? "Stok Menipis!" : "Tersedia";
    const statusColor = current === 0 ? "text-red-600" : isLow ? "text-red-600" : "text-green-600";

    container.innerHTML = `
      <div class="container mt-8">
        <div class="bg-white shadow-sm rounded-2xl overflow-hidden">
          <div class="relative h-64 md:h-96 w-full">
            <img 
              src="${reward.image_path || `https://placehold.co/800x600?text=${reward.name}`}" 
              alt="${reward.name}" 
              class="w-full h-full object-cover"
              onerror="this.src='https://placehold.co/800x600?text=No+Image'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute top-6 left-6">
              <a href="#/reward" class="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-purple-700 transition-all duration-300">
                <i class="fas fa-arrow-left"></i>
              </a>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <span class="px-3 py-1 bg-purple-600 text-white text-xs font-bold uppercase tracking-wider mb-3 inline-block rounded-md shadow-sm">
                ${reward.reward_type || 'Reward'}
              </span>
              <h1 class="text-3xl md:text-4xl font-bold leading-tight shadow-black drop-shadow-lg">${reward.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-8">
        <div class="bg-white rounded-2xl shadow-base border border-gray-100 overflow-hidden">
          <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
            <div class="flex flex-col md:flex-row gap-6 justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Harga Tukar</p>
                <div class="flex items-center text-purple-700">
                  <i class="fas fa-coins text-2xl mr-2"></i>
                  <span class="text-3xl font-extrabold">${reward.required_points}</span>
                  <span class="text-lg ml-1 font-medium text-gray-600">Poin</span>
                </div>
              </div>
              
              <div class="flex-1 md:text-right md:border-l md:border-gray-200 md:pl-6">
                <div class="flex justify-between md:justify-end items-center mb-2 gap-2">
                  <span class="text-sm text-gray-500 font-bold uppercase tracking-wide">Stok Reward</span>
                  <span class="${statusColor} font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-sm">
                    ${statusText}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div class="${barColor} h-2.5 rounded-full transition-all duration-1000" style="width: ${stockPercentage}%"></div>
                </div>
                <p class="text-sm text-gray-500">Tersisa <span class="font-bold text-gray-800">${current}</span> dari ${initial} unit</p>
              </div>
            </div>
          </div>

           <div class="p-6 md:p-8 space-y-8">
              <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span class="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
                      Deskripsi
                  </h3>
                  <p class="text-gray-600 leading-relaxed text-justify">
                      ${reward.description || "Potongan harga untuk pembelian di toko pilihan."}
                  </p>
              </div>

              <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <span class="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
                      Syarat & Ketentuan
                  </h3>
                  <ul class="space-y-3 text-gray-600 text-sm">
                      <li class="flex items-start">
                          <i class="fas fa-check-circle text-purple-500 mt-1 mr-3 flex-shrink-0"></i>
                          <span>Voucher berlaku untuk seluruh pengguna.</span>
                      </li>
                      <li class="flex items-start">
                          <i class="fas fa-check-circle text-purple-500 mt-1 mr-3 flex-shrink-0"></i>
                          <span>Poin yang sudah ditukarkan tidak dapat dikembalikan.</span>
                      </li>
                      <li class="flex items-start">
                          <i class="fas fa-check-circle text-purple-500 mt-1 mr-3 flex-shrink-0"></i>
                          <span>Masa berlaku sesuai tanggal kedaluwarsa.</span>
                      </li>
                  </ul>
              </div>

              <div class="bg-blue-50 rounded-xl p-4 flex items-center">
                  <div class="bg-white p-2 rounded-lg mr-4 shadow-sm text-blue-600">
                      <i class="far fa-calendar-alt text-xl"></i>
                  </div>
                  <div>
                      <p class="text-xs text-blue-600 font-bold uppercase">Masa Berlaku</p>
                      <p class="text-gray-900 font-medium">
                          ${reward.expires_at ? new Date(reward.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "31 Desember 2025"}
                      </p>
                  </div>
              </div>
          </div>

          <div class="bg-gray-50 p-6 md:p-8 border-t border-gray-200">
            <button 
              id="redeem-btn"
              class="w-full bg-[#5C3E94] hover:bg-[#4a327a] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex flex-col items-center justify-center group"
              ${current === 0 ? 'disabled' : ''}
            >
              <div class="flex items-center gap-2 text-lg mb-1">
                <span id="redeem-text">${current === 0 ? 'Stok Habis' : 'Tukarkan Sekarang'}</span>
              </div>
              <span class="text-xs font-medium bg-white/20 px-3 py-0.5 rounded-full" ${current === 0 ? 'hidden' : ''}>
                Butuh ${reward.required_points} Poin
              </span>
            </button>
            <p class="text-center text-xs text-gray-500 mt-3">
              Dengan menekan tombol di atas, poin Anda akan otomatis terpotong.
            </p>
          </div>
        </div>
      </div>
    `;

    const redeemBtn = document.getElementById("redeem-btn");
    if (redeemBtn) {
      redeemBtn.addEventListener("click", async () => {
        const confirmResult = await Swal.fire({
          title: 'Konfirmasi Penukaran',
          text: `Tukar ${reward.required_points} poin untuk ${reward.name}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#5C3E94',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, Tukar',
          cancelButtonText: 'Batal',
        });

        if (confirmResult.isConfirmed) {
          try {
            const apiResult = await redeemReward(reward.id);
            if (apiResult.success) {
              await Swal.fire({
                title: 'Berhasil!',
                text: `Reward berhasil ditukar. Sisa poin: ${apiResult.new_balance}`,
                icon: 'success',
                confirmButtonColor: '#5C3E94',
              });
              window.location.hash = "#/reward";
            } else {
              Swal.fire({
                title: 'Gagal',
                text: apiResult.error,
                icon: 'error',
              });
            }
          } catch (error) {
            Swal.fire({
              title: 'Error',
              text: 'Gagal terhubung ke server.',
              icon: 'error',
            });
          }
        }
      });
    }
  },
};

export default RewardDetailPage;