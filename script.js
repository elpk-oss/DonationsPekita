const products = [
    { id: 'donacion1k', name: 'Donación de $1.000 Dinero Server De Minecraft', description: '$1.000 en un servidor de Minecraft a elección', value: '1000' },
    { id: 'donacion5k', name: 'Donación de $5.000 Dinero Server Minecraft', description: '$5.000 en un servidor de Minecraft a elección', value: '5000' },
    { id: 'donacion10k', name: 'Donación de $10.000 Dinero Server Minecraft', description: '$10.000 en un servidor de Minecraft a elección', value: '10000' },
    { id: 'donacion100k', name: 'Donación de $100.000 Dinero Server Minecraft', description: '$100.000 en un servidor de Minecraft a elección', value: '100000' },
    { id: 'donacion1m', name: 'Donación de $1.000.000 Dinero Server Minecraft', description: '$1.000.000 en un servidor de Minecraft a elección', value: '1000000' },
    { id: 'dineroEleccion', name: 'Donación de Dinero a Elección', description: 'Cantidad de dinero en el servidor a tu elección', value: 'A eleccion', type: 'customMoney' },
    { id: 'kitPersonalizado', name: 'Kit Personalizado / Ítems a Intercambiar', description: 'Intercambia ítems o un kit que me darías en el servidor', value: 'Kit', type: 'customKit' }
];

const productGrid = document.getElementById('productGrid');
const selectedItemInput = document.getElementById('selectedItem');
const moneyTypeSelect = document.getElementById('moneyType');
const moneyAmountGroup = document.getElementById('moneyAmountGroup');
const dineroAdicionalGroup = document.getElementById('dineroAdicionalGroup');
const kitDetailsGroup = document.getElementById('kitDetailsGroup');
const purchaseForm = document.getElementById('purchaseForm');
const messageDiv = document.getElementById('message');

let selectedProductId = null;

// Cargar productos en la cuadrícula
products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.type = product.type || 'money'; // Añadir un tipo por defecto
    card.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${product.value}</p>
    `;
    productGrid.appendChild(card);

    card.addEventListener('click', () => {
        // Deseleccionar cualquier tarjeta previamente seleccionada
        const currentSelected = document.querySelector('.product-card.selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
        // Seleccionar la nueva tarjeta
        card.classList.add('selected');
        selectedProductId = product.id;
        selectedItemInput.value = product.name;

        // Ajustar visibilidad de campos del formulario
        toggleFormFields(product.type);
    });
});

// Función para mostrar/ocultar campos del formulario
function toggleFormFields(productType) {
    // Ocultar todos los campos condicionales por defecto
    moneyAmountGroup.style.display = 'block'; // Este siempre es visible para las donaciones fijas
    dineroAdicionalGroup.style.display = 'none';
    kitDetailsGroup.style.display = 'none';
    
    // Restablecer valores para evitar envío de datos incorrectos
    document.getElementById('moneyAmount').value = '';
    document.getElementById('dineroAdicional').value = '';
    document.getElementById('kitDetails').value = '';

    // Restablecer el select del tipo de pago
    moneyTypeSelect.value = '';

    if (productType === 'customMoney') {
        dineroAdicionalGroup.style.display = 'block';
        moneyAmountGroup.style.display = 'none'; // Ocultar campo de cantidad fija
        moneyTypeSelect.value = 'dinero'; // Pre-seleccionar "Dinero del Servidor"
        moneyTypeSelect.disabled = true; // Deshabilitar para que no lo cambien
    } else if (productType === 'customKit') {
        kitDetailsGroup.style.display = 'block';
        moneyAmountGroup.style.display = 'none'; // Ocultar campo de cantidad fija
        moneyTypeSelect.value = 'item'; // Pre-seleccionar "Ítems / Kit Personalizado"
        moneyTypeSelect.disabled = true; // Deshabilitar
    } else {
        moneyTypeSelect.disabled = false; // Habilitar si no es un tipo especial
    }
}

// Manejar el cambio en el tipo de dinero/ítem
moneyTypeSelect.addEventListener('change', () => {
    const selectedType = moneyTypeSelect.value;
    moneyAmountGroup.style.display = 'none';
    dineroAdicionalGroup.style.display = 'none';
    kitDetailsGroup.style.display = 'none';

    if (selectedType === 'dinero') {
        moneyAmountGroup.style.display = 'block';
    } else if (selectedType === 'item') {
        kitDetailsGroup.style.display = 'block';
    }
});


// Manejar el envío del formulario (¡Esto es solo una simulación!)
purchaseForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    if (!selectedProductId) {
        showMessage('Por favor, selecciona un artículo primero.', 'error');
        return;
    }

    const formData = {
        selectedItem: selectedItemInput.value,
        discordUsername: document.getElementById('discordUsername').value,
        minecraftServer: document.getElementById('minecraftServer').value,
        moneyType: moneyTypeSelect.value,
        moneyAmount: document.getElementById('moneyAmount').value,
        dineroAdicional: document.getElementById('dineroAdicional').value,
        kitDetails: document.getElementById('kitDetails').value
    };

    // --- SIMULACIÓN DE ENVÍO EXITOSO (NO REAL) ---
    console.log("Datos de la solicitud (esto NO se envía a ningún lado):", formData);
    showMessage('¡Solicitud enviada con éxito (simulado)! Revisa la consola del navegador para ver los datos.', 'success');
    purchaseForm.reset();
    selectedItemInput.value = '';
    const currentSelected = document.querySelector('.product-card.selected');
    if (currentSelected) {
        currentSelected.classList.remove('selected');
    }
    selectedProductId = null;
    toggleFormFields(); // Resetear visibilidad

    alert("¡Atención! Esta es solo una simulación. Para que funcione de verdad, necesitas un backend (servidor y base de datos) que procese esta información.");
});

function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`; // Remueve clases anteriores y añade la nueva
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 7000); // Ocultar mensaje después de 7 segundos
}

// Inicializar el estado de los campos condicionales
toggleFormFields();
