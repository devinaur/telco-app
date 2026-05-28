import Swal from 'sweetalert2';
import { simulateUserProfileUpdate, API_BASE_URL } from "../../data/api.js";

export default class SimulationPage {
  async render() {
    return `
      <section class="container h-auto pb-20 pt-10 flex flex-col gap-8">

        <h1 class="text-3xl font-bold text-[#2C3253]">Simulasi Penggunaan</h1>
        <p class="text-gray-600">
          Halaman ini digunakan untuk memanipulasi data perilaku user secara manual guna menguji respons model Machine Learning.
        </p>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-[#2C3253] mb-4">A. Simulasi Bertahap</h2>
          <p class="text-sm text-gray-500 mb-4">Klik tombol untuk menambah nilai sedikit demi sedikit.</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <button id="btn-data-usage" class="px-4 py-3 bg-white text-[#2C3253] font-semibold rounded-xl hover:bg-[#2C3253] hover:text-white transition border border-gray-200 shadow-sm">
              <i class="fa-solid fa-wifi mr-2"></i>Data (+0.5 GB)
            </button>

            <button id="btn-video-usage" class="px-4 py-3 bg-white text-[#2C3253] font-semibold rounded-xl hover:bg-[#2C3253] hover:text-white transition border border-gray-200 shadow-sm">
              <i class="fa-solid fa-play mr-2"></i>Video (+5%)
            </button>

            <button id="btn-call-duration" class="px-4 py-3 bg-white text-[#2C3253] font-semibold rounded-xl hover:bg-[#2C3253] hover:text-white transition border border-gray-200 shadow-sm">
              <i class="fa-solid fa-phone mr-2"></i>Call (+1 m)
            </button>

            <button id="btn-sms-freq" class="px-4 py-3 bg-white text-[#2C3253] font-semibold rounded-xl hover:bg-[#2C3253] hover:text-white transition border border-gray-200 shadow-sm">
              <i class="fa-solid fa-comment mr-2"></i>SMS (+1)
            </button>

            <button id="btn-travel-score" class="px-4 py-3 bg-white text-[#2C3253] font-semibold rounded-xl hover:bg-[#2C3253] hover:text-white transition border border-gray-200 shadow-sm">
              <i class="fa-solid fa-plane mr-2"></i>Travel (+0.05)
            </button>
          </div>
        </div>

        <div id="sim-result" class="p-4 rounded-xl bg-white border border-gray-200 text-sm font-mono text-gray-700 min-h-[60px] flex items-center shadow-sm">
            <span class="text-gray-400">Hasil respon server akan muncul di sini...</span>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-[#2C3253] mb-2">B. Simulasi Target Offer (Skenario)</h2>
            <p class="text-sm text-gray-500 mb-6">Ubah drastis profil user untuk mencocokkan kriteria penawaran tertentu.</p>
            
            <div id="target-offer-buttons" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            </div>
        </div>

      </section>
    `;
  }

  async afterRender() {
    const resultBox = document.getElementById("sim-result");
    const user_id = localStorage.getItem("user_id");

    const targetOffers = [
        {
            "label": "Roaming Pass",
            "icon": "fa-plane-departure",
            "data": {
                "plan_type": "Postpaid",
                "device_brand": "Apple",
                "avg_data_usage_gb": 3.0,
                "pct_video_usage": 0.1,
                "avg_call_duration": 5.0,
                "sms_freq": 10,
                "monthly_spend": 200000,
                "topup_freq": 0,
                "travel_score": 0.99,
                "complaint_count": 0
            }
        },
        {
            "label": "Data Booster",
            "icon": "fa-bolt",
            "data": {
                "plan_type": "Prepaid",
                "device_brand": "Xiaomi",
                "avg_data_usage_gb": 120.0,
                "pct_video_usage": 0.70,
                "avg_call_duration": 2.0,
                "sms_freq": 1,
                "monthly_spend": 120000,
                "topup_freq": 12,
                "travel_score": 0.0,
                "complaint_count": 0
            }
        },
        {
            "label": "Streaming Partner Pack",
            "icon": "fa-music",
            "data": {
                "plan_type": "Prepaid",
                "device_brand": "Samsung",
                "avg_data_usage_gb": 6.5,
                "pct_video_usage": 0.75,
                "avg_call_duration": 5.0,
                "sms_freq": 15,
                "monthly_spend": 105000,
                "topup_freq": 3,
                "travel_score": 0.3,
                "complaint_count": 0
            }
        },
        {
            "label": "Voice Bundle",
            "icon": "fa-phone-volume",
            "data": {
                "plan_type": "Prepaid",
                "device_brand": "Oppo",
                "avg_data_usage_gb": 0.0,
                "pct_video_usage": 0.0,
                "avg_call_duration": 120.0,
                "sms_freq": 5,
                "monthly_spend": 40000,
                "topup_freq": 2,
                "travel_score": 0.0,
                "complaint_count": 0
            }
        },
        {
            "label": "Retention Offer",
            "icon": "fa-hand-holding-heart",
            "data": {
                "plan_type": "Postpaid",
                "device_brand": "Vivo",
                "avg_data_usage_gb": 5.0,
                "pct_video_usage": 0.4,
                "avg_call_duration": 5.0,
                "sms_freq": 10,
                "monthly_spend": 100000,
                "topup_freq": 0,
                "travel_score": 0.2,
                "complaint_count": 10
            }
        },
        {
            "label": "Device Upgrade Offer",
            "icon": "fa-mobile-screen-button",
            "data": {
                "plan_type": "Postpaid",
                "device_brand": "Samsung",
                "avg_data_usage_gb": 15.0,
                "pct_video_usage": 0.3,
                "avg_call_duration": 20.0,
                "sms_freq": 10,
                "monthly_spend": 950000,
                "topup_freq": 0,
                "travel_score": 0.0,
                "complaint_count": 0
            }
        },
        {
            "label": "Family Plan Offer",
            "icon": "fa-people-roof",
            "data": {
                "plan_type": "Postpaid",
                "device_brand": "Apple",
                "avg_data_usage_gb": 10.0,
                "pct_video_usage": 0.2,
                "avg_call_duration": 10.0,
                "sms_freq": 150,
                "monthly_spend": 250000,
                "topup_freq": 0,
                "travel_score": 0.0,
                "complaint_count": 0
            }
        },
        {
            "label": "Top-up Promo",
            "icon": "fa-wallet",
            "data": {
                "plan_type": "Prepaid",
                "device_brand": "Realme",
                "avg_data_usage_gb": 1.0,
                "pct_video_usage": 0.1,
                "avg_call_duration": 2.0,
                "sms_freq": 5,
                "monthly_spend": 30000,
                "topup_freq": 20,
                "travel_score": 0.0,
                "complaint_count": 0
            }
        },
        {
            "label": "General Offer",
            "icon": "fa-layer-group",
            "data": {
                "plan_type": "Prepaid",
                "device_brand": "Samsung",
                "avg_data_usage_gb": 2.0,
                "pct_video_usage": 0.3,
                "avg_call_duration": 3.0,
                "sms_freq": 5,
                "monthly_spend": 50000,
                "topup_freq": 1,
                "travel_score": 0.0,
                "complaint_count": 0
            }
        }
    ];

    if (!user_id) {
      resultBox.innerText = "❌ Kamu belum login.";
      Swal.fire('Peringatan', 'Anda harus login untuk menggunakan simulasi.', 'warning').then(() => {
        window.location.hash = "#/login";
      });
      return;
    }

    const handleTargetOfferClick = async (offer) => {
        resultBox.innerHTML = `<div class="flex items-center gap-2 text-[#2C3253]"><i class="fas fa-spinner fa-spin"></i> <span>Mengubah profil menjadi "${offer.label}"...</span></div>`;
        
        try {
            const result = await simulateUserProfileUpdate(user_id, offer.data);
            
            if (result.error) {
                throw new Error(result.error);
            }

            Swal.fire({
                icon: 'success',
                title: 'Profil Diperbarui!',
                html: `Target baru: <b>${result.new_recommendation || 'N/A'}</b><br>Silakan cek halaman Beranda.`,
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });

            resultBox.innerHTML = `<div class="text-green-700"><i class="fas fa-check-circle"></i> <b>Sukses!</b> Prediksi Baru: <span class="bg-green-100 px-2 py-1 rounded text-green-800 font-bold">${result.new_recommendation}</span></div>`;

        } catch (error) {
            console.error("Simulation Error:", error);
            Swal.fire("Gagal", error.message, "error");
            resultBox.innerHTML = `<div class="text-red-600"><i class="fas fa-times-circle"></i> Error: ${error.message}</div>`;
        }
    };

    const container = document.getElementById("target-offer-buttons");
    container.innerHTML = "";
    
    targetOffers.forEach(offer => {
        const btn = document.createElement("button");
        btn.className = `flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl transition-all duration-200 group hover:bg-[#2C3253] hover:text-white hover:border-[#2C3253] hover:shadow-lg`;
        
        btn.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-slate-50 text-[#2C3253] flex items-center justify-center mb-2 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                <i class="fa-solid ${offer.icon} text-lg"></i>
            </div>
            <span class="font-bold text-sm text-center">${offer.label}</span>
            <span class="text-[10px] text-gray-400 mt-1 group-hover:text-white/80">Klik untuk simulasi</span>
        `;
        
        btn.onclick = () => handleTargetOfferClick(offer);
        container.appendChild(btn);
    });

    async function sendIncremental(endpoint) {
      resultBox.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menambah nilai...';
      try {
        const res = await fetch(`${API_BASE_URL}/api/simulation/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-User-ID": user_id },
          body: JSON.stringify({ user_id })
        });
        const data = await res.json();
        
        if(data.error) throw new Error(data.error);

        resultBox.innerHTML = `<div class="text-[#2C3253]"><i class="fas fa-info-circle"></i> Update Berhasil. Prediksi saat ini: <b>${data.new_recommendation || '-'}</b></div>`;
        
      } catch (e) {
        resultBox.innerText = "❌ Error: " + e.message;
      }
    }

    document.getElementById("btn-data-usage").addEventListener("click", () => sendIncremental("increase-data"));
    document.getElementById("btn-video-usage").addEventListener("click", () => sendIncremental("increase-video"));
    document.getElementById("btn-call-duration").addEventListener("click", () => sendIncremental("increase-call"));
    document.getElementById("btn-sms-freq").addEventListener("click", () => sendIncremental("increase-sms"));
    document.getElementById("btn-travel-score").addEventListener("click", () => sendIncremental("increase-travel"));
  }
}