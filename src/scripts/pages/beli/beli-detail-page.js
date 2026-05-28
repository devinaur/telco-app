import Swal from "sweetalert2";
import { getProductDetail, purchaseProduct } from "../../data/api.js";
import { parseActivePathname } from "../../routes/url-parser.js";

const BeliDetailPage = {
  async render() {
    return `
      <div id="detail-container" class="w-full min-h-screen pb-12">
        <div class="flex justify-center items-center h-screen">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5C3E94]"></div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const url = parseActivePathname();
    const productId = url.id;
    const container = document.getElementById("detail-container");

    try {
        const product = await getProductDetail(productId);

        if (!product || product.error) {
            throw new Error(product.message || "Produk tidak ditemukan");
        }

        const type = product.type || "";
        const validityRaw = product.validity || "0";
        const validityDays = parseInt(validityRaw.toString().replace(/[^0-9]/g, '')) || 0;
        const quotaRaw = product.quota_amount || "0";
        const quotaNum = parseInt(quotaRaw.toString().replace(/[^0-9]/g, '')) || 0;
        
        let quotaDisplay = "Unlimited / Non-Data";
        if (quotaNum > 0) {
             if (quotaNum > 1000) {
                quotaDisplay = `${(quotaNum / 1024).toFixed(0)} GB`;
             } else {
                quotaDisplay = `${quotaNum} GB`;
             }
        }

        let bgImage = 'https://placehold.co/800x600/5C3E94/FFF?text=Super+Kuota';
        let typeIcon = 'fa-wifi';
        let badgeColor = 'bg-purple-600';

        if (type.includes('Streaming')) {
            bgImage = 'https://placehold.co/800x600/E91E63/FFF?text=Paket+Hiburan';
            typeIcon = 'fa-music';
            badgeColor = 'bg-pink-600';
        } 
        else if (type.includes('Roaming')) {
            bgImage = 'https://placehold.co/800x600/00aaff/FFF?text=Paket+Travel';
            typeIcon = 'fa-plane';
            badgeColor = 'bg-blue-500';
        }
        else if (type.includes('Device')) {
            bgImage = 'https://placehold.co/800x600/111827/FFF?text=Bundling+HP';
            typeIcon = 'fa-mobile-screen';
            badgeColor = 'bg-gray-800';
        }
        else if (type.includes('Family')) {
            bgImage = 'https://placehold.co/800x600/F59E0B/FFF?text=Paket+Keluarga';
            typeIcon = 'fa-users';
            badgeColor = 'bg-yellow-600';
        }
        else if (type.includes('Voice')) {
            bgImage = 'https://placehold.co/800x600/10B981/FFF?text=Paket+Nelpon';
            typeIcon = 'fa-phone';
            badgeColor = 'bg-green-600';
        }
        else if (type.includes('Booster')) {
            bgImage = 'https://placehold.co/800x600/FF5722/FFF?text=Kuota+Tambahan';
            typeIcon = 'fa-rocket';
            badgeColor = 'bg-orange-600';
        }
        else if (type.includes('Promo')) {
            bgImage = 'https://placehold.co/800x600/8B5CF6/FFF?text=Promo+Spesial';
            typeIcon = 'fa-tags';
            badgeColor = 'bg-violet-600';
        }

        container.innerHTML = `
          <div class="container mt-8">
            <div class="bg-white shadow-lg rounded-3xl overflow-hidden">
              <div class="relative h-64 md:h-80 w-full group">
                <img 
                  src="${bgImage}" 
                  alt="${product.name}" 
                  class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#1F2544] via-transparent to-transparent opacity-90"></div>
                
                <div class="absolute top-6 left-6">
                  <a href="#/beli" class="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-[#5C3E94] transition-all duration-300">
                    <i class="fas fa-arrow-left"></i>
                  </a>
                </div>

                <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <span class="px-3 py-1 ${badgeColor} text-white text-xs font-bold uppercase tracking-wider mb-3 inline-flex items-center gap-2 rounded-lg shadow-sm">
                    <i class="fa-solid ${typeIcon}"></i> ${type}
                  </span>
                  <h1 class="text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">${product.name}</h1>
                </div>
              </div>
            </div>
          </div>

          <div class="container py-8">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/30">
                <div class="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div class="flex-1">
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Harga Produk</p>
                    <div class="flex items-center text-[#5C3E94]">
                      <span class="text-3xl font-extrabold">Rp${parseInt(product.price).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  
                  <div class="flex gap-8">
                    <div>
                        <p class="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Masa Aktif</p>
                        <p class="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <i class="fa-regular fa-clock text-[#5C3E94]"></i> ${validityDays} Hari
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Total Kuota</p>
                        <p class="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <i class="fa-solid fa-database text-[#5C3E94]"></i> ${quotaDisplay}
                        </p>
                    </div>
                  </div>
                </div>
              </div>

               <div class="p-6 md:p-8 space-y-8">
                  <div>
                      <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                          <div class="w-1 h-6 bg-[#5C3E94] rounded-full mr-3"></div>
                          Deskripsi Paket
                      </h3>
                      <p class="text-gray-600 leading-relaxed text-justify">
                          ${product.description || "Nikmati layanan terbaik dari TelcoApp dengan paket ini."}
                      </p>
                  </div>

                  <div>
                      <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                          <div class="w-1 h-6 bg-[#5C3E94] rounded-full mr-3"></div>
                          Syarat & Ketentuan
                      </h3>
                      <ul class="space-y-3 text-gray-600 text-sm">
                          <li class="flex items-start">
                              <i class="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                              <span>Paket akan langsung aktif setelah pembayaran berhasil.</span>
                          </li>
                          <li class="flex items-start">
                              <i class="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                              <span>Pastikan pulsa/saldo mencukupi sebelum membeli.</span>
                          </li>
                          <li class="flex items-start">
                              <i class="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                              <span>Kuota berlaku di semua jaringan (2G/3G/4G/5G).</span>
                          </li>
                      </ul>
                  </div>
              </div>

              <div class="bg-gray-50 p-6 md:p-8 border-t border-gray-200 sticky bottom-0 z-10">
                <button 
                  id="buy-btn"
                  class="w-full bg-[#5C3E94] hover:bg-[#4a327a] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.99] transition-all duration-200 flex flex-col items-center justify-center group"
                >
                  <div class="flex items-center gap-3 text-lg mb-1">
                    <span>Beli Paket Ini</span>
                    <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </div>
                  <span class="text-xs font-medium text-purple-200 bg-white/10 px-3 py-0.5 rounded-full">
                    Bayar Rp${parseInt(product.price).toLocaleString('id-ID')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        `;

        document.getElementById("buy-btn").addEventListener("click", () => {
            this.processPurchase(product);
        });

    } catch (err) {
        console.error("Error loading product detail:", err);
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
              <div class="bg-red-100 p-6 rounded-full mb-6">
                <i class="fas fa-triangle-exclamation text-red-500 text-4xl"></i>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Gagal Memuat Paket</h2>
              <p class="text-gray-600 mb-8 max-w-md">${err.message}</p>
              <a href="#/beli" class="bg-[#5C3E94] text-white px-8 py-3 rounded-full font-bold hover:bg-[#4a327a] transition shadow-lg">
                Kembali ke Katalog
              </a>
            </div>`;
    }
  },

  async processPurchase(product) {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
        Swal.fire({
            icon: "warning",
            title: "Login Diperlukan",
            text: "Silakan login terlebih dahulu untuk membeli paket ini.",
            confirmButtonColor: "#5C3E94",
            confirmButtonText: "Login Sekarang"
        }).then((result) => {
            if (result.isConfirmed) window.location.hash = "#/login";
        });
        return;
    }

    const confirmResult = await Swal.fire({
        title: 'Konfirmasi Pembelian',
        html: `
            <p class="mb-2">Anda akan membeli:</p>
            <h3 class="font-bold text-xl text-[#5C3E94] mb-4">${product.name}</h3>
            <p>Harga: <b>Rp${parseInt(product.price).toLocaleString('id-ID')}</b></p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#5C3E94',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Beli',
        cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Memproses Transaksi...',
      text: 'Mohon jangan tutup halaman ini',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const data = await purchaseProduct(userId, parseInt(product.id));

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Pembelian Berhasil!",
          html: `
            <div class="text-center space-y-4">
                <div class="text-green-500 text-5xl mb-2"><i class="fa-solid fa-circle-check"></i></div>
                <p class="text-lg">Paket <b>${product.name}</b> telah aktif.</p>
                <div class="bg-gray-100 p-4 rounded-xl text-sm border border-gray-200">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-500">Sisa Saldo</span>
                        <span class="font-bold text-gray-800">Rp${data.new_balance.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Poin Didapat</span>
                        <span class="font-bold text-[#5C3E94]">+${data.earned_points} Poin</span>
                    </div>
                </div>
            </div>
          `,
          confirmButtonText: "Lihat Beranda",
          confirmButtonColor: "#5C3E94",
        }).then(() => {
          window.location.hash = "#/";
        });
      } else {
        throw new Error(data.message || data.error || "Terjadi kesalahan yang tidak diketahui");
      }

    } catch (err) {
      console.error("Purchase Error:", err);
      Swal.fire({
        icon: "error",
        title: "Pembelian Gagal",
        text: err.message || "Tidak dapat terhubung ke server.",
        confirmButtonColor: "#d33",
      });
    }
  }
};

export default BeliDetailPage;