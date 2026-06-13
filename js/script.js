const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    nav.classList.toggle("show");
});