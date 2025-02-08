// SELECTORES
const formulario = document.querySelector("#formulario");
const inputPorcentaje = document.querySelector("#porcentaje");
const mostrarDatos = document.querySelector("#mostrarDatos");
const botonesPropinas = document.querySelector(".form__tip-buttons");

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

            const valorPropina = e.target.getAttribute("data-tip");

            inputPorcentaje.value = valorPropina;
        });
    });
}

function calcularPropina(e) {
    e.preventDefault();

    const total = document.querySelector("#total").value;
    const personas = document.querySelector("#personas").value;
    const porcentaje = inputPorcentaje.value;

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

    const datos = {
        propina,
        totalSinPropina,
        totalConPropina,
        porcentaje: porcentajeNumero,
    };

    mostrarDatosCalculados(datos);
}

function validarFormulario(total, personas, porcentaje) {}

function calcularPropinaTotal(total, porcentaje) {
    return total * (porcentaje / 100);
}

function calcularTotalPorPersona(total, personas) {
    return total / personas;
}

function calcularTotalConPropina(total, personas, propina) {
    return (total + propina) / personas;
}

function mostrarDatosCalculados(datos) {
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

function formatearMoneda(cantidad) {
    return `${MONEDA}${cantidad.toFixed(DECIMALES)}`;
}
