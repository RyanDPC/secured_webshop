// Fonction pour effectuer une requête POST
export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la requête");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur dans la requête POST:", error);
    throw error;
  }
};

// Fonction pour effectuer une requête GET
export const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`, // Utilisation du token si l'utilisateur est authentifié
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la requête GET");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur dans la requête GET:", error);
    throw error;
  }
};

// Fonction pour sauvegarder un token dans le localStorage
export const setToken = (token) => {
  document.cookie = `accessToken=${token}; path=/; secure; SameSite=Strict`;
};

// Fonction pour récupérer un token depuis le localStorage
export const getToken = () => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith("accessToken="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Fonction pour supprimer un token du localStorage
export const removeToken = () => {
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
};

// Fonction pour vérifier si un utilisateur est authentifié
export const isAuthenticated = () => {
  return !!getToken();
};
