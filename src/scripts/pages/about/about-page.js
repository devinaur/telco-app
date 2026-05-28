export default class AboutPage {
  async render() {
    return `
      <div class="container mx-auto px-6 py-12 text-center min-h-[60vh] flex flex-col justify-center">
        <h1 class="text-4xl font-bold text-[#1F2544] mb-4">Tentang Nexus</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Nexus adalah penyedia layanan telekomunikasi digital terdepan yang berkomitmen menghubungkan Indonesia dengan jaringan cepat, stabil, dan terjangkau.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-8 bg-purple-50 rounded-3xl border border-purple-100 hover:shadow-lg transition">
                <i class="fa-solid fa-rocket text-4xl text-[#5C3E94] mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Inovasi</h3>
                <p class="text-gray-600 text-sm">Selalu menghadirkan teknologi terbaru untuk pengalaman internet terbaik Anda.</p>
            </div>
            <div class="p-8 bg-purple-50 rounded-3xl border border-purple-100 hover:shadow-lg transition">
                <i class="fa-solid fa-users text-4xl text-[#5C3E94] mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Pelanggan Prioritas</h3>
                <p class="text-gray-600 text-sm">Layanan pelanggan 24/7 yang ramah dan siap membantu kapan saja.</p>
            </div>
            <div class="p-8 bg-purple-50 rounded-3xl border border-purple-100 hover:shadow-lg transition">
                <i class="fa-solid fa-globe text-4xl text-[#5C3E94] mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Jangkauan Luas</h3>
                <p class="text-gray-600 text-sm">Sinyal kuat dan stabil yang menjangkau hingga ke pelosok negeri.</p>
            </div>
        </div>

        <div class="mt-12 text-gray-500 text-sm">
            <p>Versi Aplikasi: 1.0.0 (Beta)</p>
            <p>&copy; 2025 Nexus Telco. Dibuat dengan sepenuh hati.</p>
        </div>
      </div>
    `;
  }

  async afterRender() {
  }
}