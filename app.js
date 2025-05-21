const contenedorProductos = document.getElementById("productos");

// let productos = []; // Inicializar el array de productos
// let categoriaSeleccionada = "all"; // Inicializar la categoría seleccionada como "all"
const inputBuscador = document.getElementById("buscador"); // Obtener el input del buscador
const contenedorCategorias = document.getElementById("categorias"); // Obtener el contenedor de categorías

// logica de login

document.addEventListener("DOMContentLoaded", () => {
  // Redireccionar si no hay token y no estamos en login
  if (!localStorage.getItem("token") && window.location.pathname.includes("index.html")) {
    window.location.href = "login.html";
  }

  // Mostrar botón de logout si existe
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn && localStorage.getItem("token")) {
    logoutBtn.classList.remove("hidden");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }



  const loginform = document.getElementById("loginForm");
  // si existe la variable loginform haz esto
  if (loginform) {
    loginform.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevenir el comportamiento por defecto del formulario no hacer que se recargue la página

      const username = document.getElementById("username").value; // Obtener el valor del campo de username
      const password = document.getElementById("password").value; // Obtener el valor del campo de password
      const mensaje = document.getElementById("mensaje");

      try {
        const response = await fetch("https://fakestoreapi.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }), // Enviar los datos como JSON
        });

        if (!response.ok) {
          throw new Error("Error en la response de la API");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        mensaje.textContent = "Inicio de sesión exitoso";
        mensaje.classList.add("text-green-500");

        setTimeout(() => {
          window.location.href = "index.html"; // Redirigir a la página principal
        }, 1500);
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensaje.textContent =
          "Error al iniciar sesión. Verifica tus credenciales.";
        mensaje.classList.add("text-red-500");
      }
    }); // Aquí faltaba cerrar el paréntesis del addEventListener
  }
  if (contenedorProductos && contenedorCategorias && inputBuscador) {
    // Si los elementos existen, se ejecuta la lógica de productos
    cargarProductos();
    cargarCategorias();

    //Agregar evento de búsqueda
    inputBuscador.addEventListener("input", filtrarProductos);
  }
});

// Función para cargar productos desde la API
async function cargarProductos() {
  try {
    const respuesta = await fetch("https://fakestoreapi.com/products");

    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    productos = await respuesta.json(); // Convertir la respuesta a JSON

    if (productos.length === 0) {
      console.log("No se encontraron productos");
    } else {
      mostrarProductos(productos); // Mostrar los productos
      const categorias = ["all", ...new Set(productos.map((p) => p.category))];
      mostrarCategorias(categorias); // Mostrar las categorías
    }
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Función para cargar y mostrar las categorías
async function cargarCategorias() {
  try {
    const respuesta = await fetch(
      "https://fakestoreapi.com/products/categories"
    );

    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const categorias = await respuesta.json();
    mostrarCategorias(["all", ...categorias]);
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

function mostrarCategorias(categorias) {
  contenedorCategorias.innerHTML = ""; // Limpiar el contenedor de categorías

  categorias.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent =
      cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.className = `px-4 py-2 rounded-full ${
      categoriaSeleccionada === cat
        ? "bg-blue-500 text-white"
        : "bg-blue-200 text-blue-800"
    } hover:bg-blue-300 rounded-lg shadow-md transition-colors duration-300`;

    btn.addEventListener("click", () => {
      categoriaSeleccionada = cat; // Actualizar la categoría seleccionada
      filtrarProductos(); // Filtrar los productos según la categoría seleccionada
      mostrarCategorias(categorias); // Actualizar las categorías
    });

    contenedorCategorias.appendChild(btn); // Agregar el botón de categoría al contenedor
  });
}

// Función para filtrar productos por categoría y texto del buscador
function filtrarProductos() {
  let pFiltrados = productos; // Inicializar el array filtrado con todos los productos

  if (categoriaSeleccionada !== "all") {
    pFiltrados = productos.filter(
      (producto) => producto.category === categoriaSeleccionada
    );
  }

  const text = inputBuscador.value.toLowerCase(); // Obtener el texto del buscador en minúsculas
  if (text.trim() !== "") {
    pFiltrados = pFiltrados.filter(
      (p) =>
        p.title.toLowerCase().includes(text) || // Filtrar por título
        p.description.toLowerCase().includes(text) // Filtrar por descripción
    );
  }

  mostrarProductos(pFiltrados); // Mostrar los productos filtrados
}

// Función para mostrar los productos en el contenedor
function mostrarProductos(productos) {
  contenedorProductos.innerHTML = "";

  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.className =
      "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition duration-300 cursor-pointer hover:scale-105 border-2 border-blue-400";

    // Descripción oculta por defecto
    productoDiv.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-contain mb-4">
      <h3 class="text-lg font-bold text-gray-800 mb-2">${producto.title}</h3>
      <span class="text-blue-500 font-semibold mb-2">$${producto.price.toFixed(2)}</span>
      <button class="more-btn bg-blue-500 text-white px-3 py-1 rounded mb-2">More</button>
      <p class="descripcion text-gray-600 text-sm mb-2 hidden">${producto.description}</p>
    `;

    // Lógica para mostrar/ocultar descripción
    const btnMore = productoDiv.querySelector('.more-btn');
    const descripcion = productoDiv.querySelector('.descripcion');
    btnMore.addEventListener('click', () => {
      descripcion.classList.toggle('hidden');
      btnMore.textContent = descripcion.classList.contains('hidden') ? 'More' : 'Less';
    });

    contenedorProductos.appendChild(productoDiv);
  });
}

// Evento para filtrar productos al escribir en el buscador
inputBuscador.addEventListener("input", filtrarProductos);

// Cargar los productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});
