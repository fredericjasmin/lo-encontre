const contenedorEventos = document.getElementById("contenedorEventos")
const mensajeEventos = document.getElementById("mensajeEventos")

const filtroCategoria = document.getElementById("filtroCategoria")
const filtroModalidad = document.getElementById("filtroModalidad")
const filtroEtiqueta = document.getElementById("filtroEtiqueta")

const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros")

const selectEventoInscripcion = document.getElementById("selectEventoInscripcion")

function calcularDisponibles(evento) {
    return evento.cuposTotales - evento.inscritos
}

function obtenerEstadoEvento(evento) {
    const disponibles = calcularDisponibles(evento)
    if (disponibles === 0) {
        return "Evento lleno"
    }
    if (disponibles <= 10) {
        return "Pocos cupos"
    }
    return "Disponible"
}

function obtenerClaseEstado(evento) {
    const disponibles = calcularDisponibles(evento)
    if (disponibles === 0) {
        return "state-danger"
    }
    if (disponibles <= 10) {
        return "state-warning"
    }
    return "state-success"
}

function obtenerEventosActivos() {
    return eventos.filter(function (evento) {
        return evento.activo
    });
}

function obtenerValoresUnicos(lista, propiedad) {
    const valores = []
    for (const item of lista) {
        if (!valores.includes(item[propiedad])) {
            valores.push(item[propiedad])
        }
    }
    return valores
}

function obtenerEtiquetasUnicas(lista) {
    const etiquetas = []
    for (const evento of lista) {
        for (const etiqueta of evento.etiquetas) {
            if (!etiquetas.includes(etiqueta)) {
                etiquetas.push(etiqueta)
            }
        }
    }
    return etiquetas
}

function cargarOpcionesSelect(select, opciones) {
    for (const opcion of opciones) {
        const option = document.createElement("option")
        option.value = opcion
        option.textContent = opcion
        select.appendChild(option)
    }
}

function cargarFiltros() {
    const eventosActivos = obtenerEventosActivos()
    const categorias =
        obtenerValoresUnicos(eventosActivos, "categoria")
    const modalidades =
        obtenerValoresUnicos(eventosActivos, "modalidad")
    const etiquetas =
        obtenerEtiquetasUnicas(eventosActivos)
    cargarOpcionesSelect(filtroCategoria, categorias)
    cargarOpcionesSelect(filtroModalidad, modalidades)
    cargarOpcionesSelect(filtroEtiqueta, etiquetas)
}

function cargarEventos() {
    const eventosActivos = obtenerEventosActivos()
    for (const evento of eventosActivos) {
        const option = document.createElement("option")
        option.value = evento.id
        option.textContent = evento.nombre
        selectEventoInscripcion.appendChild(option)
    }
    
}

function crearTarjetaEvento(evento) {
    const disponibles = calcularDisponibles(evento)
    const estado = obtenerEstadoEvento(evento)
    const claseEstado = obtenerClaseEstado(evento)

    const tarjeta = document.createElement("article")
    tarjeta.classList.add("dynamic-event-card")

    tarjeta.innerHTML = `
        <div class="event-image-box">
            <img src="${evento.imagen}" alt="Imagen del evento ${evento.nombre}">
            <span class="event-status ${claseEstado}">
                ${estado}
            </span>
        </div>
        <div class="dynamic-event-content">
            <span class="event-category">
                ${evento.categoria}
            </span>
            <h3>${evento.nombre}</h3>
            <p>
                Modalidad:
                <strong>${evento.modalidad}</strong>
            </p>
            <p>
                Cupos disponibles:
                <strong>${disponibles}</strong>
            </p>
            <div class="event-tags">
                ${evento.etiquetas.map(function (etiqueta) {
                    return `<span>${etiqueta}</span>`
                }).join("")}
            </div>
        </div>
    `
    return tarjeta
}

function renderizarEventos(listaEventos) {
    contenedorEventos.innerHTML = ""
    if (listaEventos.length === 0) {
        mensajeEventos.textContent =
            "No se encontraron eventos activos con los filtros seleccionados."
        contenedorEventos.innerHTML = `
            <div class="dynamic-empty-state">
                <h3>Sin resultados</h3>
                <p>
                    Cambie los filtros para visualizar otros eventos disponibles.
                </p>
            </div>
        `
        return
    }
    mensajeEventos.textContent =
        `Mostrando ${listaEventos.length} evento(s) activo(s).`
    for (const evento of listaEventos) {
        const tarjeta = crearTarjetaEvento(evento)
        contenedorEventos.appendChild(tarjeta)
    }
}

function filtrarEventos() {
    const categoriaSeleccionada = filtroCategoria.value
    const modalidadSeleccionada = filtroModalidad.value
    const etiquetaSeleccionada = filtroEtiqueta.value
    const eventosFiltrados = eventos.filter(function (evento) {
        const cumpleActivo = evento.activo
        const cumpleCategoria =
            categoriaSeleccionada === "" ||
            evento.categoria === categoriaSeleccionada
        const cumpleModalidad =
            modalidadSeleccionada === "" ||
            evento.modalidad === modalidadSeleccionada
        const cumpleEtiqueta =
            etiquetaSeleccionada === "" ||
            evento.etiquetas.includes(etiquetaSeleccionada)
        return cumpleActivo &&
            cumpleCategoria &&
            cumpleModalidad &&
            cumpleEtiqueta
    })
    renderizarEventos(eventosFiltrados)
}

function limpiarFiltros() {
    filtroCategoria.value = ""
    filtroModalidad.value = ""
    filtroEtiqueta.value = ""

    filtrarEventos()
}

filtroCategoria.addEventListener("change", filtrarEventos);
filtroModalidad.addEventListener("change", filtrarEventos);
filtroEtiqueta.addEventListener("change", filtrarEventos);
btnLimpiarFiltros.addEventListener("click", limpiarFiltros);

document.addEventListener("DOMContentLoaded", function () {
    cargarFiltros();
    cargarEventos();
    renderizarEventos(obtenerEventosActivos());
});
