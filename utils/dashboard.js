// Convierte bloques <pre><code>...</code></pre> a bloques de código Quill
// Aplica estilos a todos los iframes de video en el HTML
function styleQuillVideos(html) {
  if (!html) return '';
  // Aplica estilos y reemplaza view?usp=drive_link por preview en src
  return html.replace(/<iframe([^>]*class=["']ql-video["'][^>]*)>/gi, function (match, attrs) {
    let newAttrs = attrs;
    // Reemplaza view?usp=drive_link por preview en src
    newAttrs = newAttrs.replace(/src=["']([^"']*?)view\?usp=drive_link([^"]*)["']/gi, function (_, url, rest) {
      return `src="${url}preview${rest}"`;
    });
    // Si ya tiene style, lo reemplaza, si no lo agrega
    if (/style=["'].*?["']/.test(newAttrs)) {
      newAttrs = newAttrs.replace(/style=["'].*?["']/, 'style="width:100%;height:500px;display:block;"');
    } else {
      newAttrs += ' style="width:100%;height:500px;display:block;"';
    }
    return `<iframe${newAttrs}>`;
  });
}
function htmlPreCodeToQuillBlocks(html) {
  if (!html) return '';
  // Reemplaza cada <pre><code class="language-xxx">...</code></pre> por bloques Quill
  return html.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, function (_, code) {
    // Divide por líneas y arma el bloque Quill
    const lines = code.replace(/\r/g, '').replace(/\n$/, '').split(/\n/);
    return '<div class="ql-code-block-container">' + lines.map((line) => `<div class="ql-code-block">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`).join('') + '</div>';
  });
}
document.addEventListener('DOMContentLoaded', function () {
  renderMenu();

  // Renderizar categorías en el select del dashboard
  if (typeof renderCategorySelect === 'function') {
    renderCategorySelect();
  }

  // Renderizar filtros de categorías en la página de servicios
  if (typeof renderCategoryFilters === 'function') {
    renderCategoryFilters();
  }

  // Renderizar servicios si estamos en la página de servicios
  if (typeof renderServices === 'function') {
    renderServices();
    // Configurar event listeners del modal después de renderizar
    if (typeof setupServiceModalListeners === 'function') {
      setupServiceModalListeners();
    }
  }

  // Renderizar lista de servicios para edición/eliminación
  if (document.getElementById('servicesList')) {
    renderServicesListPanel();
  }
  // Renderiza la lista de servicios con botones de editar y eliminar
  function renderServicesListPanel(filteredList) {
    if (!window.SERVICES_DATA) return;
    const container = document.getElementById('servicesList');
    if (!container) return;
    const list = Array.isArray(filteredList) ? filteredList : window.SERVICES_DATA;
    if (list.length === 0) {
      container.innerHTML = '<em>No hay servicios registrados.</em>';
      return;
    }
    container.innerHTML = list
      .map((service, idx) => {
        // Buscar el índice real en SERVICES_DATA para los botones
        const realIdx = window.SERVICES_DATA.indexOf(service);
        return `
      <div style=\"border:1px solid #eee; border-radius:6px; margin-bottom:10px; padding:12px; display:flex; align-items:center; gap:16px;\">
        <div style=\"width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:#f3f3f3; border-radius:50%; font-size:22px;\">
          <ion-icon name=\"${service.icon || 'document-outline'}\"></ion-icon>
        </div>
        <div style=\"flex:1;\">
          <b>${service.title}</b> <small style=\"color:#888\">(${service.category})</small><br>
          <span style=\"font-size:12px; color:#666\">${service.description || ''}</span>
        </div>
        <button class=\"btn btn-outline-primary btn-sm\" onclick=\"editServiceJson(${realIdx})\">Editar JSON</button>
        <button class=\"btn btn-outline-danger btn-sm\" onclick=\"deleteServiceJson(${realIdx})\">Eliminar</button>
      </div>
    `;
      })
      .join('');
  }

  // Filtra la lista de servicios por nombre o descripción
  window.filterServicesListPanel = function () {
    const input = document.getElementById('serviceFilterInput');
    if (!input) return;
    const value = input.value.trim().toLowerCase();
    if (!value) {
      renderServicesListPanel();
      return;
    }
    const filtered = window.SERVICES_DATA.filter((service) => (service.title && service.title.toLowerCase().includes(value)) || (service.description && service.description.toLowerCase().includes(value)));
    renderServicesListPanel(filtered);
  };

  // Muestra el JSON completo del servicio en el área de resultado para copiar/pegar
  window.editServiceJson = function (idx) {
    const service = window.SERVICES_DATA[idx];
    if (!service) return;
    // Llenar formulario
    document.getElementById('serviceTitle').value = service.title || '';
    document.getElementById('serviceDescription').value = service.description || '';
    document.getElementById('serviceIcon').value = service.icon || '';
    document.getElementById('serviceType').value = service.category || '';
    // Llenar Quill con bloques de código restaurados
    if (window.quill && service.content) {
      const htmlForQuill = htmlPreCodeToQuillBlocks(cleanQuillContent(service.content));
      window.quill.root.innerHTML = htmlForQuill;
    }
    // Guardar índice en edición
    window._editingServiceIdx = idx;
    // Cambiar botón y mostrar cancelar
    const btnText = document.getElementById('serviceFormSubmitText');
    if (btnText) btnText.textContent = 'Actualizar servicio';
    const cancelBtn = document.getElementById('serviceFormCancelBtn');
    if (cancelBtn) cancelBtn.style.display = '';
    // Abrir el acordeón del formulario si está colapsado (Bootstrap)
    const collapseEl = document.getElementById('serviceFormCollapse');
    if (collapseEl && typeof bootstrap !== 'undefined') {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
      bsCollapse.show();
    } else if (collapseEl) {
      // Fallback si Bootstrap no está disponible
      collapseEl.classList.add('show');
      collapseEl.style.display = 'block';
    }
    // Scroll al formulario
    document.getElementById('serviceForm').scrollIntoView({ behavior: 'smooth' });
  };

  // Botón cancelar edición (solo se registra una vez, fuera de cualquier otra función)
  window.addEventListener('DOMContentLoaded', function () {
    const cancelBtn = document.getElementById('serviceFormCancelBtn');
    if (cancelBtn) {
      cancelBtn.onclick = function () {
        // Limpiar modo edición
        delete window._editingServiceIdx;
        document.getElementById('serviceForm').reset();
        if (window.quill) window.quill.setContents([]);
        const btnText = document.getElementById('serviceFormSubmitText');
        if (btnText) btnText.textContent = 'Agregar servicio';
        cancelBtn.style.display = 'none';
        // Recargar el listado desde window.SERVICES_DATA para evitar que queden cambios pegados
        renderServicesListPanel();
      };
    }
  });

  // Elimina el servicio de la lista visual (no del archivo real)
  window.deleteServiceJson = function (idx) {
    if (!window.SERVICES_DATA) return;
    if (!confirm('¿Seguro que deseas eliminar este servicio?')) return;
    window.SERVICES_DATA.splice(idx, 1);
    // Siempre restaurar el formulario a su estado inicial
    delete window._editingServiceIdx;
    document.getElementById('serviceForm').reset();
    if (window.quill) window.quill.setContents([]);
    const btnText = document.getElementById('serviceFormSubmitText');
    if (btnText) btnText.textContent = 'Agregar servicio';
    const cancelBtn = document.getElementById('serviceFormCancelBtn');
    if (cancelBtn) cancelBtn.style.display = 'none';
    renderServicesListPanel();
    // Mostrar el contenido completo del archivo actualizado
    const resultDiv = document.getElementById('serviceResult');
    const codeTextarea = document.getElementById('serviceCode');
    if (resultDiv && codeTextarea) {
      const header = '// services-data-list.js - Solo los datos de servicios\n\nwindow.SERVICES_DATA = ';
      const data = JSON.stringify(window.SERVICES_DATA, null, 2);
      codeTextarea.value = `${header}${data};`;
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Solo configurar Highlight.js si está disponible
  if (typeof hljs !== 'undefined') {
    hljs.configure({
      languages: ['javascript', 'python', 'html', 'css', 'java', 'php', 'sql'],
    });
  }

  // Solo inicializar Quill si el elemento existe y Quill está disponible
  let quill = null;
  const quillElement = document.getElementById('quillEditor');
  if (quillElement && typeof Quill !== 'undefined') {
    quill = new Quill('#quillEditor', {
      theme: 'snow',
      placeholder: 'Escribe algo increíble...',
      modules: {
        syntax: {
          highlight: (text) => hljs.highlightAuto(text).value,
        },
        toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], [{ font: [] }], [{ size: ['small', false, 'large', 'huge'] }], ['bold', 'italic', 'underline', 'strike'], [{ color: [] }, { background: [] }], [{ script: 'sub' }, { script: 'super' }], [{ list: 'ordered' }, { list: 'bullet' }], [{ indent: '-1' }, { indent: '+1' }], [{ align: [] }], ['link', 'image', 'video'], ['code-block'], ['clean']],
      },
    });
    window.quill = quill;
  }

  // Solo configurar el formulario si existe
  const serviceForm = document.getElementById('serviceForm');
  if (serviceForm && quill) {
    serviceForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Limpiar el contenido de Quill antes de guardarlo y aplicar estilos a videos
      let cleanContent = cleanQuillContent(quill.root.innerHTML);
      cleanContent = styleQuillVideos(cleanContent);

      const formData = {
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value,
        icon: document.getElementById('serviceIcon').value,
        type: document.getElementById('serviceType').value,
        content: cleanContent,
      };

      // Si estamos editando, actualizamos el servicio existente
      if (typeof window._editingServiceIdx === 'number') {
        const idx = window._editingServiceIdx;
        const service = window.SERVICES_DATA[idx];
        if (service) {
          service.title = formData.title;
          service.description = formData.description;
          service.icon = formData.icon;
          service.category = formData.type;
          service.content = formData.content;
          // No cambiamos id, linkIcon ni createdAt
          renderServicesListPanel();
          // Limpiar modo edición
          delete window._editingServiceIdx;
          const btnText = document.getElementById('serviceFormSubmitText');
          if (btnText) btnText.textContent = 'Agregar servicio';
          const cancelBtn = document.getElementById('serviceFormCancelBtn');
          if (cancelBtn) cancelBtn.style.display = 'none';
          // Mostrar el contenido completo del archivo actualizado
          const resultDiv = document.getElementById('serviceResult');
          const codeTextarea = document.getElementById('serviceCode');
          if (resultDiv && codeTextarea) {
            const header = '// services-data-list.js - Solo los datos de servicios\n\nwindow.SERVICES_DATA = ';
            const data = JSON.stringify(window.SERVICES_DATA, null, 2);
            codeTextarea.value = `${header}${data};`;
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        // Agregar el servicio a la lista si la función está disponible
        if (typeof addNewService === 'function') {
          const newService = addNewService(formData);
          // También agregar a window.SERVICES_DATA para sincronizar el dashboard y el JSON exportado
          if (window.SERVICES_DATA) window.SERVICES_DATA.push(newService);
          renderServicesListPanel();
          // Mostrar solo el objeto recién agregado
          const resultDiv = document.getElementById('serviceResult');
          const codeTextarea = document.getElementById('serviceCode');
          if (resultDiv && codeTextarea) {
            const data = JSON.stringify(newService, null, 2);
            codeTextarea.value = `${data}`;
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          alert('Servicio agregado correctamente!');
        }
      }

      serviceForm.reset();
      quill.setContents([]);
    });
  }

  // Configurar event listeners del menú después de renderizarlo
  setupMenuEventListeners();
});

// Función para configurar los event listeners del menú
function setupMenuEventListeners() {
  const menuItems = document.querySelectorAll('.sidebar-menu-item');

  menuItems.forEach((item) => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      // Remover clase active de todos los items
      document.querySelectorAll('.sidebar-menu-item').forEach((menuItem) => {
        menuItem.classList.remove('active');
      });

      // Agregar clase active al item clickeado
      this.classList.add('active');

      // Obtener el archivo desde el atributo data-file
      const targetFile = this.getAttribute('data-file');

      // Redirigir al archivo correspondiente
      navigateToPage(targetFile);
    });
  });
}

// Función para navegar entre páginas - COMPLETAMENTE AUTOMÁTICA
function navigateToPage(targetFile) {
  if (!targetFile) {
    return;
  }

  // Verificar si estamos en la misma página
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

  if (currentPage !== targetFile) {
    window.location.href = targetFile;
  }
}

// Función para mostrar el código del servicio para copiar
function showServiceCodeToCopy(newService) {
  const serviceCode = generateServiceCode(newService);

  // Mostrar el área de resultado
  const resultDiv = document.getElementById('serviceResult');
  const codeTextarea = document.getElementById('serviceCode');

  if (resultDiv && codeTextarea) {
    codeTextarea.value = serviceCode;
    resultDiv.style.display = 'block';

    // Scroll al resultado
    resultDiv.scrollIntoView({ behavior: 'smooth' });
  }
}

// Función para generar el código del servicio individual
function generateServiceCode(service) {
  return `  {
    id: '${service.id}',
    title: '${service.title}',
    description: '${service.description}',
    icon: '${service.icon}',
    linkIcon: '${service.linkIcon}',
    category: '${service.category}',
    content: ${JSON.stringify(service.content)},
    createdAt: '${service.createdAt}'
  },`;
}

// Función para copiar el código al clipboard
function copyServiceCode() {
  const codeTextarea = document.getElementById('serviceCode');
  if (codeTextarea) {
    codeTextarea.select();
    codeTextarea.setSelectionRange(0, 99999); // Para móviles

    try {
      document.execCommand('copy');

      // Cambiar temporalmente el botón para mostrar éxito
      const copyBtn = event.target.closest('button');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> ¡Copiado!';
      copyBtn.classList.remove('btn-success');
      copyBtn.classList.add('btn-success');

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      alert('No se pudo copiar automáticamente. Selecciona el texto y copia manualmente (Ctrl+C).');
    }
  }
}

// Función para ocultar el área de resultado
function hideServiceResult() {
  const resultDiv = document.getElementById('serviceResult');
  if (resultDiv) {
    resultDiv.style.display = 'none';
  }
}

// Función para limpiar el contenido de Quill de elementos internos no deseados
function cleanQuillContent(htmlContent) {
  // Reemplazar <p><br></p> por <br> antes de procesar el HTML
  let filteredHtml = htmlContent;
  if (typeof filteredHtml === 'string') {
    filteredHtml = filteredHtml.replace(/<p><br\s*\/?><\/p>/gi, '');
  }
  // Crear un elemento temporal para manipular el HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = filteredHtml;

  // Remover elementos de UI de Quill que no deben aparecer en el contenido final
  const elementsToRemove = ['.ql-ui', '.ql-clipboard', 'select.ql-ui'];

  elementsToRemove.forEach((selector) => {
    const elements = tempDiv.querySelectorAll(selector);
    elements.forEach((element) => element.remove());
  });

  // Limpiar atributos innecesarios de Quill
  const codeBlocks = tempDiv.querySelectorAll('.ql-code-block');
  codeBlocks.forEach((block) => {
    // Mantener solo el contenido del bloque de código
    const language = block.getAttribute('data-language') || 'plain';
    const content = block.textContent || block.innerText;

    // Reemplazar con un elemento pre más limpio
    const preElement = document.createElement('pre');
    const codeElement = document.createElement('code');
    codeElement.className = `language-${language}`;
    codeElement.textContent = content;
    preElement.appendChild(codeElement);

    block.parentNode.replaceChild(preElement, block);
  });

  // Limpiar contenedores de código de Quill
  const codeContainers = tempDiv.querySelectorAll('.ql-code-block-container');
  codeContainers.forEach((container) => {
    // Extraer solo los bloques de código y remover el contenedor
    const codeBlocks = container.querySelectorAll('pre');
    codeBlocks.forEach((block) => {
      container.parentNode.insertBefore(block, container);
    });
    container.remove();
  });

  // Unir múltiples bloques <pre><code>...</code></pre> consecutivos en uno solo
  // Esto solo afecta si hay varios bloques seguidos (como los generados por Quill)
  let html = tempDiv.innerHTML;
  html = html.replace(/(<pre><code[^>]*>)([\s\S]*?)(<\/code><\/pre>)(\s*<pre><code[^>]*>)/g, function (match, p1, p2, p3, p4) {
    // Unir el contenido de los bloques
    // NOTA: Esto solo une dos bloques consecutivos, por lo que se debe repetir hasta que no haya más coincidencias
    return match.replace(/<\/code><\/pre>\s*<pre><code[^>]*>/g, '\n');
  });
  // Repetir hasta que no haya más bloques consecutivos
  while (/<pre><code[^>]*>[\s\S]*?<\/code><\/pre>\s*<pre><code[^>]*>/.test(html)) {
    html = html.replace(/(<pre><code[^>]*>)([\s\S]*?)(<\/code><\/pre>)(\s*<pre><code[^>]*>)/g, function (match, p1, p2, p3, p4) {
      return match.replace(/<\/code><\/pre>\s*<pre><code[^>]*>/g, '\n');
    });
  }
  return html;
}
