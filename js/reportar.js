const reportForm = document.querySelector("#reportForm");
const clearFormButton = document.querySelector("#clearForm");
const message = document.querySelector("#message");
const fields = [
    document.querySelector("#name"),
    document.querySelector("#place"),
    document.querySelector("#date"),
    document.querySelector("#contact"),
    document.querySelector("#description")
];

function obtenerMensajeError(campo) {
    const valor = campo.value.trim();

    if (!valor) return "Este campo es obligatorio.";
    if (campo.id === "name" && valor.length < 3) return "Escribe al menos 3 caracteres.";
    if (campo.id === "place" && valor.length < 3) return "Indica un lugar más específico.";
    if (campo.id === "contact" && valor.length < 5) return "Escribe un contacto válido.";
    if (campo.id === "description" && valor.length < 15) return "Escribe al menos 15 caracteres.";

    return "";
}

function validarCampo(campo) {
    const grupo = campo.closest(".form-group");
    const errorAnterior = grupo.querySelector(".field-error");
    const mensajeError = obtenerMensajeError(campo);

    if (errorAnterior) errorAnterior.remove();
    grupo.classList.remove("has-error");

    if (!mensajeError) return true;

    grupo.classList.add("has-error");

    const error = document.createElement("p");
    error.className = "field-error";
    error.textContent = mensajeError;
    grupo.appendChild(error);

    return false;
}

function validarFormulario() {
    fields.forEach(validarCampo);

    return fields.every(campo =>
        !campo.closest(".form-group").classList.contains("has-error")
    );
}

function actualizarVistaPrevia() {
    const tipo = document.querySelector("#type").value;
    const nombre = document.querySelector("#name").value.trim();
    const categoria = document.querySelector("#category").value;
    const lugar = document.querySelector("#place").value.trim();
    const fecha = document.querySelector("#date").value;
    const contacto = document.querySelector("#contact").value.trim();
    const descripcion = document.querySelector("#description").value.trim();
    const archivoImagen = document.querySelector("#image").files[0];

    const estado = tipo === "Objeto perdido" ? "Perdido" : "Encontrado";
    const previewStatus = document.querySelector("#previewStatus");

    previewStatus.textContent = estado;
    previewStatus.className = estado === "Perdido"
        ? "object-status lost"
        : "object-status found";

    document.querySelector("#previewName").textContent = nombre || "Nombre del objeto";
    document.querySelector("#previewCategory").textContent = `Categoría: ${categoria}`;
    document.querySelector("#previewPlace").textContent = lugar || "Lugar";
    document.querySelector("#previewContact").textContent = `Contacto: ${contacto || "—"}`;
    document.querySelector("#previewDescription").textContent = descripcion || "La descripción del objeto aparecerá aquí.";
    document.querySelector("#previewDate").textContent = fecha
        ? new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CR")
        : "Fecha";

    document.querySelector("#previewImage").src = archivoImagen
        ? URL.createObjectURL(archivoImagen)
        : "assets/images/objects/object-placeholder.png";
}

function convertirImagenABase64(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

async function guardarReporte(event) {
    event.preventDefault();

    if (!validarFormulario()) {
        message.textContent = "Revisa los campos marcados en rojo.";
        message.className = "show error";
        return;
    }

    const archivoImagen = document.querySelector("#image").files[0];
    const imagen = archivoImagen
        ? await convertirImagenABase64(archivoImagen)
        : "assets/images/objects/object-placeholder.png";

    const nuevoReporte = {
        id: Date.now(),
        nombre: document.querySelector("#name").value.trim(),
        categoria: document.querySelector("#category").value,
        estado: document.querySelector("#type").value === "Objeto perdido"
            ? "Perdido"
            : "Encontrado",
        lugar: document.querySelector("#place").value.trim(),
        fecha: document.querySelector("#date").value,
        contacto: document.querySelector("#contact").value.trim(),
        descripcion: document.querySelector("#description").value.trim(),
        imagen
    };

    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];
    reportes.push(nuevoReporte);
    localStorage.setItem("reportes", JSON.stringify(reportes));

    message.innerHTML = `
        ✓ Reporte publicado correctamente.
        <a href="objetos.html">Ver objetos reportados →</a>
    `;
    message.className = "show";

    reportForm.reset();
    actualizarVistaPrevia();
}

function limpiarFormulario() {
    if (!confirm("¿Seguro que deseas limpiar el formulario?")) return;

    reportForm.reset();
    fields.forEach(campo => {
        campo.closest(".form-group").classList.remove("has-error");
        campo.closest(".form-group").querySelector(".field-error")?.remove();
    });

    message.className = "";
    actualizarVistaPrevia();
}

fields.forEach(campo => {
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
        if (campo.closest(".form-group").classList.contains("has-error")) {
            validarCampo(campo);
        }
    });
});

reportForm.addEventListener("input", actualizarVistaPrevia);
reportForm.addEventListener("change", actualizarVistaPrevia);
reportForm.addEventListener("submit", guardarReporte);
clearFormButton.addEventListener("click", limpiarFormulario);

actualizarVistaPrevia();
