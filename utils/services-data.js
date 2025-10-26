// services-data.js - Configuración de servicios

// Inicializar la lista de servicios desde el archivo de datos
let SERVICES_LIST = [];

// Función para inicializar los servicios
function initializeServices() {
  if (window.SERVICES_DATA) {
    SERVICES_LIST.length = 0; // Limpiar array
    SERVICES_LIST.push(...window.SERVICES_DATA);
  } else {
    console.warn(
      'SERVICES_DATA no está disponible, se requiere services-data-list.js'
    );
  }
}

// Función para generar el HTML de las tarjetas de servicios
function generateServicesHTML() {
  return SERVICES_LIST.map((service) => {
    // Validar y corregir el icono si es necesario
    const validIcon =
      typeof getValidIconOrDefault === 'function'
        ? getValidIconOrDefault(service.icon)
        : service.icon || 'document-outline';

    return `
    <div class="service-card" data-category="${service.category}">
      <div class="service-icon">
        <ion-icon name="${validIcon}"></ion-icon>
      </div>
      <h3 class="service-title">${service.title}</h3>
      <p class="service-description">${
        service.description || 'Sin descripción'
      }</p>
      <a class="service-link" onclick="showServiceModal('${service.id}')">
        ver detalle
        <ion-icon name="arrow-forward-outline"></ion-icon>
      </a>
    </div>
  `;
  }).join('');
}

// Función para agregar un nuevo servicio
function addNewService(serviceData) {
  // Validar y corregir el icono si es necesario
  const validIcon =
    typeof getValidIconOrDefault === 'function'
      ? getValidIconOrDefault(serviceData.icon, 'document-outline')
      : serviceData.icon || 'document-outline';

  const newService = {
    id: generateServiceId(serviceData.title),
    title: serviceData.title,
    description:
      serviceData.description || extractDescription(serviceData.content),
    icon: validIcon,
    linkIcon: 'arrow-forward-outline',
    category: serviceData.type,
    content: serviceData.content,
    createdAt: new Date().toISOString(),
  };

  // Agregar al array en memoria
  SERVICES_LIST.push(newService);

  // Re-renderizar si estamos en la página de servicios
  if (typeof renderServices === 'function') {
    renderServices();
    setupServiceModalListeners(); // Re-configurar event listeners
  }

  return newService;
}

// Función para generar ID único basado en el título
function generateServiceId(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now()
  );
}

// Función para extraer descripción del contenido HTML
function extractDescription(htmlContent) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  return (
    textContent.substring(0, 120) + (textContent.length > 120 ? '...' : '')
  );
}

// Función para obtener un servicio por ID
function getServiceById(id) {
  return SERVICES_LIST.find((service) => service.id === id);
}

// Función para renderizar los servicios en el DOM
function renderServices() {
  // Inicializar servicios si no están cargados
  if (SERVICES_LIST.length === 0) {
    initializeServices();
  }

  const servicesContainer = document.querySelector('.cards-grid');
  if (servicesContainer) {
    servicesContainer.innerHTML = generateServicesHTML();
  }
}

// Función para filtrar servicios por categoría
function filterServicesByCategory(category = 'all') {
  const serviceCards = document.querySelectorAll('.service-card');
  const filterButtons = document.querySelectorAll('.services-filters .btn');

  // Actualizar estado activo de los botones
  filterButtons.forEach((btn) => {
    btn.classList.remove('active');
  });

  // Agregar clase activa al botón clickeado
  event?.target?.classList.add('active');

  // Filtrar tarjetas
  serviceCards.forEach((card) => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  // Si no hay event (llamada programática), activar el botón correspondiente
  if (!event) {
    const activeBtn = Array.from(filterButtons).find(
      (btn) =>
        (category === 'all' && btn.textContent === 'Todos') ||
        btn.getAttribute('onclick')?.includes(`'${category}'`)
    );
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }
}

// Función para mostrar el modal con detalles del servicio
function showServiceModal(serviceId) {
  const service = getServiceById(serviceId);
  if (!service) {
    console.error('Servicio no encontrado:', serviceId);
    return;
  }

  // Crear o actualizar el modal
  createServiceModal(service);

  // Mostrar el modal
  try {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(
        document.getElementById('serviceDetailModal')
      );
      modal.show();
    } else {
      // Fallback si Bootstrap no está disponible
      const modalElement = document.getElementById('serviceDetailModal');
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
      document.body.classList.add('modal-open');

      // Crear backdrop manualmente
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.onclick = () => hideServiceModal();
      document.body.appendChild(backdrop);
    }
  } catch (error) {
    console.error('Error al mostrar modal:', error);
    alert(`${service.title}\n\n${service.description || service.content}`);
  }
}

// Función para ocultar el modal manualmente (fallback)
function hideServiceModal() {
  const modalElement = document.getElementById('serviceDetailModal');
  if (modalElement) {
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
    document.body.classList.remove('modal-open');

    // Remover backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}

// Función para crear el modal HTML
function createServiceModal(service) {
  // Validar y corregir el icono si es necesario
  const validIcon =
    typeof getValidIconOrDefault === 'function'
      ? getValidIconOrDefault(service.icon)
      : service.icon || 'document-outline';

  // Verificar si ya existe el modal
  let modal = document.getElementById('serviceDetailModal');

  if (!modal) {
    // Crear el modal si no existe
    modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'serviceDetailModal';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <div class="d-flex align-items-center">
              <div class="service-modal-icon me-3">
                <ion-icon name="${validIcon}"></ion-icon>
              </div>
              <h5 class="modal-title" id="serviceModalTitle">${
                service.title
              }</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="hideServiceModal()"></button>
          </div>
          <div class="modal-body">
            <div id="serviceModalContent">${
              typeof service.content === 'string' &&
              service.content.trim() !== ''
                ? service.content
                : `<em>Sin contenido</em>`
            }</div>
          </div>
          <div class="modal-footer">
            <small class="text-muted">
              Creado: ${
                service.createdAt
                  ? new Date(service.createdAt).toLocaleDateString()
                  : 'Fecha no disponible'
              }
            </small>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="hideServiceModal()">Cerrar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    // Actualizar contenido del modal existente
    modal.querySelector('#serviceModalTitle').textContent = service.title;
    modal.querySelector('#serviceModalContent').innerHTML =
      typeof service.content === 'string' && service.content.trim() !== ''
        ? service.content
        : `<em>Sin contenido</em>`;
    modal
      .querySelector('.service-modal-icon ion-icon')
      .setAttribute('name', validIcon);
    modal.querySelector('.text-muted').textContent = `Creado: ${
      service.createdAt
        ? new Date(service.createdAt).toLocaleDateString()
        : 'Fecha no disponible'
    }`;
  }
}

// Función para configurar event listeners de los modales
function setupServiceModalListeners() {
  // Los event listeners se configuran automáticamente via onclick en el HTML generado
  console.log('Service modal listeners configurados');
}
