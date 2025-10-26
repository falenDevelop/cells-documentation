// menu.js - Configuración del menú del sidebar

const MENU_ITEMS = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'home-outline',
    file: 'admin.html', // Nombre del archivo HTML
    active: true,
  },
  {
    id: 'services',
    name: 'Servicios',
    icon: 'grid-outline',
    file: 'index.html', // Nombre del archivo HTML
    active: false,
  },
];

// Función para generar el HTML del menú
function generateMenuHTML() {
  return MENU_ITEMS.map(
    (item) => `
    <a href="#" class="sidebar-menu-item${item.active ? ' active' : ''}" data-file="${item.file}">
      <ion-icon name="${item.icon}"></ion-icon>
      <span>${item.name}</span>
    </a>
  `
  ).join('');
}

// Función para renderizar el menú en el DOM
function renderMenu() {
  const menuContainer = document.querySelector('.sidebar-menu');
  if (menuContainer) {
    // Actualizar el estado activo basado en la página actual
    updateActiveMenuItem();
    menuContainer.innerHTML = generateMenuHTML();
  }
}

// Función para actualizar qué elemento del menú está activo
function updateActiveMenuItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

  MENU_ITEMS.forEach((item) => {
    item.active = false; // Reset todos
  });

  // Buscar automáticamente el elemento que coincida con la página actual
  const activeItem = MENU_ITEMS.find((item) => item.file === currentPage);
  if (activeItem) {
    activeItem.active = true;
  } else {
    // Si no se encuentra, activar dashboard por defecto
    const defaultItem = MENU_ITEMS.find((item) => item.id === 'dashboard');
    if (defaultItem) {
      defaultItem.active = true;
    }
  }
}
