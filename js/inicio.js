const gameObjects = [
    "Mochila", "Laptop", "Zapatos", "Patineta",
    "Lámpara", "Reloj", "Botella", "Libros", "Taza"
];

let currentObject;
let isLocked = false;

const targetName = document.querySelector("#target-name");
const scene = document.querySelector(".game-scene");
const hitboxes = document.querySelectorAll(".hitbox");

function newGame() {
    let nextObject;

    do {
        nextObject = gameObjects[Math.floor(Math.random() * gameObjects.length)];
    } while (nextObject === currentObject);

    currentObject = nextObject;
    targetName.textContent = currentObject;
    isLocked = false;
}

function getClickPosition(event) {
    const rect = scene.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const angle = 1.2 * (Math.PI / 180);

    return {
        x: scene.offsetWidth / 2 + dx * Math.cos(angle) - dy * Math.sin(angle),
        y: scene.offsetHeight / 2 + dx * Math.sin(angle) + dy * Math.cos(angle)
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

hitboxes.forEach(hitbox => {
    hitbox.addEventListener("click", event => {
        if (isLocked) return;

        const clicked = hitbox.dataset.object;
        const { x, y } = getClickPosition(event);

        if (clicked === currentObject) {
            isLocked = true;
            showFeedback(x, y, true);
            setTimeout(newGame, 700);
        } else {
            showFeedback(x, y, false);
        }
    });
});

async function cargarInicio() {
    const aboutTitle = document.querySelector("#aboutTitle");
    const aboutText = document.querySelector("#aboutText");
    const response = await fetch("data/inicio.json");
    const inicio = await response.json();

    aboutTitle.textContent = inicio.about.titulo;
    aboutText.textContent = inicio.about.texto;

    inicio.pasos.forEach((paso, indice) => {
        const numero = indice + 1;

        document.querySelector(`#step${numero}Title`).textContent = paso.titulo;
        document.querySelector(`#step${numero}Text`).textContent = paso.texto;
    });
}

newGame();
cargarInicio();
