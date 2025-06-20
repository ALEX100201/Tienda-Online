# 🛒 Tienda Web - Consumo de API Propia

Este proyecto es una tienda web desarrollada para practicar la implementación de una API propia utilizando **Laravel** como backend y tecnologías como **Tailwind CSS**, **JavaScript**, y **HTML** para el frontend. También se incluye un sistema de autenticación de usuarios.

## 🚀 Tecnologías Utilizadas

- **Visual Studio Code** (Editor de código)
- **Laravel** (Framework PHP para el backend)
- **Tailwind CSS** (Framework CSS para el diseño)
- **Postman** (Herramienta para probar APIs)
- **MySQL Workbench** (Gestor de base de datos)

## 📁 Estructura del Proyecto

```
├── .vscode/                # Configuraciones de VSCode
├── imagenes/              # Imágenes usadas en la tienda
├── admin_index.html       # Interfaz del administrador
├── app.js                 # Lógica JS para consumo de la API
├── contacto.html          # Página de contacto con Google Maps API
├── detalle.html           # Página de detalle de productos
├── index.html             # Página principal de la tienda
├── login.html             # Interfaz de inicio de sesión
├── style.css              # Estilos personalizados
```

## 🧩 Funcionalidades

- ✅ Login utilizando API propia
- 🛍️ Visualización de productos
- 📍 Página de contacto integrada con Google Maps API
- 🔐 Control de acceso a panel administrativo
- 🧪 Pruebas de endpoints realizadas con Postman
- 🗃️ Base de datos gestionada con MySQL Workbench

## ⚙️ Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/nombre-repo.git
   cd nombre-repo
   ```

2. **Configurar backend (Laravel)**
   - Instala dependencias con Composer.
   - Crea el archivo `.env` y configura tu conexión a MySQL.
   - Ejecuta migraciones y servidor:
     ```bash
     php artisan migrate
     php artisan serve
     ```

3. **Probar API con Postman**
   - Importa la colección y prueba endpoints `/api/login`, `/api/products`, etc.

4. **Abrir el frontend**
   - Abre `index.html` y `login.html` con Live Server (o tu navegador).

## 📬 Contacto

Desarrollado por **Alexander Rivadeneira**  
📫 rivadeneirah39@gmail.com
