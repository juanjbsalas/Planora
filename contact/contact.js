document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const comment = document.getElementById("comment").value.trim();
  const message = document.getElementById("formMessage");

  // Basic validation
  if (!name || !phone || !email || !comment) {
    message.style.color = "red";
    message.textContent = "Please fill out all fields.";
    return;
  }

  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) {
    message.style.color = "red";
    message.textContent = "Phone number must be 10 digits.";
    return;
  }

  // Simulate successful submission
  message.style.color = "green";
  message.textContent = "Message sent successfully!";
  this.reset();
});
