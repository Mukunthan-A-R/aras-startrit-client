// Wait for the DOM content to be fully loaded before adding event listener
document.addEventListener("DOMContentLoaded", function () {
  // Get the login form
  const loginForm = document.querySelector("form");

  // Add an event listener for form submission
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get email and password values from the form
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // Simple validation to check if email and password are filled
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    // Show loading state on login button
    const loginButton = document.querySelector('button[type="submit"]');
    loginButton.disabled = true;
    loginButton.innerHTML = "Logging in...";

    // Prepare data to send to the server
    const loginData = {
      email: email,
      password: password,
    };

    try {
      // Send POST request to the login endpoint
      const response = await fetch(
        "https://aras-startrit-server.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Login failed, please try again.");
      }

      // Parse the JSON response
      const responseData = await response.json();

      // Check if the response contains the token
      if (responseData.token) {
        // Store the token in localStorage
        localStorage.setItem("local-auth-token", responseData.token);
        localStorage.setItem("email", email);
        console.log("Auth token stored in localStorage:", responseData.token); // Log token to console
        console.log(
          "Auth token stored in localStorage:",
          localStorage.getItem("email")
        ); // Log token to console

        // Optionally, you can redirect to another page after successful login
        // window.location.href = 'dashboard.html'; // Uncomment to redirect to a dashboard or another page

        // Show a success message or perform any other actions after login
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert("Login failed: No token received");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      alert("Login failed: " + error.message);
    } finally {
      // Re-enable the login button and restore its text after the request finishes
      loginButton.disabled = false;
      loginButton.innerHTML = "Login";
    }
  });
});
