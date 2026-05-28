import {
  getPromoProducts,
  getProductsByCategory,
} from "../../data/api.js";

import banner1 from "../../../public/images/banner1.png";
import banner2 from "../../../public/images/banner2.png";
import banner3 from "../../../public/images/banner3.png";

export default class BeliPage {
  async render() {
    return `
      <div class="container pb-12">
        
        <div class="swiper w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[450px] rounded-xl overflow-hidden mt-6 shadow-lg">
          <div class="swiper-wrapper">
            <div class="swiper-slide flex items-center justify-center bg-gray-100">
              <img src="${banner1}" class="w-full h-full object-cover object-center" onerror="this.src='https://placehold.co/1200x450?text=Promo+Spesial'" />
            </div>
            <div class="swiper-slide flex items-center justify-center bg-gray-100">
              <img src="${banner2}" class="w-full h-full object-cover object-center" onerror="this.src='https://placehold.co/1200x450?text=Paket+Hemat'" />
            </div>
            <div class="swiper-slide flex items-center justify-center bg-gray-100">
              <img src="${banner3}" class="w-full h-full object-cover object-center" onerror="this.src='https://placehold.co/1200x450?text=Ekstra+Kuota'" />
            </div>
          </div>

          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev text-white/50 hover:text-white transition"></div>
          <div class="swiper-button-next text-white/50 hover:text-white transition"></div>
        </div>

        <div class="flex justify-center gap-3 mt-8 flex-wrap">
          <button class="filter-btn bg-[#5C3E94] text-white px-5 py-2 rounded-full shadow-md transition transform active:scale-95" data-category="promo">All Promo</button>
          
          <button class="filter-btn border border-[#5C3E94] text-[#5C3E94] px-5 py-2 rounded-full hover:bg-[#5C3E94] hover:text-white transition" data-category="General Offer">Internet</button>
          
          <button class="filter-btn border border-[#5C3E94] text-[#5C3E94] px-5 py-2 rounded-full hover:bg-[#5C3E94] hover:text-white transition" data-category="Streaming Partner Pack">Streaming</button>
          
          <button class="filter-btn border border-[#5C3E94] text-[#5C3E94] px-5 py-2 rounded-full hover:bg-[#5C3E94] hover:text-white transition" data-category="Roaming Pass">Roaming</button>
          
          <button class="filter-btn border border-[#5C3E94] text-[#5C3E94] px-5 py-2 rounded-full hover:bg-[#5C3E94] hover:text-white transition" data-category="Family Plan Offer">Family</button>
          
          <button class="filter-btn border border-[#5C3E94] text-[#5C3E94] px-5 py-2 rounded-full hover:bg-[#5C3E94] hover:text-white transition" data-category="Device Upgrade Offer">Bundling</button>

          <button class="filter-btn border border-[#5C3E94] text-[#5C3E94] px-5 py-2 rounded-full hover:bg-[#5C3E94] hover:text-white transition" data-category="Data Booster">Booster</button>
        </div>

        <h2 class="text-2xl font-bold mt-10 text-[#1F2544]" id="section-title">Promo Terbaru</h2>

        <div id="product-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 py-6">
           <div class="col-span-full py-20 flex justify-center">
             <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#5C3E94]"></div>
           </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    setTimeout(() => {
      if (typeof Swiper !== 'undefined') {
        new Swiper(".swiper", {
          loop: true,
          autoplay: { delay: 4000, disableOnInteraction: false },
          pagination: { el: ".swiper-pagination", clickable: true },
          navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        });
      }
    }, 100);

    try {
      const promos = await getPromoProducts();
      this.renderProducts(promos);
    } catch (error) {
      console.error("Failed to load initial products:", error);
      document.getElementById("product-list").innerHTML = `<p class="col-span-full text-center text-red-500">Gagal memuat data. Cek koneksi server.</p>`;
    }

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const category = btn.dataset.category;
        const btnText = btn.innerText;
        
        document.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove("bg-[#5C3E94]", "text-white", "shadow-md");
          b.classList.add("border-[#5C3E94]", "text-[#5C3E94]", "border");
        });
        btn.classList.remove("border-[#5C3E94]", "text-[#5C3E94]", "border");
        btn.classList.add("bg-[#5C3E94]", "text-white", "shadow-md");

        document.getElementById("section-title").innerText = category === 'promo' ? "Promo Terbaru" : `Paket ${btnText}`;
        const container = document.getElementById("product-list");
        container.innerHTML = `<div class="col-span-full py-20 flex justify-center"><div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#5C3E94]"></div></div>`;

        try {
          let products = [];
          if (category === "promo") {
            products = await getPromoProducts();
          } else {
            products = await getProductsByCategory(category);
          }
          this.renderProducts(products);
        } catch (error) {
          console.error(error);
          container.innerHTML = `<p class="col-span-full text-center text-red-500">Terjadi kesalahan saat memuat produk.</p>`;
        }
      });
    });
  }

  renderProducts(products) {
    const container = document.getElementById("product-list");
    
    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <i class="fa-regular fa-folder-open text-4xl mb-4"></i>
            <p>Tidak ada produk ditemukan untuk kategori ini.</p>
        </div>`;
      return;
    }

    container.innerHTML = products.map((p) => {
      let quotaDisplay = p.quota_amount || '0 GB';
      
      if (!isNaN(p.quota_amount) && p.quota_amount > 100) {
        quotaDisplay = `${(p.quota_amount / 1024).toFixed(0)} GB`;
      }

      return `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col h-full group">
          <div class="p-5 flex-grow relative">
              <div class="flex justify-between items-start mb-2">
                  <span class="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                      ${p.type || 'Paket'}
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
                  <p class="font-bold text-gray-700">${quotaDisplay}</p>
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
        </div>
      `;
    }).join("");
  }
}