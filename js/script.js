const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    nav.classList.toggle("show");
});

const objects = [
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
        nextObject = objects[Math.floor(Math.random() * objects.length)];
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
if (hitboxes.length > 0) {
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
}

if (targetName && scene) {
    newGame();
}

// Objetos

let objetos = [];

const objectsGrid =
    document.querySelector("#objectsGrid");

if (objectsGrid) {

    cargarObjetos();

    document
        .querySelector("#searchInput")
        .addEventListener("input", filtrarObjetos);

    document
        .querySelector("#categoryFilter")
        .addEventListener("change", filtrarObjetos);

    document
        .querySelector("#statusFilter")
        .addEventListener("change", filtrarObjetos);
}

async function cargarObjetos() {

    const response =
        await fetch("data/objetos.json");

    const jsonObjetos =
        await response.json();

    const reportes =
        JSON.parse(
            localStorage.getItem("reportes")
        ) || [];

    objetos = [...jsonObjetos, ...reportes];

    renderizarObjetos(objetos);
}

function renderizarObjetos(lista) {

    objectsGrid.innerHTML = "";

    if (lista.length === 0) {

        objectsGrid.innerHTML =
            "<p>No se encontraron objetos.</p>";

        return;
    }

    lista.forEach(objeto => {

        let estadoClase = "";

        if (objeto.estado === "Encontrado")
            estadoClase = "found";

        if (objeto.estado === "Perdido")
            estadoClase = "lost";

        if (objeto.estado === "Recuperado")
            estadoClase = "recovered";

        objectsGrid.innerHTML += `
        <article class="object-card">

            <div class="object-image">

                <img src="${objeto.imagen}" alt="${objeto.nombre}">

                <button
                    class="expand-image"
                    data-image="${objeto.imagen}">

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round">

                        <path d="M15 3H21V9"></path>
                        <path d="M21 3L14 10"></path>

                        <path d="M9 21H3V15"></path>
                        <path d="M3 21L10 14"></path>

                    </svg>

                </button>

            </div>

            <div class="object-content">

                <span class="object-status ${estadoClase}">
                    ${objeto.estado}
                </span>

                <h3>${objeto.nombre}</h3>

                <p>${objeto.descripcion}</p>

                <div class="object-meta">
                    <span>${objeto.lugar}</span>
                    <span>${objeto.fecha}</span>
                </div>

            </div>

        </article>
        `;
    });
}

function filtrarObjetos() {

    const texto =
        document
            .querySelector("#searchInput")
            .value
            .toLowerCase();

    const categoria =
        document
            .querySelector("#categoryFilter")
            .value;

    const estado =
        document
            .querySelector("#statusFilter")
            .value;

    const resultado =
        objetos.filter(objeto => {

            const coincideTexto =
                objeto.nombre
                    .toLowerCase()
                    .includes(texto);

            const coincideCategoria =
                categoria === "Todas las categorías"
                ||
                objeto.categoria === categoria;

            const coincideEstado =
                estado === "Todos los estados"
                ||
                objeto.estado === estado;

            return (
                coincideTexto &&
                coincideCategoria &&
                coincideEstado
            );
        });

    renderizarObjetos(resultado);
}

document.addEventListener("click", event => {

    const expandButton =
        event.target.closest(".expand-image");

    if (!expandButton) return;

    const modal =
        document.querySelector("#imageModal");

    const modalImage =
        document.querySelector("#modalImage");

    modalImage.src =
        expandButton.dataset.image;

    modal.classList.add("show");
});

const imageModal =
    document.querySelector("#imageModal");

if (imageModal) {

    imageModal.addEventListener("click", () => {

        imageModal.classList.remove("show");

    });
}

// Reportar

const reportForm =
    document.querySelector("#reportForm");

if (reportForm) {

    reportForm.addEventListener(
        "submit",
        guardarReporte
    );
}

function convertirImagenABase64(archivo) {

    return new Promise((resolve, reject) => {

        const lector = new FileReader();

        lector.onload = () => {
            resolve(lector.result);
        };

        lector.onerror = reject;

        lector.readAsDataURL(archivo);

    });
}

async function guardarReporte(event) {

    event.preventDefault();

    const nombre =
        document.querySelector("#name").value.trim();

    const categoria =
        document.querySelector("#category").value;

    const lugar =
        document.querySelector("#place").value.trim();

    const fecha =
        document.querySelector("#date").value;

    const contacto =
        document.querySelector("#contact").value.trim();

    const descripcion =
        document.querySelector("#description").value.trim();

    const estado =
        document.querySelector("#type").value ===
            "Objeto perdido"
            ? "Perdido"
            : "Encontrado";

    const message =
        document.querySelector("#message");

    if (
        !nombre ||
        !lugar ||
        !fecha ||
        !contacto ||
        !descripcion
    ) {

        message.textContent =
            "Complete todos los campos.";

        return;
    }


    const archivoImagen =
        document.querySelector("#image").files[0];

    let imagenBase64 =
        "assets/images/objects/object-placeholder.png";

    if (archivoImagen) {

        imagenBase64 =
            await convertirImagenABase64(
                archivoImagen
            );

    }

    const nuevoReporte = {

        id: Date.now(),

        nombre,
        categoria,
        estado,
        lugar,
        fecha,
        contacto,
        descripcion,

        imagen:
            imagenBase64
    };

    const reportes =
        JSON.parse(
            localStorage.getItem("reportes")
        ) || [];

    reportes.push(nuevoReporte);

    localStorage.setItem(
        "reportes",
        JSON.stringify(reportes)
    );

    message.textContent =
        "Reporte guardado correctamente.";

    reportForm.reset();
}