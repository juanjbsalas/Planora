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
// fetch('/travel-dest/home/nav.html')
fetch(window.location.pathname.includes('/travel-dest') ? '/travel-dest/home/nav.html' : 'home/nav.html')
.then(res => res.text())
.then(text => {
    let oldelem = document.querySelector("script#replace_with_navbar");
    let newelem = document.createElement("div");
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem, oldelem);

    // Event listener for hambuger button click
    const toggleButton = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    toggleButton.addEventListener('click', function(){
        mobileMenu.classList.toggle('hidden');

        if(menuIcon.classList.contains('fa-bars')) {
            menuIcon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            menuIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
});
console.log('It is RUNNING!!');

