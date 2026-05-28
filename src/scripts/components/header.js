import Swal from 'sweetalert2';
import { getUserNotifications, markNotificationsRead } from "../data/api.js";
import logo from "../../public/images/logo.png";

const Header = {
  render() {
    return `
      <div class="min-h-[90px] py-[20px] flex justify-between items-center gap-[30px] container relative">
        
        <a href="#/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="${logo}" alt="Nexus Logo" class="h-10 sm:h-12 w-auto object-contain" />
            <span class="text-white font-bold text-xl tracking-wide">Nexus</span>
        </a>

        <nav id="navigation-drawer" class="navigation-drawer z-40">
          <ul id="nav-list" class="nav-list flex flex-col sm:flex-row gap-2 sm:gap-1 w-full sm:w-auto">
            
            <li class="nav-item flex w-full sm:w-auto items-center justify-start sm:justify-center px-4 sm:px-6 rounded-lg text-[#fff] h-10 hover:bg-[#2C3253] transition duration-300 cursor-pointer">
              <i class="fa-solid fa-house text-white mr-2 text-lg sm:mr-0"></i>
              <a href="#/" class="nav-link w-full ml-1 lg:ml-2 block">Beranda</a>
            </li>

            <li class="nav-item flex w-full sm:w-auto items-center justify-start sm:justify-center px-4 sm:px-6 rounded-lg text-[#fff] h-10 hover:bg-[#2C3253] transition duration-150 cursor-pointer">
              <i class="fa-solid fa-cart-shopping text-white mr-2 text-lg sm:mr-0"></i>
              <a href="#/beli" class="nav-link w-full ml-1 lg:ml-2 block">Beli</a>
            </li>

            <li class="nav-item flex w-full sm:w-auto items-center justify-start sm:justify-center px-4 sm:px-6 rounded-lg text-[#fff] h-10 hover:bg-[#2C3253] transition duration-150 cursor-pointer">
              <i class="fa-solid fa-gift text-white mr-2 text-lg sm:mr-0"></i>
              <a href="#/reward" class="nav-link w-full ml-1 lg:ml-2 block">Reward</a>
            </li>
            
            <li class="nav-item flex w-full items-center justify-start px-4 rounded-lg text-[#fff] h-10 hover:bg-[#2C3253] transition duration-150 lg:hidden cursor-pointer">
              <i class="fa-solid fa-magnifying-glass text-white mr-2 text-lg"></i>
              <a href="#/search" class="nav-link w-full ml-1 block">Cari</a>
            </li>

            <li class="nav-item flex w-full items-center justify-start px-4 rounded-lg text-[#fff] h-10 hover:bg-[#2C3253] transition duration-150 lg:hidden cursor-pointer">
                <i class="fa-solid fa-user-gear text-white mr-2 text-lg"></i>
                <a href="#/simulation" class="nav-link w-full ml-1 block">Simulasi</a>
            </li>

            <li class="nav-item flex w-full items-center justify-start px-4 rounded-lg text-[#fff] h-10 hover:bg-[#2C3253] transition duration-150 lg:hidden cursor-pointer">
                <i class="fa-solid fa-arrow-right-from-bracket text-red-400 mr-2 text-lg"></i>
                <button id="sidebar-logout-btn" class="w-full text-left ml-1">Logout</button>
            </li>
            
          </ul>
        </nav>

        <div class="flex flex-row gap-4 items-center hidden lg:flex">
          
          <a href="#/search" class="text-white hover:text-purple-300 transition" title="Cari Paket">
            <i class="fa-solid fa-magnifying-glass text-xl"></i>
          </a>

          <div class="notification-wrapper relative">
            <button id="notification-btn" class="text-white hover:text-purple-300 transition flex items-center relative focus:outline-none">
              <i class="fa-regular fa-bell text-xl"></i>
              <span class="notification-badge absolute -top-1 -right-1 flex h-2.5 w-2.5 hidden">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </button>

            <div id="notification-dropdown" class="notification-dropdown hidden absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 transition-all">
                <div class="dropdown-header flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 class="font-bold text-gray-800">Notifikasi</h3>
                    <button class="text-xs text-purple-600 font-semibold hover:text-purple-800">Tandai sudah dibaca</button>
                </div>
                
                <div class="notification-list max-h-[350px] overflow-y-auto"></div>
                
                <div class="p-3 text-center border-t border-gray-100 bg-white">
                    <a href="#" class="text-xs font-bold text-gray-500 hover:text-purple-600">Lihat Semua</a>
                </div>
            </div>
          </div>

          <div class="relative">
            <button id="user-menu-btn" class="focus:outline-none flex items-center">
               <i class="fa-solid fa-circle-user text-white text-2xl"></i>
            </button>

            <div id="user-dropdown-menu" class="hidden absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-lg py-2 z-50 transition-all">
                <a href="#/simulation" class="block px-4 py-2 text-sm text-black hover:bg-purple-50 hover:text-purple-900 transition flex items-center gap-2">
                    <i class="fa-solid fa-user-gear text-gray-500"></i> Simulasi
                </a>
                <button id="header-logout-btn" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition flex items-center gap-2">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
                </button>
            </div>
          </div>

        </div>

        <button id="drawer-button" class="drawer-button text-white">
            <i class="fa-solid fa-bars text-white text-xl"></i>
        </button>
      </div>
    `;
  },

  afterRender() {
    const navItems = document.querySelectorAll('.nav-item');

    const updateActiveMenu = () => {
      const currentHash = window.location.hash || '#/';
      navItems.forEach(item => {
        const link = item.querySelector('a.nav-link');
        item.classList.remove('bg-[#2C3253]', 'font-bold');
        if (link && link.getAttribute('href') === currentHash) {
          item.classList.add('bg-[#2C3253]', 'font-bold');
        }
      });
    };

    updateActiveMenu();
    window.addEventListener('hashchange', updateActiveMenu);

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const link = item.querySelector('a.nav-link');
        if (link) window.location.hash = link.getAttribute('href');
      });
    });

    const userBtn = document.getElementById("user-menu-btn");
    const userDropdown = document.getElementById("user-dropdown-menu");
    const logoutBtnHeader = document.getElementById("header-logout-btn"); 
    const logoutBtnSidebar = document.getElementById("sidebar-logout-btn"); 
    
    const notifBtn = document.getElementById("notification-btn");
    const notifDropdown = document.getElementById("notification-dropdown");
    const notifList = notifDropdown ? notifDropdown.querySelector(".notification-list") : null;
    const badge = notifBtn ? notifBtn.querySelector(".notification-badge") : null;
    const markReadBtn = notifDropdown ? notifDropdown.querySelector("button.text-purple-600") : null;
    
    const handleLogout = (e) => {
      e.preventDefault();
      Swal.fire({
        title: 'Logout?',
        text: "Anda akan keluar dari sesi ini.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#5C3E94',
        confirmButtonText: 'Ya, Keluar',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          window.location.hash = "#/login";
          window.location.reload();
        }
      });
    };
    
    if (logoutBtnHeader) logoutBtnHeader.addEventListener("click", handleLogout);
    if (logoutBtnSidebar) logoutBtnSidebar.addEventListener("click", handleLogout);

    if (userBtn && userDropdown) {
      userBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("hidden");
        if (notifDropdown) notifDropdown.classList.add("hidden");
      });
    }

    const userId = localStorage.getItem("user_id");

    const renderNotifications = async () => {
      if (!userId || !notifList || !badge) return;

      try {
        const data = await getUserNotifications(userId);
        const notifications = data.notifications || [];
        const unreadCount = data.unread_count || 0;

        badge.classList.toggle("hidden", unreadCount === 0);

        if (notifications.length === 0) {
          notifList.innerHTML = `
            <div class="flex flex-col items-center justify-center py-8 text-gray-400">
              <i class="fa-regular fa-bell-slash text-2xl mb-2"></i>
              <p class="text-sm">Belum ada notifikasi</p>
            </div>`;
        } else {
          notifList.innerHTML = notifications.map(n => {
            const bgClass = n.is_read ? 'bg-white' : 'bg-purple-50/40';
            const iconColor = n.is_read ? 'bg-gray-100 text-gray-500' : 'bg-purple-100 text-purple-600';
            const icon = n.title.toLowerCase().includes('berhasil') ? 'fa-check' : 'fa-info';
            const dot = n.is_read ? '' : `<div class="w-2 h-2 rounded-full bg-red-500 absolute top-4 right-4"></div>`;
            const date = new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' });

            return `
              <div class="notif-item p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition flex gap-3 relative ${bgClass}">
                <div class="w-10 h-10 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0">
                  <i class="fa-solid ${icon}"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-800 mb-1">${n.title}</p>
                  <p class="text-xs text-gray-500 leading-relaxed">${n.message}</p>
                  <span class="text-[10px] text-gray-400 mt-2 block">${date}</span>
                </div>
                ${dot}
              </div>`;
          }).join("");
        }
      } catch (error) {
        console.error("Gagal memuat notifikasi:", error);
      }
    };

    renderNotifications();

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("hidden");
        if (userDropdown) userDropdown.classList.add("hidden");
      });

      if (markReadBtn) {
        markReadBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (!userId) return;
          await markNotificationsRead(userId);
          renderNotifications();
        });
      }

      document.addEventListener("click", (e) => {
        if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
          notifDropdown.classList.add("hidden");
        }
        if (userBtn && !userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.add("hidden");
        }
      });
    }
  }
};

export default Header;
