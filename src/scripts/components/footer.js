import logo from "../../public/images/logo.png";

const Footer = {
  render() {
    return `
      <div class="container mx-auto px-6 md:px-12 py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          <div class="space-y-4 text-center md:text-left">
            <a href="#/" class="flex items-center justify-center md:justify-start gap-3 group">
                <img src="${logo}" alt="Nexus Logo" class="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity" />
                <span class="text-2xl font-bold text-white tracking-wide">Nexus</span>
            </a>
            <p class="text-gray-400 text-sm leading-relaxed">
              Solusi internet cepat, hemat, dan fleksibel untuk mendukung gaya hidup digitalmu tanpa batas.
            </p>
            <div class="flex justify-center md:justify-start gap-4 pt-2">
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-500 transition duration-300">
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-500 transition duration-300">
                <i class="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-500 transition duration-300">
                <i class="fa-brands fa-twitter"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-500 transition duration-300">
                <i class="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>

          <div class="text-center md:text-left">
            <h3 class="text-white font-bold text-lg mb-4">Akses Cepat</h3>
            <ul class="space-y-3">
              <li><a href="#/" class="text-gray-400 hover:text-purple-400 transition text-sm">Beranda</a></li>
              <li><a href="#/beli" class="text-gray-400 hover:text-purple-400 transition text-sm">Beli Paket</a></li>
              <li><a href="#/reward" class="text-gray-400 hover:text-purple-400 transition text-sm">Tukar Poin</a></li>
              <li><a href="#/topup" class="text-gray-400 hover:text-purple-400 transition text-sm">Isi Saldo</a></li>
            </ul>
          </div>

          <div class="text-center md:text-left">
            <h3 class="text-white font-bold text-lg mb-4">Dukungan</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-400 hover:text-purple-400 transition text-sm">Pusat Bantuan</a></li>
              <li><a href="#" class="text-gray-400 hover:text-purple-400 transition text-sm">Syarat & Ketentuan</a></li>
              <li><a href="#" class="text-gray-400 hover:text-purple-400 transition text-sm">Kebijakan Privasi</a></li>
              <li><a href="#" class="text-gray-400 hover:text-purple-400 transition text-sm">Lokasi Gerai</a></li>
            </ul>
          </div>

          <div class="text-center md:text-left">
            <h3 class="text-white font-bold text-lg mb-4">Hubungi Kami</h3>
            <ul class="space-y-4">
              <li class="flex items-start justify-center md:justify-start gap-3 text-gray-400 text-sm">
                <i class="fa-solid fa-location-dot mt-1 text-purple-500"></i>
                <span>Jl. Telekomunikasi No. 1, Bandung, Indonesia</span>
              </li>
              <li class="flex items-center justify-center md:justify-start gap-3 text-gray-400 text-sm">
                <i class="fa-solid fa-phone text-purple-500"></i>
                <span>+62 21 555 0123</span>
              </li>
              <li class="flex items-center justify-center md:justify-start gap-3 text-gray-400 text-sm">
                <i class="fa-solid fa-envelope text-purple-500"></i>
                <span>support@nexus.id</span>
              </li>
            </ul>
          </div>

        </div>

        <div class="border-t border-gray-700 pt-8 flex flex-col items-center gap-4">
          <p class="text-gray-500 text-sm text-center">
            &copy; 2025 Nexus. Hak Cipta Dilindungi.
          </p>
          <div class="flex gap-6">
            <a href="#" class="text-gray-500 hover:text-white text-sm transition">Privasi</a>
            <a href="#" class="text-gray-500 hover:text-white text-sm transition">Syarat & Ketentuan</a>
            <a href="#" class="text-gray-500 hover:text-white text-sm transition">Cookie</a>
          </div>
        </div>
        
      </div>
    `;
  },
};

export default Footer;