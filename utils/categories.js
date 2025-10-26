// categories.js - Configuración centralizada de categorías

const SERVICE_CATEGORIES = [
  {
    value: 'ambientacion',
    label: 'Ambientación',
    description: 'Consejos y recomendaciones para mejorar el entorno',
  },
  {
    value: 'estandares',
    label: 'Estándares',
    description: 'Guías para seguir estándares de desarrollo cells',
  },
  {
    value: 'Documentacion',
    label: 'Documentación',
    description: 'Guías y referencias sobre el uso de las herramientas y servicios',
  },
  {
    value: 'Video',
    label: 'Video',
    description: 'Recursos y tutoriales en formato de video',
  },
];

// Función para generar opciones del select en el dashboard
function generateCategoryOptions() {
  return SERVICE_CATEGORIES.map((category) => `<option value="${category.value}">${category.label}</option>`).join('');
}

// Función para generar botones de filtro en services
function generateCategoryFilters() {
  const allButton = '<button class="btn btn-outline-primary active" onclick="filterServicesByCategory(\'all\')">Todos</button>';
  const categoryButtons = SERVICE_CATEGORIES.map((category) => `<button class="btn btn-outline-primary" onclick="filterServicesByCategory('${category.value}')">${category.label}</button>`).join('');

  return allButton + categoryButtons;
}

// Función para renderizar las opciones del select
function renderCategorySelect() {
  const selectElement = document.getElementById('serviceType');
  if (selectElement) {
    // Mantener la opción por defecto
    const defaultOption = '<option value="">Selecciona tipo</option>';
    selectElement.innerHTML = defaultOption + generateCategoryOptions();
  }
}

// Función para renderizar los filtros de servicios
function renderCategoryFilters() {
  const filtersContainer = document.querySelector('.services-filters');
  if (filtersContainer) {
    filtersContainer.innerHTML = generateCategoryFilters();
  }
}

// Función para obtener todas las categorías disponibles
function getAllCategories() {
  return SERVICE_CATEGORIES;
}

// Función para obtener una categoría por su valor
function getCategoryByValue(value) {
  return SERVICE_CATEGORIES.find((category) => category.value === value);
}
