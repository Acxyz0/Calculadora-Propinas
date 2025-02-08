// SELECTORES
const formulario = document.querySelector("#formulario");
const inputPorcentaje = document.querySelector("#porcentaje");
const mostrarDatos = document.querySelector("#mostrarDatos");

// CONSTANTES
const MONEDA = "Q";
const DECIMALES = 2;

// INICIAR APP
eventListeners();

function eventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
        iniciarBotones();
    });

    formulario.addEventListener("submit", calcularPropina);

    inputPorcentaje.addEventListener("input", editarPorcentaje);
}

function iniciarBotones() {
    const botones = document.querySelectorAll(".tip-btn");

    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            // Eliminar la clase activa de todos los botones
            botones.forEach((boton) => {
                boton.classList.remove("active");
            });

            // Agregar la clase activa al darle clic al boton correspondiente
            e.target.classList.add("active");

            // Obtenemos el valor de la propina
            const valorPropina = e.target.getAttribute("data-tip");

            // Asignamos el valor de la propina al input
            inputPorcentaje.value = valorPropina;
        });
    });
}

// Función para calcular la propina
function calcularPropina(e) {
    e.preventDefault();

    const total = document.querySelector("#total").value;
    const personas = document.querySelector("#personas").value;
    const porcentaje = inputPorcentaje.value;

    try {
        // Función para validar los campos
        validarFormulario(total, personas, porcentaje);

        // Convertir todo a numeros
        const totalNumero = parseFloat(total);
        const personasNumero = parseInt(personas);
        const porcentajeNumero = parseFloat(porcentaje);

        // Calculos
        const propina = calcularPropinaTotal(totalNumero, porcentajeNumero);
        const totalSinPropina = calcularTotalPorPersona(
            totalNumero,
            personasNumero
        );
        const totalConPropina = calcularTotalConPropina(
            totalNumero,
            personasNumero,
            propina
        );

        // Objeto para mostrar los datos en el DOM
        const datos = {
            propina,
            totalSinPropina,
            totalConPropina,
            porcentaje: porcentajeNumero,
        };

        mostrarDatosCalculados(datos);
        mostrarAlertaExito();

        // Limpiar formulario y botones
        document.querySelectorAll(".tip-btn").forEach((boton) => {
            boton.classList.remove("active");
        });

        formulario.reset();
    } catch (error) {
        mostrarAlertaError(error.message);
    }
}

function validarFormulario(total, personas, porcentaje) {
    if (!total || !personas || !porcentaje) {
        throw new Error("Todos los campos son obligatorios");
    }

    const valores = [total, personas, porcentaje];

    if (valores.some((valor) => valor <= 0)) {
        throw new Error("Los valores deben ser mayores a 0");
    }

    if (valores.some((valor) => isNaN(valor))) {
        throw new Error("Los valores deben ser numéricos");
    }

    if (!Number.isInteger(parseFloat(personas))) {
        throw new Error("El número de personas debe ser entero");
    }
}

// Funciones de calculos
function calcularPropinaTotal(total, porcentaje) {
    return total * (porcentaje / 100);
}

function calcularTotalPorPersona(total, personas) {
    return total / personas;
}

function calcularTotalConPropina(total, personas, propina) {
    return (total + propina) / personas;
}

// Funcion para mostrar los datos en el DOM
function mostrarDatosCalculados(datos) {
    limpiarResultado();

    const { propina, totalSinPropina, totalConPropina, porcentaje } = datos;

    const div = document.createElement("div");
    div.classList.add("resultado");

    div.innerHTML = `
        <h2>Resumen:</h2>
        <p>
            Total sin Propina (por Persona)
            <span>${formatearMoneda(totalSinPropina)}</span>
        </p>
        <p>
            Propina (${porcentaje}%)
            <span>${formatearMoneda(propina)}</span>
        </p>
        <p>
            Total con Propina (por Persona)
            <span>${formatearMoneda(totalConPropina)}</span>
        </p>
    `;

    const resultadoContenedor = document.createElement("div");
    resultadoContenedor.classList.add("mostrar-datos");
    resultadoContenedor.appendChild(div);

    mostrarDatos.appendChild(resultadoContenedor);
}

function editarPorcentaje() {
    const botones = document.querySelectorAll(".tip-btn");

    botones.forEach((boton) => {
        const valorBoton = boton.getAttribute("data-tip");
        if (valorBoton === inputPorcentaje.value) {
            boton.classList.add("active");
            return;
        }

        boton.classList.remove("active");
    });
}

// Formateamos la moneda para que se vean solo 2 decimales y con el símbolo de la moneda.
function formatearMoneda(cantidad) {
    return `${MONEDA}${cantidad.toFixed(DECIMALES)}`;
}

// Limpiar el resultado del DOM
function limpiarResultado() {
    while (mostrarDatos.firstChild) {
        mostrarDatos.removeChild(mostrarDatos.firstChild);
    }
}

// ALERTAS
// Alerta de exito
function mostrarAlertaExito() {
    Swal.fire({
        icon: "success",
        title: "¡Cálculo realizado!",
        text: "La propina ha sido calculada correctamente",
        timer: 2000,
        showConfirmButton: false,
    });
}

function mostrarAlertaError(mensaje) {
    Swal.fire({
        position: "top-end",
        icon: "error",
        title: "¡Ah ocurrido un error!",
        text: mensaje,
        showConfirmButton: false,
        timer: 3000,
    });
}
