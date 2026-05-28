import "../styles/styles.css";
import Header from "./components/header.js";
import Footer from "./components/footer.js";
import App from "./pages/app.js";

const authRoutes = ['/login', '/register', '/otp', '/password-setup', '/complete-profile'];

const updateLayoutVisibility = () => {
  const currentPath = window.location.hash.slice(1) || '/';
  const cleanPath = currentPath.split('?')[0];

  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");

  if (authRoutes.includes(cleanPath)) {
    headerElement.style.display = 'none';
    footerElement.style.display = 'none';
  } else {
    headerElement.style.display = 'block';
    footerElement.style.display = 'block';
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("header").innerHTML = Header.render();
  Header.afterRender();
  document.querySelector("footer").innerHTML = Footer.render();

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  updateLayoutVisibility();
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    updateLayoutVisibility();
    await app.renderPage();
  });
});