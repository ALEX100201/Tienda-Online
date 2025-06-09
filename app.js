const contenedorProductos = document.getElementById("productos");
const inputBuscador = document.getElementById("buscador");
const contenedorCategorias = document.getElementById("categorias");

let productos = []; // Inicializar el array de productos
let categoriaSeleccionada = "all"; // Inicializar la categoría seleccionada como "all"

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
  if (loginform) {
    loginform.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const mensaje = document.getElementById("mensaje");

      try {
        const response = await fetch("https://fakestoreapi.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error("Error en la response de la API");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        mensaje.textContent = "Inicio de sesión exitoso";
        mensaje.classList.add("text-green-500");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensaje.textContent =
          "Error al iniciar sesión. Verifica tus credenciales.";
        mensaje.classList.add("text-red-500");
      }
    });
  }

  if (contenedorProductos && contenedorCategorias && inputBuscador) {
    cargarProductos();
    inputBuscador.addEventListener("input", filtrarProductos);
  }
});

// Función para cargar productos desde la API
async function cargarProductos() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/api/productos");

    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    productos = await respuesta.json();

    // Al cargar productos:
    if (productos.length === 0) {
      console.log("No se encontraron productos");
    } else {
      mostrarProductos(productos);

      // Extraer categorías únicas
      const categoriasSet = new Set();
      productos.forEach(p => {
        if (Array.isArray(p.categorias)) {
          p.categorias.forEach(cat => categoriasSet.add(cat.nombre));
        }
      });
      const categorias = ["all", ...categoriasSet];
      mostrarCategorias(categorias);
    }
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Función para cargar y mostrar las categorías
async function cargarCategorias() {
  try {
    const respuesta = await fetch(
      "http://127.0.0.1:8000/api/productos"
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
  contenedorCategorias.innerHTML = "";

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
      categoriaSeleccionada = cat;
      filtrarProductos();
      mostrarCategorias(categorias);
    });

    contenedorCategorias.appendChild(btn);
  });
}


function filtrarProductos() {
  let pFiltrados = productos;

  // Filtrar productos por categoría seleccionada
  if (categoriaSeleccionada !== "all") {
    pFiltrados = productos.filter(
      (producto) =>
        Array.isArray(producto.categorias) &&
        producto.categorias.some(cat => cat.nombre === categoriaSeleccionada)
    );
  }

  const text = inputBuscador.value.toLowerCase();
  if (text.trim() !== "") {
    pFiltrados = pFiltrados.filter(
      (p) =>
        p.nombre.toLowerCase().includes(text) ||
        p.descripcion.toLowerCase().includes(text)
    );
  }

  mostrarProductos(pFiltrados);
}

function mostrarProductos(productos) {
  contenedorProductos.innerHTML = "";

  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.className =
      "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition duration-300 cursor-pointer hover:scale-105 border-2 border-blue-400";

    productoDiv.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.titulo}" class="w-32 h-32 object-contain mb-4">
      <h3 class="text-lg font-bold text-gray-800 mb-2">${producto.titulo}</h3>
      <span class="text-blue-500 font-semibold mb-2">$${Number(producto.precio).toFixed(2)}</span>
      <button class="more-btn bg-blue-500 text-white px-3 py-1 rounded mb-2">More</button>
      <p class="descripcion text-gray-600 text-sm mb-2 hidden">${producto.descripcion}</p>
    `;

    // Evento para ver detalle al hacer clic en la tarjeta (excepto en el botón "More")
    productoDiv.addEventListener("click", (e) => {
      if (!e.target.classList.contains("more-btn")) {
        window.location.href = `detalle.html?id=${producto.id}`;
      }
    });

    // Lógica para mostrar/ocultar descripción
    const btnMore = productoDiv.querySelector('.more-btn');
    const descripcion = productoDiv.querySelector('.descripcion');
    btnMore.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el click en el botón navegue al detalle
      descripcion.classList.toggle('hidden');
      btnMore.textContent = descripcion.classList.contains('hidden') ? 'More' : 'Less';
    });

    contenedorProductos.appendChild(productoDiv);
  });
}
