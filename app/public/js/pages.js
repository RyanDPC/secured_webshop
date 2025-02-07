import { postData, setToken, removeToken, fetchData } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // Gérer le formulaire de connexion
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêcher la soumission classique du formulaire

      const data = {
        username: loginForm.username.value,
        password: loginForm.password.value,
      };

      if (!data.username || !data.password) {
        return alert("Tous les champs doivent être remplis.");
      }

      try {
        console.log("Données de connexion :", data);
        const result = await postData("/api/users/login", data);
        console.log("Réponse de l'API :", result);

        if (result.message) {
          alert(result.message);
          if (result.message === "Connexion réussie") {
            window.location.href = "/"; // Rediriger vers le tableau de bord après la connexion
          }
        }
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        alert("Une erreur s'est produite lors de la connexion.");
      }
    });
  }

  // Gérer le formulaire d'inscription
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêcher la soumission classique du formulaire

      const data = {
        username: signupForm.username.value,
        email: signupForm.email.value,
        password: signupForm.password.value,
        confirmPassword: signupForm.confirmPassword.value,
      };

      if (
        !data.username ||
        !data.email ||
        !data.password ||
        !data.confirmPassword
      ) {
        return alert("Tous les champs doivent être remplis.");
      }

      if (data.password !== data.confirmPassword) {
        return alert("Les mots de passe ne correspondent pas.");
      }

      try {
        console.log("Données d'inscription :", data);
        const result = await postData("/api/users/register", data);
        console.log("Réponse de l'API :", result);

        if (result.message) {
          alert(result.message);
          if (result.message === "Utilisateur créé avec succès") {
            window.location.href = "/login"; // Rediriger vers la page de connexion après l'inscription
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        alert("Une erreur s'est produite lors de l'inscription.");
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
});
