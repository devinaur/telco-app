import banner from "../../../public/images/banner.jpg";
import flexiblePkg from "../../../public/images/flexible.png";
import rewardImg from "../../../public/images/reward.png";
import jaringanImg from "../../../public/images/jaringankuat.png";

import {
  getUserStats,
  getLastPurchasedProducts,
  getPromoProducts,
  getRecommendationProducts,
} from "../../data/api.js";

export default class HomePage {
  async render() {
    return `
      <section class="container mx-auto h-auto pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl">

        <div class="user-stats relative overflow-hidden mt-6 rounded-[2rem] shadow-2xl shadow-purple-900/20">
            <div class="absolute inset-0 bg-gradient-to-br from-[#1F2544] via-[#2a3055] to-[#1F2544] z-0"></div>
            
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
            <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div class="relative z-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-white p-6 sm:p-8">
                
                <div class="flex flex-col items-center justify-center py-4 sm:py-2 gap-1 group">
                    <p class="text-xs font-medium text-purple-200 uppercase tracking-wider">Sisa Pulsa</p>
                    <p id="balance" class="text-3xl sm:text-2xl lg:text-4xl font-extrabold tracking-tight mt-1 mb-3 group-hover:scale-105 transition duration-300">
                        <span class="animate-pulse bg-white/20 h-8 w-24 rounded block"></span>
                    </p>
                    <a href="#/topup" class="px-6 py-2 bg-white text-[#1F2544] text-sm font-bold rounded-full shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
                        <i class="fa-solid fa-plus-circle text-[#5C3E94]"></i> Top Up
                    </a>
                </div>

                <div class="flex flex-col items-center justify-center py-6 sm:py-2 gap-1 group">
                     <p class="text-xs font-medium text-purple-200 uppercase tracking-wider">Total Kuota</p>
                    <p id="quota" class="text-3xl sm:text-2xl lg:text-4xl font-extrabold tracking-tight mt-1 mb-3 group-hover:scale-105 transition duration-300">
                        <span class="animate-pulse bg-white/20 h-8 w-24 rounded block"></span>
                    </p>
                    <div class="flex gap-3">
                        <a href="#/beli" class="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white hover:text-[#1F2544] transition-all duration-300">
                            Beli
                        </a>
                        <a href="#/quota" class="px-5 py-2 bg-[#5C3E94] text-white text-sm font-semibold rounded-full shadow-lg hover:bg-[#4a327a] hover:shadow-purple-500/30 transition-all duration-300">
                            Detail
                        </a>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center py-4 sm:py-2 gap-1 group">
                     <p class="text-xs font-medium text-purple-200 uppercase tracking-wider">Poin Telco</p>
                    <div class="flex items-center gap-2 mt-1 mb-3">
                        <p id="points" class="text-3xl sm:text-2xl lg:text-4xl font-extrabold tracking-tight">
                            <span class="animate-pulse bg-white/20 h-8 w-24 rounded block"></span>
                        </p>
                    </div>
                    <a href="#/reward" class="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#1F2544] text-sm font-bold rounded-full shadow-lg hover:shadow-yellow-400/30 hover:scale-105 active:scale-95 transition-all duration-300">
                        Tukar Poin
                    </a>
                </div>

            </div>
        </div>

        <div class="last-buy-section w-full mt-12 relative group/section">
          <div class="flex items-center justify-between mb-6 px-1">
            <div>
                <h2 class="text-xl sm:text-2xl font-bold text-[#1F2544]">Terakhir Dibeli</h2>
                <p class="text-sm text-gray-500 mt-1">Paket yang sering kamu gunakan</p>
            </div>
            
            <div class="hidden sm:flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                <button class="swiper-prev-btn w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#5C3E94] hover:text-white hover:border-[#5C3E94] transition shadow-sm">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <button class="swiper-next-btn w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#5C3E94] hover:text-white hover:border-[#5C3E94] transition shadow-sm">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
          </div>
          
          <div class="swiper last-buy-swiper w-full pb-10 !px-1">
            <div class="swiper-wrapper" id="last-buy-list">
                <div class="swiper-slide w-full sm:w-[280px]">
                    <div class="h-[150px] bg-gray-100 rounded-2xl animate-pulse border border-gray-200"></div>
                </div>
                <div class="swiper-slide w-full sm:w-[280px]">
                    <div class="h-[150px] bg-gray-100 rounded-2xl animate-pulse border border-gray-200"></div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
        
        <div class="mt-4 mb-8">
            <div class="flex items-center justify-between mb-4 px-1">
                <h2 class="text-lg sm:text-xl font-bold text-[#1F2544] flex items-center gap-2">
                    <i class="fa-solid fa-fire text-orange-500"></i> Rekomendasi Buat Kamu
                </h2>
                <a href="#/beli" class="text-sm font-semibold text-[#5C3E94] hover:underline">Lihat Semua</a>
            </div>

            <div class="swiper recommendation-swiper w-full pb-6 !px-1">
                <div class="swiper-wrapper" id="recommendation-list">
                    <div class="swiper-slide w-full sm:w-[240px]">
                        <div class="h-[170px] bg-gray-100 rounded-2xl animate-pulse border border-gray-200"></div>
                    </div>
                    <div class="swiper-slide w-full sm:w-[240px]">
                        <div class="h-[170px] bg-gray-100 rounded-2xl animate-pulse border border-gray-200"></div>
                    </div>
                     <div class="swiper-slide w-full sm:w-[240px]">
                        <div class="h-[170px] bg-gray-100 rounded-2xl animate-pulse border border-gray-200"></div>
                    </div>
                </div>
                </div>
        </div>
        
        <div class="relative w-full mt-8 rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
          <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-500 z-10"></div>
          <img src="${banner}" alt="Promo Banner" class="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700 ease-out"/>
        </div>

        <div class="mt-12">
            <div class="flex items-center gap-4 mb-6">
                <div class="h-8 w-1.5 bg-[#5C3E94] rounded-full"></div>
                <h2 class="text-xl sm:text-2xl font-bold text-[#1F2544]">Promo Spesial</h2>
            </div>

            <div id="promo-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                    <p>Mencari promo terbaik...</p>
                </div>
            </div>
        </div>

        <div class="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-purple-50/50">
            <div class="text-center mb-10">
                <h2 class="text-2xl font-bold text-[#1F2544]">Kenapa Nexus?</h2>
                <p class="text-gray-500 mt-2">Memberikan pengalaman terbaik untuk komunikasi Anda</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div class="flex flex-col items-center text-center group">
                    <div class="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <img src="${flexiblePkg}" alt="Fleksibel" class="w-10 h-10 object-contain" />
                    </div>
                    <h3 class="text-lg font-bold text-[#1F2544] mb-2">Sangat Fleksibel</h3>
                    <p class="text-sm text-gray-500 leading-relaxed px-4">Atur paket sesuai budget dan kebutuhanmu tanpa ribet.</p>
                </div>

                <div class="flex flex-col items-center text-center group">
                    <div class="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <img src="${jaringanImg}" alt="Jaringan" class="w-10 h-10 object-contain" />
                    </div>
                    <h3 class="text-lg font-bold text-[#1F2544] mb-2">Jaringan Stabil</h3>
                    <p class="text-sm text-gray-500 leading-relaxed px-4">Terhubung dimanapun dengan jaringan 4G & 5G terluas.</p>
                </div>

                <div class="flex flex-col items-center text-center group">
                    <div class="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <img src="${rewardImg}" alt="Reward" class="w-10 h-10 object-contain" />
                    </div>
                    <h3 class="text-lg font-bold text-[#1F2544] mb-2">Banjir Hadiah</h3>
                    <p class="text-sm text-gray-500 leading-relaxed px-4">Setiap transaksi menghasilkan poin yang bisa ditukar.</p>
                </div>
            </div>
        </div>

      </section>
    `;
  }

  async afterRender() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      window.location.hash = "#/login";
      return;
    }

    this.updateStats(userId);
    this.startRealtimeUpdates(userId);
    this.loadContent(userId);
  }

  async updateStats(userId) {
    try {
      const stats = await getUserStats(userId);
      const balanceEl = document.getElementById("balance");
      const quotaEl = document.getElementById("quota");
      const pointsEl = document.getElementById("points");

      if (balanceEl) balanceEl.innerText = `Rp${stats.balance.toLocaleString('id-ID')}`;
      if (quotaEl) quotaEl.innerText = stats.quota;
      if (pointsEl) pointsEl.innerText = `${stats.points.toLocaleString('id-ID')}`;

    } catch (error) {
      console.error(error);
    }
  }

  startRealtimeUpdates(userId) {
    if (window.statsInterval) clearInterval(window.statsInterval);
    window.statsInterval = setInterval(() => {
      if (!document.getElementById("balance")) { clearInterval(window.statsInterval); return; }
      this.updateStats(userId);
    }, 3000);
  }

  async loadContent(userId) {
    try {
      const lastBuys = await getLastPurchasedProducts(userId);
      const lastBuyContainer = document.getElementById("last-buy-list");

      if(lastBuyContainer) {
        lastBuyContainer.innerHTML = lastBuys.length
          ? lastBuys.map((p) => {
              const isTopup = p.transaction_type === 'topup';
              const label = isTopup ? 'Top Up Saldo' : 'Paket Data';
              const iconClass = isTopup ? 'fa-wallet' : 'fa-wifi';
              const cardBorder = isTopup ? 'border-green-100 hover:border-green-300' : 'border-purple-100 hover:border-purple-300';
              const iconBg = isTopup ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600';
              const btnStyle = isTopup 
                ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                : 'bg-purple-50 text-purple-600 hover:bg-[#5C3E94] hover:text-white';

              return `
            <div class="swiper-slide cursor-pointer last-buy-item p-1" 
                  data-type="${p.transaction_type}" 
                  data-id="${p.product_id}" 
                  data-amount="${p.price}"
                  data-desc="${p.name}"> 
                <div class="bg-white rounded-2xl shadow-sm border ${cardBorder} p-5 min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group h-full">
                  <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">${label}</span>
                        <p class="font-bold text-lg text-gray-800 leading-tight line-clamp-2" title="${p.name}">${p.name}</p>
                    </div>
                    <div class="w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                  </div>
                  <div>
                      <p class="text-xs text-gray-400 mb-2">${new Date(p.bought_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                      <div class="flex justify-between items-center pt-3 border-t border-gray-50">
                          <p class="text-[#1F2544] font-extrabold text-lg">Rp${p.price.toLocaleString('id-ID')}</p>
                          <button class="w-9 h-9 rounded-full ${btnStyle} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:rotate-90">
                            <i class="fa-solid fa-arrow-rotate-right text-xs"></i>
                          </button>
                      </div>
                  </div>
                </div>
            </div>
          `;
          }).join("")
          : `<div class="w-full text-center py-10 px-6 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500 col-span-full mx-1">
                <i class="fa-solid fa-receipt text-3xl mb-3 text-gray-300"></i>
                <p>Belum ada transaksi</p>
             </div>`;

        if (lastBuys.length > 0) {
            new Swiper(".last-buy-swiper", {
                loop: false,
                slidesPerView: 1.15,
                spaceBetween: 16,
                grabCursor: true,
                pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true },
                navigation: { nextEl: ".swiper-next-btn", prevEl: ".swiper-prev-btn" },
                breakpoints: {
                    640: { slidesPerView: 2.2, spaceBetween: 20 },
                    1024: { slidesPerView: 3.2, spaceBetween: 24 },
                },
                on: {
                    click: function (swiper, event) {
                        const clickedCard = event.target.closest('.last-buy-item');
                        if (clickedCard) {
                            const type = clickedCard.dataset.type;
                            const productId = clickedCard.dataset.id;
                            const amount = clickedCard.dataset.amount;
                            const desc = clickedCard.dataset.desc ? clickedCard.dataset.desc.toUpperCase() : '';

                            if (type === 'topup') {
                                localStorage.setItem('topup_preset_amount', amount);
                                let method = '';
                                if(desc.includes('BCA')) method = 'bca_va';
                                else if(desc.includes('GOPAY')) method = 'gopay';
                                else if(desc.includes('KARTU') || desc.includes('VISA') || desc.includes('CREDIT')) method = 'cc_visa';
                                if(method) localStorage.setItem('topup_preset_method', method);
                                window.location.hash = "#/topup";
                            } else if (productId && productId !== 'null' && productId !== 'undefined') {
                                window.location.hash = `#/beli-detail/${productId}`;
                            } else {
                                window.location.hash = "#/beli";
                            }
                        }
                    }
                }
            });
        }
      }

      const promoProducts = await getPromoProducts();
      const promoList = document.getElementById("promo-list");
      if(promoList) {
        promoList.innerHTML = promoProducts.length ? promoProducts.map((p) => `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col h-full group">
                <div class="p-5 flex-grow relative">
                    <div class="flex justify-between items-start mb-2">
                        <span class="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                            ${p.type || 'PROMO'}
                        </span>
                        <span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                            <i class="fa-regular fa-clock mr-1"></i> ${p.validity}
                        </span>
                    </div>
                    <h3 class="font-bold text-lg text-gray-800 mb-1 group-hover:text-purple-700 transition">${p.name}</h3>
                    <p class="text-sm text-gray-500 line-clamp-2">${p.description || '-'}</p>
                    
                    <div class="mt-4 flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <i class="fa-solid fa-wifi text-xs"></i>
                        </div>
                        <p class="font-bold text-gray-700">${p.quota_amount || '0 GB'}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p class="text-xs text-gray-400">Harga</p>
                        <p class="text-lg font-bold text-[#1F2544]">Rp${parseInt(p.price).toLocaleString('id-ID')}</p>
                    </div>
                    <a href="#/beli-detail/${p.id}" class="bg-[#5C3E94] hover:bg-[#4a327a] text-white w-10 h-10 rounded-xl flex items-center justify-center transition shadow-md">
                        <i class="fa-solid fa-cart-plus"></i>
                    </a>
                </div>
            </div>`).join("") : 
            `<div class="col-span-full flex flex-col items-center justify-center p-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                <p>Tidak ada promo saat ini</p>
             </div>`;
      }

      const recommendations = await getRecommendationProducts(userId);
      const recList = document.getElementById("recommendation-list");
      if(recList) {
        recList.innerHTML = recommendations.length ? recommendations.map((p) => `
            <div class="swiper-slide h-auto p-1">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 w-full group hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 cursor-pointer relative flex flex-col justify-between h-[180px] overflow-hidden" onclick="window.location.hash='#/beli-detail/${p.id}'">
                
                <div class="absolute top-0 right-0 bg-yellow-400 text-[#1F2544] text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-10 shadow-sm">
                    FOR YOU
                </div>

                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <i class="fa-solid fa-bolt text-[10px] text-green-600"></i>
                        </div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Internet</p>
                    </div>
                    <p class="font-bold text-lg text-gray-800 leading-snug group-hover:text-[#5C3E94] transition line-clamp-2">${p.name}</p>
                    <p class="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <i class="fa-regular fa-calendar"></i> ${p.validity}
                    </p>
                </div>

                <div class="flex justify-between items-end mt-2 pt-3 border-t border-dashed border-gray-100">
                    <p class="text-lg font-extrabold text-[#1F2544]">Rp${p.price.toLocaleString('id-ID')}</p>
                    <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1F2544] group-hover:bg-[#5C3E94] group-hover:text-white transition-colors duration-300">
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </div>
                </div>

                </div>
            </div>`).join("") : 
            `<div class="swiper-slide w-full"><div class="p-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center"><p class="text-xs">Belum ada rekomendasi.</p></div></div>`;
        
        if (recommendations.length > 0) {
            new Swiper(".recommendation-swiper", {
                loop: true,
                slidesPerView: 1.3,
                spaceBetween: 16,
                grabCursor: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    640: { slidesPerView: 2.3, spaceBetween: 20 },
                    1024: { slidesPerView: 3.3, spaceBetween: 24 },
                },
            });
        }
      }

    } catch (error) { 
        console.error("Error loading content:", error); 
    }
  }
}
