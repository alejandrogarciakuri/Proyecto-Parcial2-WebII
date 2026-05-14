// URL base del backend de FastAPI
const API_URL = "http://localhost:8000";

// Endpoints
const CREATE_USER_URL = `${API_URL}/users/`;
const LOGIN_URL = `${API_URL}/login`;
const ME_URL = `${API_URL}/users/me`;

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const showUserButton = document.getElementById("showUserButton");
const userInfo = document.getElementById("userInfo");

// Crear usuario
registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const response = await fetch(CREATE_USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el usuario");
    }

    alert("Usuario creado correctamente");
    registerForm.reset();
  } catch (error) {
    console.error(error);
    alert("Hubo un fallo en la creación del usuario");
  }
});

// Iniciar sesión
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();

    alert(`Usuario Autenticado\nToken: ${data.access_token}`);
    loginForm.reset();
  } catch (error) {
    console.error(error);
    alert("Falló la autenticación");
  }
});

// Mostrar info del usuario
showUserButton.addEventListener("click", async function () {
  try {
    const response = await fetch(ME_URL, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("No autorizado");
    }

    const user = await response.json();

    userInfo.innerHTML = `
      <p><strong>Nombre:</strong> ${user.name}</p>
      <p><strong>Nombre de usuario:</strong> ${user.username}</p>
      <p><strong>Contraseña hasheada:</strong> ${user.hashed_password}</p>
    `;
  } catch (error) {
    console.error(error);
    alert("Error al mostrar la información del usuario");
  }
});
