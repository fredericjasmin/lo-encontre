let objetos = [];

const objectsGrid = document.querySelector("#objectsGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const statusFilter = document.querySelector("#statusFilter");
const objectsTotal = document.querySelector("#objectsTotal");
const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");

async function cargarObjetos() {
    const response = await fetch("data/objetos.json");
    const jsonObjetos = await response.json();
    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];

    const objetosBase = jsonObjetos.map(objeto => ({
        ...objeto,
        esReportePropio: false
    }));

    const reportesPropios = reportes.map(reporte => ({
        ...reporte,
        esReportePropio: true
    }));

    objetos = [...objetosBase, ...reportesPropios];
    objectsTotal.textContent = `Hay ${objetos.length} objetos reportados en total.`;
    renderizarObjetos(objetos);
}

function renderizarObjetos(lista) {
    objectsGrid.innerHTML = "";

    if (lista.length === 0) {
        objectsGrid.innerHTML = "<p>No se encontraron objetos.</p>";
        return;
    }

    lista.forEach(objeto => {
        const estadoClase = objeto.estado === "Encontrado"
            ? "found"
            : objeto.estado === "Perdido"
                ? "lost"
                : "recovered";

        const acciones = objeto.esReportePropio ? `
            <div class="object-actions">
                ${objeto.estado !== "Recuperado" ? `
                    <button class="object-action recover-report" data-id="${objeto.id}">
                        Recuperado
                    </button>
                ` : ""}
                <button class="object-action delete-report" data-id="${objeto.id}">
                    Eliminar
                </button>
            </div>
        ` : "";

        objectsGrid.innerHTML += `
            <article class="object-card">
                <div class="object-image">
                    <img src="${objeto.imagen}" alt="${objeto.nombre}">
                    <button class="expand-image" data-image="${objeto.imagen}" aria-label="Ampliar imagen">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 3H21V9"></path>
                            <path d="M21 3L14 10"></path>
                            <path d="M9 21H3V15"></path>
                            <path d="M3 21L10 14"></path>
                        </svg>
                    </button>
                </div>
                <div class="object-content">
                    <span class="object-status ${estadoClase}">${objeto.estado}</span>
                    <h3>${objeto.nombre}</h3>
                    <p class="object-category">Categoría: ${objeto.categoria}</p>
                    <p>${objeto.descripcion}</p>
                    <div class="object-meta">
                        <span>${objeto.lugar}</span>
                        <span>${objeto.fecha}</span>
                    </div>
                    ${acciones}
                </div>
            </article>
        `;
    });
}

function filtrarObjetos() {
    const texto = searchInput.value.toLowerCase();
    const categoria = categoryFilter.value;
    const estado = statusFilter.value;

    const resultado = objetos.filter(objeto => {
        const coincideTexto = objeto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categoria === "Todas las categorías" || objeto.categoria === categoria;
        const coincideEstado = estado === "Todos los estados" || objeto.estado === estado;

        return coincideTexto && coincideCategoria && coincideEstado;
    });

    objectsTotal.textContent = `Mostrando ${resultado.length} de ${objetos.length} objetos.`;
    renderizarObjetos(resultado);
}

function marcarComoRecuperado(id) {
    if (!confirm("¿Confirmas que este objeto ya fue recuperado?")) return;

    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];
    const reporte = reportes.find(reporte => String(reporte.id) === id);

    if (!reporte) return;

    reporte.estado = "Recuperado";
    localStorage.setItem("reportes", JSON.stringify(reportes));

    const objeto = objetos.find(objeto =>
        objeto.esReportePropio && String(objeto.id) === id
    );

    objeto.estado = "Recuperado";
    filtrarObjetos();
}

function eliminarReporte(id) {
    if (!confirm("¿Seguro que deseas eliminar este reporte? Esta acción no se puede deshacer.")) return;

    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];
    const reportesActualizados = reportes.filter(reporte => String(reporte.id) !== id);

    localStorage.setItem("reportes", JSON.stringify(reportesActualizados));
    objetos = objetos.filter(objeto =>
        !(objeto.esReportePropio && String(objeto.id) === id)
    );

    filtrarObjetos();
}

searchInput.addEventListener("input", filtrarObjetos);
categoryFilter.addEventListener("change", filtrarObjetos);
statusFilter.addEventListener("change", filtrarObjetos);

document.addEventListener("click", event => {
    const expandButton = event.target.closest(".expand-image");
    const recoverButton = event.target.closest(".recover-report");
    const deleteButton = event.target.closest(".delete-report");

    if (expandButton) {
        modalImage.src = expandButton.dataset.image;
        imageModal.classList.add("show");
    }

    if (recoverButton) marcarComoRecuperado(recoverButton.dataset.id);
    if (deleteButton) eliminarReporte(deleteButton.dataset.id);
});

imageModal.addEventListener("click", () => imageModal.classList.remove("show"));

cargarObjetos();
