document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://aras-startrit-server.onrender.com/user";
  const requestBody = { email: sessionStorage.getItem("email") };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Raw Response:", response);

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    }

    const user = await response.json();
    console.log("Fetched User Data:", user);
    // console.log("Full Response Object:", response);
    console.log(user.mobile_number);
    console.log(user.email);
    console.log(user.location);
    console.log(user.driving_license_number);

    const dateObj = user.date_of_birth.split("T")[0];

    // Update profile elements
    document.querySelector("h2").textContent = `${user.first_name} ${user.last_name}`;
    document.getElementById("mobile").textContent = user.mobile_number;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("driving_license_number").textContent = user.driving_license_number;
    document.getElementById("userDOB").textContent = dateObj;
    document.getElementById("userLocation").textContent = user.location;

  } catch (error) {
    console.error("Error loading user data:", error);
  }
});
