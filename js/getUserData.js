// Function to display the stored email from localStorage
function displayEmail() {
  // Retrieve email from localStorage
  const email = localStorage.getItem("email");

  // Check if email exists in localStorage
  if (email) {
    // Display the email in the webpage
    document.getElementById("user-email").textContent = email;
  } else {
    // If no email is found, display a default message
    document.getElementById("user-email").textContent = "No email available";
  }
}

displayEmail();

// Call the displayEmail function when the page loads
window.onload = displayEmail;
