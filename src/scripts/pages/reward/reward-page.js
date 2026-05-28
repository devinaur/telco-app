import Swal from 'sweetalert2';
import { getAllRewards, getUserPoints } from "../../data/api.js";

const RewardPage = {
  async render() {
    return `
    <div class="container">
        <div class="bg-[#5C3E94] rounded-3xl p-6 mb-8 relative overflow-hidden">
            <div class="relative z-10 md:pr-56 lg:pr-96 md:px-6 md:space-y-4">
                <div class="inline-flex items-center bg-black/30 rounded-full px-3 py-1.5 mb-4">
                    <i class="fas fa-gift text-white text-xs mr-2"></i>
                    <span class="text-white text-xs font-medium">Bonus Poin Spesial untuk Pengguna Baru!</span>
                </div>
                
                <h1 class="text-white text-3xl md:text-5xl font-bold mb-2 space-y-2">
                    <span class="block">Belanja Makin Seru,</span>
                    <span class="block text-black">Untung Berlipat</span>
                    <span class="block">Setiap Hari!</span>
                </h1>
                
                <p class="text-white/90 text-base md:text-lg mb-6 leading-relaxed md:pr-36">
                    Setiap pembelanjaan adalah kesempatan emas! Ubah transaksimu jadi poin, tukar dengan paket data atau voucher diskon dari penawaran spesial!
                </p>
                
                <button id="hero-cta-btn" class="bg-black text-white font-semibold px-8 py-3 md:px-10 rounded-full inline-flex items-center space-x-2 hover:bg-black/70 transition w-full md:w-auto justify-center">
                    <p class="pb-1">Mulai Kumpulkan Poin</p>
                    <i class="fa-solid fa-rocket"></i>
                </button>
            </div>
            
            <div class="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 rotate-[5deg] px-6 lg:px-12">
                <div class="bg-black backdrop-blur-sm rounded-3xl p-6 lg:p-12">
                    <i class="fas fa-gifts text-white text-4xl lg:text-6xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-[#5C3E94] rounded-2xl p-6 md:px-12 mb-8 space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white pb-4 gap-4 md:gap-0">
                <div>
                    <p class="text-purple-200 text-sm mb-1">Poin Kamu Saat Ini</p>
                    <h2 id="user-balance-display" class="text-white text-4xl md:text-5xl font-bold">...</h2>
                </div>
                <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <button id="add-point-btn" class="w-full md:w-auto flex items-center justify-center bg-black text-white font-bold px-6 py-3 space-x-2 rounded-full sm:text-base md:text-lg hover:bg-black/70 transition">
                        <i class="fas fa-plus"></i>
                        <p class="pb-0.5">Tambah Poin</p>
                    </button>
                </div>
            </div>
            <div class="text-purple-200 text-sm flex items-start md:items-center space-x-2">
                <i class="fa-solid fa-sack-dollar mt-1 md:mt-0"></i>
                <p>Kumpulkan poin dan tukarkan dengan hadiah menarik!</p>
            </div>
        </div>

        <div class="mb-12">
            <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div class="w-full md:w-auto">
                    <h3 class="text-gray-900 text-2xl md:text-3xl font-bold mb-3" id="section-title">Tukarkan Poin Kamu</h3>
                    <p class="text-gray-600 text-base">Pilih hadiah favoritmu yang siap kamu tukar sekarang!</p>
                </div>
                
                <div class="w-full md:w-auto">
                    <select id="reward-filter" class="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700 bg-white">
                        <option value="all">Semua Kategori</option>
                    </select>
                </div>
            </div>
            
            <div id="reward-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[200px]">
                <p class="text-gray-500 col-span-full text-center py-10">Memuat reward...</p>
            </div>

            <div id="pagination-container" class="flex justify-center items-center gap-2 mt-10 hidden">
            </div>
        </div>
    </div>
    `;
  },

  async afterRender() {
    const heroBtn = document.getElementById('hero-cta-btn');
    const addPointBtn = document.getElementById('add-point-btn');
    const logoutBtn = document.getElementById('logout-btn-reward');
    const balanceDisplay = document.getElementById('user-balance-display');

    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            window.location.hash = '#/beli';
        });
    }

    if (addPointBtn) {
        addPointBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Tambah Poin',
                html: `
                    <div class="flex flex-col gap-4 mt-2">
                        <button id="modal-beli-btn" class="flex items-center justify-between bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-4 px-6 rounded-xl transition group">
                            <div class="flex items-center gap-3">
                                <div class="bg-white p-2 rounded-lg text-purple-600"><i class="fa-solid fa-cart-shopping"></i></div>
                                <div class="text-left">
                                    <p class="text-sm font-bold">Beli Paket</p>
                                    <p class="text-xs font-normal opacity-80">Dapat poin dari transaksi</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-right opacity-50 group-hover:translate-x-1 transition"></i>
                        </button>

                        <button id="modal-checkin-btn" class="flex items-center justify-between bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-4 px-6 rounded-xl transition group">
                            <div class="flex items-center gap-3">
                                <div class="bg-white p-2 rounded-lg text-yellow-600"><i class="fa-solid fa-calendar-check"></i></div>
                                <div class="text-left">
                                    <p class="text-sm font-bold">Daily Check In</p>
                                    <p class="text-xs font-normal opacity-80">Klaim poin gratis harian</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-right opacity-50 group-hover:translate-x-1 transition"></i>
                        </button>
                    </div>
                `,
                showConfirmButton: false,
                showCloseButton: true,
                customClass: {
                    popup: 'rounded-3xl p-6'
                },
                didOpen: () => {
                    document.getElementById('modal-beli-btn').addEventListener('click', () => {
                        Swal.close();
                        window.location.hash = '#/beli';
                    });
                    
                    document.getElementById('modal-checkin-btn').addEventListener('click', () => {
                        Swal.close();
                        window.location.hash = '#/daily-checkin';
                    });
                }
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Logout?',
                text: "Anda yakin ingin keluar dari akun ini?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#5C3E94',
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("user_name");
                    localStorage.removeItem("customer_id");
                    window.location.hash = "#/login";
                    window.location.reload();
                }
            });
        });
    }

    try {
        const userPoints = await getUserPoints();
        if(balanceDisplay) {
            balanceDisplay.innerText = `${userPoints.balance.toLocaleString('id-ID')} Poin`;
        }
    } catch (e) {
        if(balanceDisplay) balanceDisplay.innerText = "0 Poin";
    }

    const allRewards = await getAllRewards();
    let filteredRewards = [...allRewards];
    
    const itemsPerPage = 10;
    let currentPage = 1;

    const container = document.getElementById("reward-list");
    const filterDropdown = document.getElementById("reward-filter");
    const paginationContainer = document.getElementById("pagination-container");

    const uniqueTypes = [...new Set(allRewards.map(item => item.reward_type))];
    uniqueTypes.forEach(type => {
        if(type) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            filterDropdown.appendChild(option);
        }
    });

    const renderList = () => {
        container.innerHTML = "";
        paginationContainer.innerHTML = "";

        if (filteredRewards.length === 0) {
            container.innerHTML = `<p class="text-center col-span-full text-gray-500 py-10">Tidak ada reward dengan kategori ini.</p>`;
            paginationContainer.classList.add("hidden");
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = filteredRewards.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredRewards.length / itemsPerPage);

        container.innerHTML = currentItems.map((item) => {
            const imgUrl = item.image_path || `https://via.placeholder.com/150x80/ffffff/000000?text=${item.reward_type || 'Reward'}`;
            const itemType = item.reward_type ? item.reward_type.toUpperCase() : 'SPECIAL';

            return `
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col group">
                <a href="#/reward-detail/${item.id}" class="block relative w-full h-40 overflow-hidden bg-gray-100 group-hover:opacity-95 transition">
                    <img 
                        src="${imgUrl}" 
                        alt="${item.name}" 
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=No+Image';"
                    >
                    <span class="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">
                        ${itemType}
                    </span>
                </a>

                <div class="p-5 flex-1 flex flex-col px-8">
                    <p class="text-black font-semibold text-base mb-1 line-clamp-2 min-h-[40px] leading-snug">${item.name}</p>
                    
                    <a href="#/reward-detail/${item.id}" class="mt-auto flex items-center justify-between cursor-pointer group/btn">
                        
                        <div class="flex items-center text-lg font-bold text-gray-900 group-hover/btn:text-purple-700 transition-colors duration-300">
                            <i class="fas fa-coins mr-2"></i> 
                            <span>${item.required_points} Poin</span>
                        </div>
                        
                        <div class="text-black group-hover/btn:text-purple-700 group-hover/btn:bg-purple-50 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300">
                            <i class="fa-solid fa-angles-right"></i>
                        </div>
                    </a>
                </div>
            </div>
            `;
        }).join("");

        if (totalPages > 1) {
            paginationContainer.classList.remove("hidden");
            renderPagination(totalPages);
        } else {
            paginationContainer.classList.add("hidden");
        }
    };

    const renderPagination = (totalPages) => {
        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = `<i class="fas fa-angles-left"></i>`;
        prevBtn.className = `w-10 h-10 rounded-full flex items-center justify-center border transition ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-purple-600 border-purple-600 hover:bg-purple-50'}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderList();
                document.getElementById("section-title")?.scrollIntoView({ behavior: "smooth" });
            }
        };
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.innerText = i;
            pageBtn.className = `w-10 h-10 rounded-full font-medium transition ${i === currentPage ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`;
            pageBtn.onclick = () => {
                currentPage = i;
                renderList();
                document.getElementById("section-title")?.scrollIntoView({ behavior: "smooth" });
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
                renderList();
                document.getElementById("section-title")?.scrollIntoView({ behavior: "smooth" });
            }
        };
        paginationContainer.appendChild(nextBtn);
    };

    filterDropdown.addEventListener("change", (e) => {
        const selectedType = e.target.value;
        if (selectedType === "all") {
            filteredRewards = [...allRewards];
        } else {
            filteredRewards = allRewards.filter(item => item.reward_type === selectedType);
        }
        currentPage = 1;
        renderList();
    });

    renderList();
  }
};

export default RewardPage;
