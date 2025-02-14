import { postData, removeToken, fetchData } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // Gérer le formulaire de connexion
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      // Remove any existing alerts
      const existingAlerts = loginForm.querySelectorAll('.alert');
      existingAlerts.forEach(alert => alert.remove());

      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: loginForm.username.value,
            password: loginForm.password.value
          })
        });

        const data = await response.json();

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert ${data.success ? 'alert-success' : 'alert-error'}`;
        alert.textContent = data.message;
        loginForm.insertBefore(alert, loginForm.firstChild);

        if (data.success) {
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1000);
        }
      } catch (error) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = "Une erreur est survenue lors de la connexion";
        loginForm.insertBefore(alert, loginForm.firstChild);
      }
    });
  }

  // Gérer le formulaire d'inscription
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Remove any existing error messages
      const existingError = signupForm.querySelector('.alert-error');
      if (existingError) existingError.remove();

      const data = {
        username: signupForm.username.value,
        email: signupForm.email.value,
        password: signupForm.password.value,
        confirmPassword: signupForm.confirmPassword.value,
      };

      try {
        const result = await postData("/api/users/register", data);
        
        if (!result.success) {
          // Create and display error message
          const errorDiv = document.createElement('div');
          errorDiv.className = 'alert alert-error';
          errorDiv.textContent = result.message;
          signupForm.insertBefore(errorDiv, signupForm.firstChild);
        } else {
          // Create and display success message
          const successDiv = document.createElement('div');
          successDiv.className = 'alert alert-success';
          successDiv.textContent = result.message;
          signupForm.insertBefore(successDiv, signupForm.firstChild);
          
          // Redirect after successful registration
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = "Une erreur est survenue lors de l'inscription";
        signupForm.insertBefore(errorDiv, signupForm.firstChild);
      }
    });
  }

  // Gérer la déconnexion
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      removeToken(); // Supprimer le token du localStorage lors de la déconnexion
      window.location.href = "/login"; // Rediriger vers la page de connexion
    });
  }

  // Fonction de recherche des utilisateurs
  const searchForm = document.getElementById("search-users-form");
  if (searchForm) {
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêcher la soumission du formulaire

      const query = document.getElementById("users-search").value.trim();

      if (!query) {
        return alert("Veuillez entrer un nom d'utilisateur.");
      }

      try {
        const response = await fetchData(
          `/api/users/search?username=${encodeURIComponent(query)}`
        );
        console.log("Utilisateurs trouvés :", response.users);
        // Afficher les résultats dans le DOM ou sous forme de liste
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        alert("Erreur lors de la recherche.");
      }
    });
  }
  const errorMessage = document.getElementById("error-message");
  if (errorMessage && errorMessage.dataset.error) {
      alert(errorMessage.dataset.error);
  }
});
