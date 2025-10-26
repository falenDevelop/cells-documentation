
# cells-documentation

## Descripción

Este proyecto es un panel/documentador para el framework Cell, pensado para crear, mantener y visualizar documentación técnica, guías y ejemplos de servicios de manera estructurada y visual. Incluye un dashboard para agregar servicios, un listado de servicios y utilidades para la gestión de categorías, iconos y estilos.

---

## Estructura del proyecto

```
cells-documentation/
├── index.html                # Dashboard principal para agregar/editar servicios
├── services.html             # Visualización de todos los servicios documentados
├── utils/
│   ├── categories.js         # Configuración y utilidades de categorías de servicios
│   ├── dashboard.js          # Lógica principal del dashboard y edición de servicios
│   ├── icon-selector.js      # Selector y utilidades de iconos (Ionicons)
│   ├── icon-selector.css     # Estilos para el selector de iconos
│   ├── menu.js               # Configuración y renderizado del menú lateral
│   ├── services-data-list.js # Datos de los servicios documentados (JSON)
│   ├── services-data.js      # Lógica para mostrar y manipular servicios
│   └── styles.css            # Estilos generales del dashboard y servicios
└── README.md                 # Este archivo
```

---

## Instalación y uso

1. **Clona el repositorio**
	```sh
	git clone <url-del-repo>
	cd cells-documentation
	```

2. **Abre `index.html` en tu navegador**
	- No requiere servidor backend ni instalación de dependencias.
	- Todo funciona en el navegador (HTML, CSS, JS puro).

3. **Agrega o edita servicios desde el dashboard**
	- El dashboard permite crear nuevos servicios, editarlos y ver el listado actual.
	- El código generado para cada servicio debe copiarse y pegarse en `utils/services-data-list.js`.

4. **Visualiza los servicios en `services.html`**
	- Muestra todos los servicios documentados, filtrables por categoría.

---

## Explicación de archivos principales

### index.html
Panel principal para agregar, editar y listar servicios. Incluye un editor Quill para el contenido, selectores de icono y categoría, y muestra el código JSON a copiar.

### services.html
Página de visualización de todos los servicios documentados, con filtros por categoría y tarjetas de detalle.

### utils/categories.js
Define las categorías disponibles para los servicios y utilidades para renderizar selectores y filtros.

### utils/dashboard.js
Contiene la lógica para el dashboard: renderizado de formularios, edición, eliminación y listado de servicios.

### utils/icon-selector.js
Proporciona la lista de iconos disponibles (Ionicons) y utilidades para validar, buscar y renderizar iconos en los formularios.

### utils/icon-selector.css
Estilos específicos para el selector de iconos y su vista previa.

### utils/menu.js
Configura y renderiza el menú lateral (sidebar) para navegar entre el dashboard y la vista de servicios.

### utils/services-data-list.js
Archivo donde se almacena el array `window.SERVICES_DATA` con todos los servicios documentados. Cada servicio es un objeto con:
  - `id`: identificador único
  - `title`: título del servicio
  - `description`: breve descripción
  - `icon`: nombre del icono (Ionicon)
  - `linkIcon`: icono para el enlace
  - `category`: categoría del servicio
  - `content`: HTML con la documentación
  - `createdAt`: fecha de creación

### utils/services-data.js
Lógica para inicializar, renderizar y manipular la lista de servicios en la vista de usuario. Incluye funciones para agregar, filtrar y mostrar detalles de servicios.

### utils/styles.css
Estilos generales para el dashboard, sidebar, tarjetas, formularios y componentes visuales.

---

## ¿Cómo agregar un nuevo servicio?

1. Ve a `index.html` y llena el formulario con los datos del nuevo servicio.
2. Al guardar, copia el código generado en el área de resultado.
3. Pega ese código ANTES del último `]` en `utils/services-data-list.js`.
4. Guarda el archivo y recarga la página para ver el nuevo servicio.

---

## Personalización

- **Categorías**: Edita `utils/categories.js` para agregar, quitar o modificar categorías.
- **Iconos**: Edita `utils/icon-selector.js` para agregar más iconos disponibles.
- **Estilos**: Modifica `utils/styles.css` e `utils/icon-selector.css` para personalizar la apariencia.

---

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix:
	```sh
	git checkout -b mi-feature
	```
3. Realiza tus cambios y haz commit.
4. Envía un Pull Request con una descripción clara de tu aporte.

---

## Créditos y dependencias

- [Quill.js](https://quilljs.com/) para el editor de texto enriquecido.
- [Bootstrap 5](https://getbootstrap.com/) para estilos y componentes.
- [Ionicons](https://ionic.io/ionicons) para iconos.
- [Highlight.js](https://highlightjs.org/) para resaltado de código.

---

## Licencia

MIT
