const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    nav.classList.toggle("show");
});const objects = [
    "Audifonos",
    "Mochila",
    "Laptop",
    "Zapatos",
    "Patineta",
    "Lampara",
    "Reloj",
    "Botella",
    "Libros",
    "Taza"
];

let currentObject;

const targetName =
    document.querySelector("#target-name");

const message =
    document.querySelector("#game-message");

function newGame() {

    currentObject =
        objects[Math.floor(Math.random() * objects.length)];

    targetName.textContent = currentObject;

    message.textContent = "";
}

document.querySelectorAll(".hitbox")
.forEach(hitbox => {

    hitbox.addEventListener("click", () => {

        const clicked =
            hitbox.dataset.object;

        if (clicked === currentObject) {

            message.textContent =
                "✓ ¡Correcto!";

            setTimeout(newGame, 1200);

        } else {

            message.textContent =
                "✗ Sigue buscando";
        }

    });

});

newGame();