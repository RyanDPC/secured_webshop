document.addEventListener("DOMContentLoaded", () => {
  // Déclarations pour le bouton de déconnexion et l'URL de l'API
  const logoutButton = document.getElementById("logout-button");
  const apiUrl = "/api"; // Assure-toi que l'URL est correcte pour ta configuration

  // Gérer le formulaire d'inscription
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêche le comportement par défaut de soumettre le formulaire

      // Récupérer les données du formulaire d'inscription
      const formData = new FormData(signupForm);
      const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };

      // Vérification des champs
      if (
        !data.username ||
        !data.email ||
        !data.password_hash ||
        !data.confirmPassword
      ) {
        alert("Tous les champs doivent être remplis.");
        return;
      }

      if (data.password_hash !== data.confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
      // Envoi des données au serveur pour l'inscription
      try {
        const response = await fetch("/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Inscription réussie !");
          window.location.href = "/login"; // Redirection vers la page de connexion
        } else {
          alert(result.message || "Une erreur est survenue.");
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        alert("Impossible de s'inscrire. Veuillez réessayer.");
      }
    });
  }

  // Gérer le formulaire de connexion
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêche le comportement par défaut de soumettre le formulaire

      // Récupérer les données du formulaire de connexion
      const formData = new FormData(loginForm);
      const data = {
        username: formData.get("username"),
        password_hash: formData.get("password"),
      };

      // Envoi des données au serveur pour la connexion
      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Connexion réussie !");
          window.location.href = "/"; // Redirection vers la page principale
        } else {
          alert(
            result.message || "Nom d'utilisateur ou mot de passe incorrect."
          );
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Impossible de se connecter. Veuillez réessayer.");
      }
    });
  }
  // Fonction qui sera appelée lorsque l'utilisateur soumet la recherche
  const searchUsers = (event) => {
    event.preventDefault(); // Empêche l'envoi par défaut du formulaire

    // Récupère la valeur du champ de recherche
    const username = document.getElementById("users-search").value.trim();

    // Si aucun texte n'est entré dans le champ de recherche
    if (!username) {
      console.log("Veuillez entrer un nom d'utilisateur.");
      return; // Si aucun texte, on arrête l'exécution de la fonction
    }

    // Log pour vérifier ce qui est recherché
    console.log("Recherche pour l'utilisateur :", username);

    // Appel de la fonction pour effectuer la recherche
    fetchUsers(username);
  };

  // Fonction pour récupérer les utilisateurs via l'API
  async function fetchUsers(query) {
    try {
      // Log avant d'envoyer la requête
      console.log("Envoi de la requête à l'API avec le paramètre :", query);

      // Envoie la requête GET à l'API avec le paramètre de recherche
      const response = await fetch(
        `/api/users/search?username=${encodeURIComponent(query)}`
      );

      // Vérifie si la réponse est correcte
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }

      // Parse la réponse de l'API en JSON
      const data = await response.json();
      console.log("Réponse de l'API:", data); // Affiche la réponse complète de l'API

      // Si des utilisateurs sont trouvés
      if (data.users && data.users.length > 0) {
        console.log("Utilisateurs trouvés :", data.users);
        displayUsers(data.users); // Affiche les utilisateurs dans le DOM
      } else {
        console.log("Aucun utilisateur trouvé.");
        // Si aucun utilisateur n'est trouvé, on peut afficher un message dans la liste
        displayNoResults();
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error); // Affiche les erreurs
    }
  }

  // Fonction pour afficher la liste des utilisateurs dans le DOM
  function displayUsers(users) {
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = ""; // Vide la liste avant de rajouter les résultats

    // Parcours des utilisateurs et crée des éléments de liste
    users.forEach((user) => {
      const userItem = document.createElement("li");
      userItem.textContent = user.username; // Affiche le nom d'utilisateur dans chaque élément
      resultsContainer.appendChild(userItem); // Ajoute l'élément à la liste
    });
  }

  // Fonction pour afficher un message lorsqu'aucun utilisateur n'est trouvé
  function displayNoResults() {
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "<li>Aucun utilisateur trouvé.</li>";
  }

  // Ajout du gestionnaire d'événements sur le bouton de recherche
  document
    .getElementById("search-users-btn")
    .addEventListener("click", searchUsers);

  // Si vous souhaitez que la recherche soit aussi déclenchée lorsqu'un utilisateur appuie sur la touche "Entrée" dans le champ de recherche
  document
    .getElementById("users-search")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        searchUsers(event); // Recherche si "Entrée" est appuyée
      }
    });

  // Gestion de la déconnexion
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      console.log("Déconnexion en cours...");
      try {
        await authenticatedFetch(`${apiUrl}/logout`, {
          method: "POST",
          credentials: "include", // Inclure les cookies pour supprimer le refresh token côté serveur
        });
      } catch (error) {
        console.error("Erreur lors de la déconnexion : ", error);
      } finally {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        window.location.reload();
      }
    });
  }
});
