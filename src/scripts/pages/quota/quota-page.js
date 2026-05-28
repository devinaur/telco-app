import { getUserActiveQuotas } from "../../data/api.js";

const QuotaPage = {
  async render() {
    return `
      <div class="container pb-12">
        <div class="flex items-center mt-6 mb-8">
            <a href="#/" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#5C3E94] hover:text-white transition shadow-sm mr-4">
                <i class="fa-solid fa-arrow-left"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-[#1F2544]">Paket Aktif Saya</h1>
                <p class="text-gray-500 text-sm">Kelola dan pantau penggunaan kuota Anda</p>
            </div>
        </div>

        <div id="quota-list" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-full py-12 flex justify-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5C3E94]"></div>
            </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const userId = localStorage.getItem("user_id");
    const container = document.getElementById("quota-list");

    try {
        const quotas = await getUserActiveQuotas(userId);

        if (quotas.length === 0) {
            container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div class="w-20 h-20 bg-[#F3F0FF] rounded-full flex items-center justify-center mb-4">
                        <i class="fa-solid fa-box-open text-3xl text-[#5C3E94]"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-700">Tidak Ada Paket Aktif</h3>
                    <p class="text-gray-500 mb-6">Anda belum berlangganan paket internet apapun.</p>
                    <a href="#/beli" class="bg-[#5C3E94] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4a327a] transition shadow-lg hover:shadow-xl">
                        Beli Paket Sekarang
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = quotas.map(q => {
            const startDate = new Date(q.created_at).getTime();
            const expireDate = new Date(q.expires_at).getTime();
            const now = new Date().getTime();

            const totalDuration = expireDate - startDate;
            const timeRemaining = expireDate - now;

            let percentage = 0;
            if (totalDuration > 0) {
                percentage = (timeRemaining / totalDuration) * 100;
            }
            percentage = Math.max(0, Math.min(100, percentage));

            let barColor = "bg-[#5C3E94]";
            let statusTextColor = "text-gray-500";
            let statusIcon = "fa-circle-check";

            if (percentage < 25) {
                barColor = "bg-red-500";
                statusTextColor = "text-red-600 font-bold";
                statusIcon = "fa-circle-exclamation";
            } else if (percentage < 50) {
                barColor = "bg-yellow-500";
            }

            const daysLeft = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
            const daysText = daysLeft > 0 ? `${daysLeft} Hari Lagi` : "Berakhir Hari Ini";

            return `
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:shadow-lg transition group">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-[#F3F0FF] flex items-center justify-center text-[#5C3E94] text-xl">
                            <i class="fa-solid fa-wifi"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-gray-800 leading-tight group-hover:text-[#5C3E94] transition">${q.product_name}</h3>
                            <span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded tracking-wide">
                                ${q.type || 'DATA'}
                            </span>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-extrabold text-[#5C3E94]">${q.quota}</p>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between text-xs font-medium text-gray-500">
                        <span>Masa Aktif</span>
                        <span>${parseInt(percentage)}%</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div class="${barColor} h-full rounded-full transition-all duration-1000 shadow-sm relative" style="width: ${percentage}%">
                            <div class="absolute top-0 right-0 bottom-0 w-1 bg-white/30"></div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center text-xs mt-4 pt-4 border-t border-gray-100">
                    <p class="text-gray-400 flex items-center gap-1">
                        <i class="fa-regular fa-calendar"></i> 
                        Exp: ${new Date(q.expires_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </p>
                    <p class="${statusTextColor} flex items-center gap-1">
                        <i class="fa-solid ${statusIcon}"></i> ${daysText}
                    </p>
                </div>
            </div>
            `;
        }).join("");

    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="col-span-full py-12 text-center">
                <div class="text-red-500 mb-2"><i class="fa-solid fa-triangle-exclamation text-3xl"></i></div>
                <p class="text-gray-600">Gagal memuat data kuota. Silakan coba lagi.</p>
            </div>
        `;
    }
  }
};

export default QuotaPage;