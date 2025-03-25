document.addEventListener("DOMContentLoaded", function () {
    const dobInput = document.getElementById("date_of_birth");
    const form = document.querySelector("form");
    const submitButton = document.querySelector("button[type='submit']");
  
    submitButton.addEventListener("click", function (event) {
      const dobValue = new Date(dobInput.value);
      const today = new Date();
      const age = today.getFullYear() - dobValue.getFullYear();
      const monthDiff = today.getMonth() - dobValue.getMonth();
  
      // Adjust age if birth month and day are ahead in the current year
      if (monthDiff < 0
        //  || (monthDiff === 0 && today.getDate() < dobValue.getDate())
        ) {
        age--;
      }
  
      if (age < 18) {
        event.preventDefault(); // Prevent form submission
        alert("You must be at least 18 years old to sign up.");
        dobInput.focus();
      }
    });
  });