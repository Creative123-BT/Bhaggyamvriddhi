      let sessionId = "";
      const sendOtpBtn = document.getElementById("sendOtpBtn");
      const otpInput = document.getElementById("otpInput");
      const phoneInput = document.getElementById("phone");
      const sqftSelect = document.getElementById("sqft");
      const submitBtn = document.getElementById("submitBtn");

      sendOtpBtn.addEventListener("click", () => {
        const phone = phoneInput.value.trim();
  if (!/^\d{10}$/.test(phone)) {
  alert("Enter a valid 10-digit phone number.");
  return;
}


        const apiKey = "4f215f3a-3f9c-11f0-a562-0200cd936042";
        fetch(`https://2factor.in/API/V1/${apiKey}/SMS/${phone}/AUTOGEN/OTP1`)
          .then((res) => res.json())
          .then((data) => {
            if (data.Status === "Success") {
              sessionId = data.Details;
              alert("OTP sent to " + phone);
              otpInput.style.display = "block";
              otpInput.focus();
            } else {
              alert("OTP sending failed.");
            }
          })
          .catch(() => alert("Network error. Please try again."));
      });

      // Auto-verify OTP after input
      otpInput.addEventListener("input", () => {
        const code = otpInput.value.trim();

        // If user enters more than 6 characters, trim it
        if (code.length > 6) {
          otpInput.value = code.slice(0, 6);
          return;
        }

        // Wait for exactly 6 digits before verifying
        if (code.length === 6) {
          const apiKey = "4f215f3a-3f9c-11f0-a562-0200cd936042";
          fetch(
            `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${code}`
          )
            .then((res) => res.json())
            .then((data) => {
              console.log("OTP verification response:", data);

              if (data.Status === "Success") {
                alert("Phone verified!");
                sqftSelect.style.display = "block";
                submitBtn.style.display = "block";
                submitBtn.disabled = false;
              } else {
                alert("Invalid OTP. Please try again.");
                otpInput.value = ""; // Clear input on failure
              }
            })
            .catch((err) => {
              console.error("OTP Verification error:", err);
              alert("Error verifying OTP. Please try again.");
            });
        }
      });
      otpInput.addEventListener("paste", (e) => {
        const pasted = e.clipboardData.getData("text").trim();
        if (pasted.length === 6 && /^\d{6}$/.test(pasted)) {
          otpInput.value = pasted;
          otpInput.dispatchEvent(new Event("input"));
        } else {
          alert("Please paste a valid 6-digit OTP.");
          e.preventDefault();
        }
      });


document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById('customDropdown');
  const toggle = document.getElementById('selectedCode');
  const menu = document.getElementById('dropdownOptions');
  const options = menu.querySelectorAll('li');

  const customInputWrapper = document.getElementById('customInputWrapper');
  const customInput = document.getElementById('customCountryCode');
  const backToDropdown = document.getElementById('backToDropdown');

  let selectedValue = "+91";

  // Toggle dropdown
  toggle.addEventListener('click', () => {
    menu.classList.toggle('show-menu');
  });

  // Handle selection
  options.forEach(option => {
    option.addEventListener('click', () => {
      selectedValue = option.dataset.value;
      toggle.innerText = option.innerText;

      if (selectedValue === "custom") {
        dropdown.style.display = "none";
        customInputWrapper.style.display = "block";
        customInput.required = true;
        customInput.focus();
      }

      menu.classList.remove('show-menu');
    });
  });

  // Back to dropdown from custom input
  backToDropdown.addEventListener('click', () => {
    customInputWrapper.style.display = "none";
    dropdown.style.display = "block";
    customInput.required = false;
    customInput.value = "+";
    selectedValue = ""; // reset selection
    toggle.innerText = "code";
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      menu.classList.remove('show-menu');
    }
  });


    document.getElementById("leadform").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value.trim();
    const phoneNumber = document.getElementById("phone").value;
    const email = document.getElementById("email").value.trim();
    const sqft = document.getElementById("sqft").value;
    const url = new URL(window.location.href);
    const paths = url.pathname.split('/').filter(Boolean);
    const lastSegment = paths[paths.length - 1];

console.log(lastSegment); // logs "1"

    let finalCountryCode =
      customDropdown.style.display === "none"
        ? customInput.value.trim()
        : customInputWrapper.value;

    let phone = finalCountryCode + phoneNumber;

    // Validate phone
    if (!/^\+\d{10,15}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Validate custom country code if applicable
    // if (countryCodeSelect.style.display === "none" && !/^\+\d{1,4}$/.test(finalCountryCode)) {
    //   alert("Please enter a valid country code starting with '+' followed by numbers.");
    //   return;
    // }

    // Email validation
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!name || !phone || !email) {
      alert("Please fill out all required fields.");
      return;
    }

    // Form data
    let formData = {
      name: name,
      phone: phone,
      email: email,
      sqft: sqft,
      lastSegment: lastSegment,
    };

    fetch("https://script.google.com/macros/s/AKfycbw1Y9pxOPV8NIE1ao2-roujJ1455C8DE-dRtjtSfpOFRPnU9bRBdlaTQQkmUmhru5En/exec", {
      method: "POST",
      body: JSON.stringify(formData),
      mode: "cors",
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
        // Assuming success response
        // document.getElementById("leadform").reset();
        // window.location.href = "./thankyou.html";
        document.getElementById("otpInput").style.display = "none";
        document.getElementById("sqft").style.display = "none";
        document.getElementById("submitBtn").style.display = "none";
        document.getElementById("submitBtn").disabled = true;
      })
      .catch(error => {
        console.error("Fetch Error:", error);
        alert("Something went wrong. Please try again.");
      });
  });
});
