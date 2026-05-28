import routes from '../routes/routes.js';
import { parseActivePathname } from '../routes/url-parser.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _setActiveNav() {
    const currentHash = window.location.hash || "#/";
    const navItems = this.#navigationDrawer.querySelectorAll("li");

    navItems.forEach((item) => {
      const link = item.querySelector("a");
      if (!link) return;

      if (link.getAttribute("href") === currentHash) {
        item.classList.add("bg-[#3B467B]");
      } else {
        item.classList.remove("bg-[#3B467B]");
      }
    });
  }

  async renderPage() {
    const url = parseActivePathname();
    const parsedUrl =
      (url.resource ? `/${url.resource}` : "/") +
      (url.id ? "/:id" : "") +
      (url.verb ? `/${url.verb}` : "");

    const userId = localStorage.getItem("user_id");
    const pendingUserId = localStorage.getItem("pending_user_id");

    const publicRoutes = [
      "/login",
      "/register",
      "/otp",
      "/password-setup",
      "/complete-profile"
    ];

    if (!userId && !pendingUserId && !publicRoutes.includes(parsedUrl)) {
      window.location.hash = "#/login";
      return;
    }

    if (pendingUserId && parsedUrl !== "/complete-profile") {
      window.location.hash = "#/complete-profile";
      return;
    }

    if (userId && publicRoutes.includes(parsedUrl)) {
      window.location.hash = "#/";
      return;
    }

    const page = routes[parsedUrl] || routes["/"];

    this.#content.innerHTML = await page.render();

    if (typeof page.afterRender === "function") {
      await page.afterRender();
    }

    this._setActiveNav();
  }
}

export default App;