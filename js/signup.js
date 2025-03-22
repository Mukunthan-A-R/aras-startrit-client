// signup.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect data from the form
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const dateOfBirth = document.getElementById("date_of_birth").value;
    const email = document.getElementById("email").value;
    const mobileNumber = document.getElementById("mobile_number").value;
    const drivingLicenseNumber = document.getElementById(
      "driving_license_number"
    ).value;
    const location = document.getElementById("location").value;
    const password = document.getElementById("password").value;

    // Prepare the data as JSON
    const userData = {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      email: email,
      mobile_number: mobileNumber,
      driving_license_number: drivingLicenseNumber,
      location: location,
      password: password,
    };

    // Send data to the server
    try {
      const response = await fetch(
        "https://aras-startrit-server.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        // Handle successful registration (response from the server)
        alert("Registration successful!");
        window.location.href = "login.html"; // Redirect to login page
      } else {
        // Handle error response
        const errorData = await response.json();
        alert(
          `Error: ${
            errorData.message || "Something went wrong. Please try again."
          }`
        );
      }
    } catch (error) {
      // Handle any network errors
      console.error("Error:", error);
      alert(
        "An error occurred while submitting your registration. Please try again."
      );
    }
  });
});
