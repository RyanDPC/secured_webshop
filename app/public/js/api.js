// Fonction pour effectuer une requête POST
export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`, // Utilisation du token si l'utilisateur est authentifié
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la requête POST");
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

// Fonction pour sauvegarder un token
export const setToken = (token) => {
    document.cookie = `Token=${token}; path=/; secure; SameSite=Strict`;
    localStorage.setItem('Token', token);

};

// Fonction pour récupérer un token
export const getToken = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("accessToken="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  } else if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('Token');
  }
  return null;
};

// Fonction pour supprimer un token
export const removeToken = () => {
  if (typeof document !== 'undefined') {
    document.cookie = "Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Strict";
  } else if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('Token');
  }
};

// Fonction pour vérifier si un utilisateur est authentifié
export const isAuthenticated = () => {
  return !!getToken();
};
