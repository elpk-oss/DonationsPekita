// Variable global para controlar el envío del formulario a Google Forms
var submitted = false;

const donationOptionsData = [
    { id: 'donacion1k', name: 'Donación de $1.000 Dinero Server', description: '¡Dona $1.000 de dinero en el servidor!', value: '$1.000' },
    { id: 'donacion5k', name: 'Donación de $5.000 Dinero Server', description: '¡Dona $5.000 de dinero en el servidor!', value: '$5.000' },
    { id: 'donacion10k', name: 'Donación de $10.000 Dinero Server', description: '¡Dona $10.000 de dinero en el servidor!', value: '$10.000' },
    { id: 'donacion100k', name: 'Donación de $100.000 Dinero Server', description: '¡Dona $100.000 de dinero en el servidor!', value: '$100.000' },
    { id: 'donacion1m', name: 'Donación de $1.000.000 Dinero Server', description: '¡Dona $1.000.000 de dinero en el servidor!', value: '$1.000.000' },
    { id: 'dineroEleccion', name: 'Donación de Dinero a Elección', description: 'Dona la cantidad de dinero del servidor que quieras', value: 'Cantidad a Elección', type: 'customMoney' },
    { id: 'kitPersonalizado', name: 'Donación de Kit/Ítems', description: 'Dona un kit o ítems que me darás en el servidor', value: 'Kit/Ítems', type: 'customItem' }
];

const donationOptionsGrid = document.getElementById('donationOptions');
const selectedDonationInput = document.getElementById('selectedDonation');
const donationTypeSelect = document.getElementById('donationType');
const moneyAmountGroup = document.getElementById('moneyAmountGroup');
const kitDetailsGroup = document.getElementById('kitDetailsGroup');
const donationForm = document.getElementById('donationForm');
const messageDiv = document.getElementById('message');

let selectedDonationId = null;

// URL de acción de tu Google Form. ¡TIENES QUE CAMBIAR ESTO!
// Sigue los pasos en la sección "Configuración del Google Form" más abajo.
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/TU_ID_DEL_FORMULARIO/formResponse'; 
// Ejemplo: 'https://docs.google.com/forms/d/e/1FAIpQLSd9l_x_y-zC_l-k_k-p_x_x_x_x_x_x_x_x_x_x_x_x_x/formResponse';


// Asigna la URL de acción al formulario
donationForm.action = GOOGLE_FORM_ACTION_URL;

// Cargar opciones de donación en la cuadrícula
donationOptionsData.forEach(option => {
    const card = document.createElement('div');
    card.className = 'product-card'; // Reutilizamos la clase, pero ahora es para donaciones
    card.dataset.id = option.id;
    card.dataset.type = option.type || 'moneyFixed'; // Añadir un tipo por defecto
    card.innerHTML = `
        <h3>${option.name}</h3>
        <p>${option.description}</p>
        <p class="price">${option.value}</p>
    `;
    donationOptionsGrid.appendChild(card);

    card.addEventListener('click', () => {
        const currentSelected = document.querySelector('.product-card.selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
        card.classList.add('selected');
        selectedDonationId = option.id;
        selectedDonationInput.value = option.name;

        toggleFormFields(option.type);
    });
});

// Función para mostrar/ocultar campos del formulario según el tipo de donación
function toggleFormFields(donationType) {
    moneyAmountGroup.style.display = 'none';
    kitDetailsGroup.style.display = 'none';
    
    // Resetear valores de los campos
    document.getElementById('moneyAmount').value = '';
    document.getElementById('kitDetails').value = '';

    // Resetear y habilitar el select de tipo de donación
    donationTypeSelect.value = '';
    donationTypeSelect.disabled = false;

    if (donationType === 'customMoney') {
        moneyAmountGroup.style.display = 'block';
        donationTypeSelect.value = 'dinero'; // Pre-seleccionar "Dinero del Servidor"
        donationTypeSelect.disabled = true; // Deshabilitar para que no lo cambien
    } else if (donationType === 'customItem') {
        kitDetailsGroup.style.display = 'block';
        donationTypeSelect.value = 'item'; // Pre-seleccionar "Ítems / Kit Personalizado"
        donationTypeSelect.disabled = true; // Deshabilitar
    } else {
        // Si es una donación de dinero fija, solo mostrar el select y no los campos adicionales
        // el usuario elegirá el valor de la tarjeta
    }
}

// Manejar el cambio en el tipo de donación (si es "a elección")
donationTypeSelect.addEventListener('change', () => {
    const selectedType = donationTypeSelect.value;
    // Ocultar ambos y luego mostrar el que corresponda
    moneyAmountGroup.style.display = 'none';
    kitDetailsGroup.style.display = 'none';

    if (selectedType === 'dinero') {
        moneyAmountGroup.style.display = 'block';
    } else if (selectedType === 'item') {
        kitDetailsGroup.style.display = 'block';
    }
});

// Mensajes de confirmación
function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    // Ocultar el mensaje después de 7 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 7000);
}

// Evento que se dispara cuando el iframe cargó la respuesta de Google Forms
document.getElementById('hidden_iframe').onload = function() {
    if(submitted) {
        showMessage('¡Tu propuesta de donación ha sido enviada! Te contactaremos por Discord.', 'success');
        donationForm.reset(); // Limpiar formulario
        selectedDonationInput.value = ''; // Limpiar el campo de donación seleccionada
        const currentSelected = document.querySelector('.product-card.selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
        selectedDonationId = null;
        toggleFormFields(); // Resetear visibilidad de campos
        submitted = false; // Resetear la variable de envío
    }
};

// Manejar el envío del formulario
donationForm.addEventListener('submit', (event) => {
    // No usamos preventDefault() aquí, porque queremos que el formulario se envíe al iframe
    if (!selectedDonationId) {
        event.preventDefault(); // Si no hay selección, prevenimos el envío
        showMessage('Por favor, selecciona una opción de donación primero.', 'error');
        return;
    }
    // Google Forms no necesita preventDefault(), el iframe lo maneja
    // la variable 'submitted' se pondrá en true en el HTML (onsubmit="submitted=true;")
});

// Inicializar el estado de los campos condicionales
toggleFormFields();
