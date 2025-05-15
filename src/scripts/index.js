import "../styles/styles.css";
import App from "./pages/app";
import AuthUtils from "./utils/auth-utils";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
    navList: document.querySelector("#nav-list"),
  });

  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.querySelector("#main-content");

  mainContent.setAttribute("tabindex", "-1");

  skipLink.addEventListener("click", (event) => {
    event.preventDefault();
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: "smooth" });
  });

  // Redirect ke login jika belum login
  if (
    !AuthUtils.isLoggedIn() &&
    window.location.hash !== "#/login" &&
    window.location.hash !== "#/register"
  ) {
    window.location.hash = "#/login";
  }

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});

/**
 * ✅ PWA: Registrasi Service Worker
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker terdaftar:", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Gagal registrasi Service Worker:", error);
      });
  });
}

/**
 * ✅ PWA: Menyimpan install prompt (jika ingin kamu tampilkan manual)
 */
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // Cegah prompt default
  deferredPrompt = e;
  console.log("📲 Aplikasi bisa diinstal");

  // Jika ingin tampilkan tombol install manual, kamu bisa akses `deferredPrompt.prompt()` nanti
});
