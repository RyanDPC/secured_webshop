// Fonction pour effectuer une requête POST
export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la requête');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur dans la requête POST:', error);
    throw error;
  }
};

// Fonction pour effectuer une requête GET
export const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`, // Utilisation du token si l'utilisateur est authentifié
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la requête GET');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur dans la requête GET:', error);
    throw error;
  }
};

// Fonction pour sauvegarder un token dans le localStorage
export const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

// Fonction pour récupérer un token depuis le localStorage
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

// Fonction pour supprimer un token du localStorage
export const removeToken = () => {
  localStorage.removeItem('accessToken');
};

// Fonction pour vérifier si un utilisateur est authentifié
export const isAuthenticated = () => {
  return !!getToken();
};
