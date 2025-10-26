// icon-selector.js - Configuración y funcionalidad del selector de iconos

// Lista completa de iconos disponibles con sus descripciones
const AVAILABLE_ICONS = [
  { value: 'bulb-outline', label: 'Idea' },
  { value: 'document-text-outline', label: 'Documento' },
  { value: 'calculator-outline', label: 'Calculadora' },
  { value: 'card-outline', label: 'Tarjeta' },
  { value: 'cash-outline', label: 'Dinero' },
  { value: 'home-outline', label: 'Casa' },
  { value: 'car-outline', label: 'Auto' },
  { value: 'medical-outline', label: 'Salud' },
  { value: 'school-outline', label: 'Educación' },
  { value: 'briefcase-outline', label: 'Trabajo' },
  { value: 'heart-outline', label: 'Favorito' },
  { value: 'star-outline', label: 'Destacado' },
  { value: 'shield-outline', label: 'Seguridad' },
  { value: 'time-outline', label: 'Tiempo' },
  { value: 'calendar-outline', label: 'Calendario' },
  { value: 'call-outline', label: 'Teléfono' },
  { value: 'mail-outline', label: 'Email' },
  { value: 'location-outline', label: 'Ubicación' },
  { value: 'settings-outline', label: 'Configuración' },
  { value: 'help-circle-outline', label: 'Ayuda' },
  { value: 'information-circle-outline', label: 'Información' },
  { value: 'checkmark-circle-outline', label: 'Completado' },
  { value: 'warning-outline', label: 'Advertencia' },
  { value: 'alert-circle-outline', label: 'Alerta' },
  { value: 'trending-up-outline', label: 'Crecimiento' },
  { value: 'trending-down-outline', label: 'Descenso' },
  { value: 'pie-chart-outline', label: 'Gráfico' },
  { value: 'bar-chart-outline', label: 'Estadísticas' },
  { value: 'wallet-outline', label: 'Billetera' },
  { value: 'gift-outline', label: 'Regalo' },
  { value: 'trophy-outline', label: 'Premio' },
  { value: 'medal-outline', label: 'Medalla' },
  { value: 'rocket-outline', label: 'Rocket' },
  { value: 'flash-outline', label: 'Flash' },
  { value: 'diamond-outline', label: 'Diamante' },
  { value: 'leaf-outline', label: 'Ecológico' },
  { value: 'globe-outline', label: 'Global' },
  { value: 'people-outline', label: 'Personas' },
  { value: 'person-outline', label: 'Usuario' },
  { value: 'thumbs-up-outline', label: 'Me gusta' },
  { value: 'key-outline', label: 'Clave' },
  { value: 'lock-closed-outline', label: 'Seguro' },
  { value: 'eye-outline', label: 'Ver' },
  { value: 'download-outline', label: 'Descargar' },
  { value: 'cloud-outline', label: 'Nube' },
  { value: 'wifi-outline', label: 'WiFi' },
  { value: 'phone-portrait-outline', label: 'Móvil' },
  { value: 'desktop-outline', label: 'Desktop' },
  { value: 'tablet-portrait-outline', label: 'Tablet' },
  { value: 'camera-outline', label: 'Cámara' },
  { value: 'image-outline', label: 'Imagen' },
  { value: 'musical-notes-outline', label: 'Música' },
  { value: 'videocam-outline', label: 'Video' },
  { value: 'game-controller-outline', label: 'Juego' },
  { value: 'fitness-outline', label: 'Fitness' },
  { value: 'restaurant-outline', label: 'Restaurante' },
  { value: 'cafe-outline', label: 'Café' },
  { value: 'airplane-outline', label: 'Avión' },
  { value: 'train-outline', label: 'Tren' },
  { value: 'boat-outline', label: 'Barco' },
  { value: 'bicycle-outline', label: 'Bicicleta' },
  { value: 'walk-outline', label: 'Caminar' },
  { value: 'storefront-outline', label: 'Tienda' },
  { value: 'basket-outline', label: 'Compras' },
  { value: 'bag-outline', label: 'Bolsa' },
  { value: 'newspaper-outline', label: 'Noticias' },
  { value: 'book-outline', label: 'Libro' },
  { value: 'library-outline', label: 'Biblioteca' },
  { value: 'construct-outline', label: 'Construcción' },
  { value: 'hammer-outline', label: 'Herramienta' },
  { value: 'build-outline', label: 'Construir' },
];

// Función para validar si un icono existe en la lista
function isValidIcon(iconValue) {
  return AVAILABLE_ICONS.some((icon) => icon.value === iconValue);
}

// Función para obtener un icono por defecto si el icono no es válido
function getValidIconOrDefault(iconValue, defaultIcon = 'document-outline') {
  return isValidIcon(iconValue) ? iconValue : defaultIcon;
}

// Función para limpiar iconos inválidos de los datos
function validateAndFixIconInData(serviceData) {
  if (serviceData && serviceData.icon && !isValidIcon(serviceData.icon)) {
    console.warn(
      `⚠️ Icono inválido detectado: "${serviceData.icon}". Reemplazando por "document-outline"`
    );
    serviceData.icon = 'document-outline';
  }
  return serviceData;
}

// Función para generar las opciones del select
function generateIconOptions() {
  let optionsHTML = '<option value="">Selecciona un icono</option>';

  AVAILABLE_ICONS.forEach((icon) => {
    optionsHTML += `<option value="${icon.value}">${icon.label}</option>`;
  });

  return optionsHTML;
}

// Función para renderizar el selector de iconos
function renderIconSelector() {
  const iconSelect = document.getElementById('serviceIcon');
  if (iconSelect) {
    iconSelect.innerHTML = generateIconOptions();
  }
}

// Función para inicializar la vista previa de iconos
function initializeIconPreview() {
  const iconSelect = document.getElementById('serviceIcon');
  if (!iconSelect) return;

  const iconWrapper = iconSelect.parentElement;

  // Crear elemento para mostrar el icono
  const iconPreview = document.createElement('div');
  iconPreview.className = 'icon-preview';
  iconWrapper.style.position = 'relative';
  iconWrapper.appendChild(iconPreview);

  // Función para actualizar el icono mostrado
  function updateIconPreview() {
    const selectedValue = iconSelect.value;
    if (selectedValue) {
      iconPreview.innerHTML = `<ion-icon name="${selectedValue}"></ion-icon>`;
    } else {
      iconPreview.innerHTML = '';
    }
  }

  // Escuchar cambios en el select
  iconSelect.addEventListener('change', updateIconPreview);

  // Actualizar al cargar la página
  updateIconPreview();
}

// Función para obtener información de un icono por su valor
function getIconInfo(iconValue) {
  return AVAILABLE_ICONS.find((icon) => icon.value === iconValue);
}

// Función para buscar iconos por texto
function searchIcons(searchTerm) {
  if (!searchTerm) return AVAILABLE_ICONS;

  const term = searchTerm.toLowerCase();
  return AVAILABLE_ICONS.filter(
    (icon) =>
      icon.label.toLowerCase().includes(term) ||
      icon.value.toLowerCase().includes(term)
  );
}

// Inicialización automática cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function () {
  renderIconSelector();
  initializeIconPreview();
});
