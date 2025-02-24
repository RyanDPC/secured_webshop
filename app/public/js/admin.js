import { fetchData } from "./api.js";

async function loadUsers() {
  try {
    const usersSelect = document.getElementById("users-select");
    const usersContainer = document.getElementById("users-list");

    const response = await fetchData("/api/admin/users");

    if (!response.success) {
      throw new Error(response.message);
    }

    // Vider la liste actuelle
    usersSelect.innerHTML =
      '<option value="">Sélectionnez un utilisateur</option>';

    // Ajouter les utilisateurs à la liste déroulante
    response.users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.username;
      usersSelect.appendChild(option);
    });

    // Afficher le container
    usersContainer.style.display = "block";
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
    alert("Erreur lors du chargement des utilisateurs");
  }
}

function viewUserProfile() {
  const select = document.getElementById("users-select");
  const userId = select.value;

  if (!userId) {
    alert("Veuillez sélectionner un utilisateur");
    return;
  }

  // Rediriger vers le profil de l'utilisateur
  window.location.href = `/admin/users/${userId}`;
}

// Rendre les fonctions disponibles globalement
window.loadUsers = loadUsers;
window.viewUserProfile = viewUserProfile;
