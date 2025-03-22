// dashboard.js - Handles checking login and redirecting if not logged in
window.onload = function () {
  if (!isUserLoggedIn()) {
    // If no token found, redirect to home page
    window.location.href = "index.html"; // or any page you want to redirect to
  }
};
