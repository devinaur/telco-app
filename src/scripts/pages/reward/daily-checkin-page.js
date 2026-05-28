import Swal from "sweetalert2";
import { getDailyCheckInStatus, claimDailyCheckIn } from "../../data/api.js";

const DailyCheckInPage = {
  async render() {
    return `
      <div class="container mx-auto p-4 md:p-8 min-h-screen">
        <a href="#/reward" class="flex items-center text-purple-600 mb-6 hover:underline font-bold">
            <i class="fa-solid fa-arrow-left mr-2"></i> Kembali ke Reward
        </a>

        <div class="bg-gradient-to-br from-[#5C3E94] to-[#3B2A66] rounded-3xl p-8 text-white shadow-xl text-center relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h1 class="text-3xl font-bold mb-2 relative z-10">Daily Check-In</h1>
            <p class="text-purple-200 mb-8 relative z-10">Kumpulkan poin gratis setiap hari selama 7 hari!</p>

            <div id="checkin-grid" class="grid grid-cols-4 md:grid-cols-7 gap-4 relative z-10 justify-items-center">
                <div class="col-span-full py-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>
            </div>

            <button id="claim-btn" class="mt-8 bg-[#FFC436] text-[#1F2544] font-bold py-3 px-12 rounded-full shadow-lg hover:bg-yellow-400 transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed hidden">
                Klaim Sekarang
            </button>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const grid = document.getElementById("checkin-grid");
    const claimBtn = document.getElementById("claim-btn");

    try {
        const status = await getDailyCheckInStatus();
        
        if (status.error) throw new Error(status.error);

        const activeDay = status.claimed_today ? status.streak : status.streak + 1; 
        
        grid.innerHTML = status.points_map.map((points, index) => {
            const day = index + 1;
            let bgClass = "bg-white/10 border-white/20";
            let icon = `<span class="text-lg font-bold text-white">+${points}</span>`;
            
            let statusText = "Akan Datang";
            let opacity = "opacity-60";

            if (day < activeDay) {
                bgClass = "bg-green-500 border-green-400 shadow-green-500/50";
                icon = `<i class="fa-solid fa-check text-2xl text-white"></i>`;
                statusText = "Selesai";
                opacity = "opacity-100";
            } else if (day === activeDay) {
                if (status.claimed_today) {
                     bgClass = "bg-green-500 border-green-400 shadow-green-500/50";
                     icon = `<i class="fa-solid fa-check text-2xl text-white"></i>`;
                     statusText = "Selesai";
                } else {
                     bgClass = "bg-[#FFC436] border-yellow-300 shadow-yellow-500/50 scale-110";
                     icon = `<i class="fa-solid fa-gift text-2xl text-[#1F2544] animate-bounce"></i>`;
                     statusText = "Hari Ini";
                }
                opacity = "opacity-100";
            }

            return `
                <div class="flex flex-col items-center gap-2 ${opacity} transition-all duration-500">
                    <div class="w-20 h-24 md:w-24 md:h-32 rounded-2xl border-2 ${bgClass} flex flex-col items-center justify-center shadow-lg relative">
                        <p class="text-xs font-bold text-white/80 mb-2 uppercase">Hari ${day}</p>
                        ${icon}
                        ${day === 7 ? '<div class="absolute -top-2 -right-2 text-yellow-300 text-xl"><i class="fa-solid fa-crown"></i></div>' : ''}
                    </div>
                    <p class="text-xs font-medium text-white/70">${statusText}</p>
                </div>
            `;
        }).join("");

        claimBtn.classList.remove("hidden");
        if (status.claimed_today) {
            claimBtn.textContent = "Sudah Klaim Hari Ini";
            claimBtn.disabled = true;
            claimBtn.classList.add("bg-gray-400", "text-gray-700");
            claimBtn.classList.remove("bg-[#FFC436]", "text-[#1F2544]");
        } else {
            claimBtn.addEventListener("click", async () => {
                claimBtn.disabled = true;
                claimBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Proses...';
                
                try {
                    const result = await claimDailyCheckIn();
                    if (result.success) {
                        await Swal.fire({
                            title: 'Selamat!',
                            text: result.message,
                            icon: 'success',
                            confirmButtonColor: '#5C3E94'
                        });
                        this.afterRender();
                    } else {
                        Swal.fire("Gagal", result.message, "error");
                        claimBtn.disabled = false;
                        claimBtn.textContent = "Klaim Sekarang";
                    }
                } catch (e) {
                    Swal.fire("Error", "Gagal menghubungi server", "error");
                    claimBtn.disabled = false;
                    claimBtn.textContent = "Klaim Sekarang";
                }
            });
        }

    } catch (e) {
        console.error(e);
        grid.innerHTML = `<p class="text-white col-span-full">Gagal memuat data.</p>`;
    }
  }
};

export default DailyCheckInPage;