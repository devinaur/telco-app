import { searchProducts } from "../../data/api.js";

const SearchPage = {
  async render() {
    return `
      <div class="container mx-auto px-4 py-8 min-h-screen">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Cari & Filter Produk</h1>

        <div class="flex flex-col lg:flex-row gap-8">
          
          <div class="w-full lg:w-1/4 space-y-6">
            
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                <label class="block text-sm font-bold text-gray-700 mb-2">Kata Kunci</label>
                <div class="relative">
                    <input type="text" id="keyword-input" placeholder="Contoh: Streaming, 10GB..." 
                        class="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                    <i class="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                <h3 class="font-bold text-gray-800 mb-4 flex items-center justify-between">
                    Rentang Harga <i class="fa-solid fa-tag text-purple-500"></i>
                </h3>
                <div class="space-y-3">
                    <div>
                        <label class="text-xs text-gray-500">Minimum (Rp)</label>
                        <input type="number" id="min-price" placeholder="0" class="w-full px-3 py-2 border rounded-lg text-sm">
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">Maksimum (Rp)</label>
                        <input type="number" id="max-price" placeholder="500.000" class="w-full px-3 py-2 border rounded-lg text-sm">
                    </div>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                <h3 class="font-bold text-gray-800 mb-4">Durasi Paket</h3>
                <div class="space-y-2">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="duration-filter form-checkbox text-purple-600 rounded" value="harian">
                        <span class="text-gray-600 text-sm">Harian (1-3 Hari)</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="duration-filter form-checkbox text-purple-600 rounded" value="mingguan">
                        <span class="text-gray-600 text-sm">Mingguan (7-14 Hari)</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="duration-filter form-checkbox text-purple-600 rounded" value="bulanan">
                        <span class="text-gray-600 text-sm">Bulanan (30 Hari)</span>
                    </label>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                <h3 class="font-bold text-gray-800 mb-4">Besar Kuota</h3>
                <div class="space-y-2">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="quota-filter form-checkbox text-purple-600 rounded" value="small">
                        <span class="text-gray-600 text-sm">Kecil (< 5GB)</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="quota-filter form-checkbox text-purple-600 rounded" value="medium">
                        <span class="text-gray-600 text-sm">Sedang (5GB - 20GB)</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="quota-filter form-checkbox text-purple-600 rounded" value="large">
                        <span class="text-gray-600 text-sm">Besar (> 20GB)</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="quota-filter form-checkbox text-purple-600 rounded" value="unlimited">
                        <span class="text-gray-600 text-sm">Unlimited</span>
                    </label>
                </div>
            </div>

            <button id="apply-filter" class="w-full bg-[#5C3E94] hover:bg-[#4a327a] text-white font-bold py-3 rounded-xl shadow-lg transition">
                Terapkan Filter
            </button>
          </div>

          <div class="w-full lg:w-3/4">
            <div id="loading-indicator" class="hidden flex justify-center py-10">
                <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600"></div>
            </div>
            
            <div id="search-results" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            </div>
            
            <div id="pagination-controls" class="flex justify-center items-center mt-10 gap-2 hidden">
            </div>

            <div id="empty-state" class="hidden flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <i class="fa-solid fa-magnifying-glass text-2xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-700">Produk Tidak Ditemukan</h3>
                <p class="text-gray-500 text-sm">Coba atur ulang filter atau gunakan kata kunci lain.</p>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  async afterRender() {
    const searchInput = document.getElementById("keyword-input");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    const applyBtn = document.getElementById("apply-filter");
    const resultContainer = document.getElementById("search-results");
    const loadingEl = document.getElementById("loading-indicator");
    const emptyState = document.getElementById("empty-state");
    const paginationContainer = document.getElementById("pagination-controls");

    let currentPage = 1;
    const itemsPerPage = 9;
    let currentFilteredProducts = [];

    const parseQuota = (quotaStr) => {
        if (!quotaStr) return 0;
        const str = quotaStr.toUpperCase();
        if (str.includes("UNLIMITED")) return 999999;
        const match = str.match(/(\d+)/);
        if (!match) return 0;
        let val = parseInt(match[0]);
        if (str.includes("MB")) val = val / 1024;
        return val;
    };

    const parseValidity = (validityStr) => {
        if (!validityStr) return 0;
        const str = validityStr.toLowerCase();
        const match = str.match(/(\d+)/);
        let val = match ? parseInt(match[0]) : 0;
        if (str.includes("minggu") || str.includes("week")) val *= 7;
        if (str.includes("bulan") || str.includes("month")) val *= 30;
        return val;
    };

    const renderPagination = () => {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.classList.add("hidden");
            return;
        }
        paginationContainer.classList.remove("hidden");

        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = `<i class="fas fa-angles-left"></i>`;
        prevBtn.className = `w-10 h-10 rounded-full flex items-center justify-center border transition ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-purple-600 border-purple-600 hover:bg-purple-50'}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderProductsGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.innerText = i;
            pageBtn.className = `w-10 h-10 rounded-full font-medium transition ${i === currentPage ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`;
            pageBtn.onclick = () => {
                currentPage = i;
                renderProductsGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            paginationContainer.appendChild(pageBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = `<i class="fas fa-angles-right"></i>`;
        nextBtn.className = `w-10 h-10 rounded-full flex items-center justify-center border transition ${currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-purple-600 border-purple-600 hover:bg-purple-50'}`;
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProductsGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
        paginationContainer.appendChild(nextBtn);
    };

    const renderProductsGrid = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsToShow = currentFilteredProducts.slice(start, end);

        resultContainer.innerHTML = productsToShow.map(p => `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col h-full group">
                <div class="p-5 flex-grow relative">
                    <div class="flex justify-between items-start mb-2">
                        <span class="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                            ${p.type}
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
                        <p class="text-lg font-bold text-[#1F2544]">Rp${p.price.toLocaleString('id-ID')}</p>
                    </div>
                    <a href="#/beli-detail/${p.id}" class="bg-[#5C3E94] hover:bg-[#4a327a] text-white w-10 h-10 rounded-xl flex items-center justify-center transition shadow-md">
                        <i class="fa-solid fa-cart-plus"></i>
                    </a>
                </div>
            </div>
        `).join("");

        renderPagination();
    };

    const fetchAndRender = async () => {
        resultContainer.innerHTML = "";
        paginationContainer.innerHTML = "";
        emptyState.classList.add("hidden");
        loadingEl.classList.remove("hidden");

        currentPage = 1;

        const keyword = searchInput.value;
        const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;

        try {
            let products = await searchProducts(keyword, minPrice, maxPrice);

            const durationCheckboxes = Array.from(document.querySelectorAll(".duration-filter:checked")).map(c => c.value);
            const quotaCheckboxes = Array.from(document.querySelectorAll(".quota-filter:checked")).map(c => c.value);

            if (durationCheckboxes.length > 0 || quotaCheckboxes.length > 0) {
                products = products.filter(p => {
                    let passDuration = true;
                    let passQuota = true;

                    if (durationCheckboxes.length > 0) {
                        const days = parseValidity(p.validity);
                        passDuration = false;
                        if (durationCheckboxes.includes("harian") && days <= 3) passDuration = true;
                        if (durationCheckboxes.includes("mingguan") && days > 3 && days <= 14) passDuration = true;
                        if (durationCheckboxes.includes("bulanan") && days > 14) passDuration = true;
                    }

                    if (quotaCheckboxes.length > 0) {
                        const gb = parseQuota(p.quota_amount);
                        passQuota = false;
                        if (quotaCheckboxes.includes("unlimited") && gb > 10000) passQuota = true;
                        if (quotaCheckboxes.includes("small") && gb < 5) passQuota = true;
                        if (quotaCheckboxes.includes("medium") && gb >= 5 && gb <= 20) passQuota = true;
                        if (quotaCheckboxes.includes("large") && gb > 20 && gb < 10000) passQuota = true;
                    }

                    return passDuration && passQuota;
                });
            }

            loadingEl.classList.add("hidden");

            if (products.length === 0) {
                emptyState.classList.remove("hidden");
                return;
            }

            currentFilteredProducts = products;
            renderProductsGrid();

        } catch (error) {
            console.error(error);
            loadingEl.classList.add("hidden");
            emptyState.classList.remove("hidden");
        }
    };

    applyBtn.addEventListener("click", fetchAndRender);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') fetchAndRender();
    });

    fetchAndRender();
  }
};

export default SearchPage;