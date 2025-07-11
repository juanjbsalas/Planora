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