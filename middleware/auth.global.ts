export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return;

  const isVerified = localStorage.getItem("pinVerified");
  const publicPages = ["/opener", "/lock"];

  // Jika belum verifikasi PIN → hanya boleh masuk ke opener & lock
  if (!isVerified) {
    if (!publicPages.includes(to.path)) {
      return navigateTo("/opener");
    }
  }

  // Jika sudah verifikasi PIN → tidak boleh masuk opener/lock lagi
  if (isVerified) {
    if (publicPages.includes(to.path)) {
      return navigateTo("/");
    }
  }
});
