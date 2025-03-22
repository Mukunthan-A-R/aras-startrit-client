// Function to check if the user is logged in by verifying the presence of token in localStorage
function isUserLoggedIn() {
  // Check if the 'local-auth-token' is stored in localStorage
  const token = localStorage.getItem("local-auth-token");

  // Return true if token exists, otherwise false
  return token !== null;
}

// Example usage: log the result to the console
if (isUserLoggedIn()) {
  console.log("User is logged in");
} else {
  console.log("User is not logged in");
  window.location.href = "login.html";
}

// logout token
function logout() {
  // Remove the token from localStorage
  localStorage.removeItem("local-auth-token");

  // Redirect the user to the login page (or another page)
  window.location.href = "login.html"; // You can change this to another page if needed
}
