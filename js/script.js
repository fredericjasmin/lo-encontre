const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    nav.classList.toggle("show");
});

const objects = [
    "Audifonos", "Mochila", "Laptop", "Zapatos", "Patineta",
    "Lampara", "Reloj", "Botella", "Libros", "Taza"
];

let currentObject;

const targetName = document.querySelector("#target-name");
const scene = document.querySelector(".game-scene");

function newGame() {
    currentObject = objects[Math.floor(Math.random() * objects.length)];
    targetName.textContent = currentObject;
}

// Convierte el click del mouse en coordenadas dentro de la imagen,
// corrigiendo la inclinación (rotate) de la escena
function getClickPosition(event) {
    const rect = scene.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;

    const angle = 1.2 * (Math.PI / 180);

    const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);

    return {
        x: scene.offsetWidth / 2 + rotatedX,
        y: scene.offsetHeight / 2 + rotatedY
    };
}

function showFeedback(x, y, success) {
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.textContent = success ? "✓" : "✕";
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    feedback.style.transform = "translate(-50%, -50%)";

    scene.appendChild(feedback);
    setTimeout(() => feedback.remove(), 800);
}

document.querySelectorAll(".hitbox").forEach(hitbox => {
    hitbox.addEventListener("click", event => {
        const clicked = hitbox.dataset.object;
        const { x, y } = getClickPosition(event);

        if (clicked === currentObject) {
            showFeedback(x, y, true);
            setTimeout(newGame, 700);
        } else {
            showFeedback(x, y, false);
        }
    });
});

newGame();