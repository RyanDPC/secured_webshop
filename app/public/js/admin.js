import { fetchData } from './api.js';

async function viewUserProfile() {
    const searchInput = document.getElementById('users-search');
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Veuillez entrer un nom d\'utilisateur');
        return;
    }

    try {
        const response = await fetchData(`/api/admin/users?username=${encodeURIComponent(searchTerm)}`);

        if (!response.success || !response.users.length) {
            alert('Aucun utilisateur trouvé');
            return;
        }

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';

        const usersHTML = response.users.map(user => `
            <div class="user-result">
                <div class="user-info">
                    <span>${user.username}</span>
                    <span>${user.email || ''}</span>
                </div>
                <a href="/api/admin/profile/${user.id}" class="view-profile-btn">
                    Voir le profil
                </a>
            </div>
        `).join('');

        resultsContainer.innerHTML = usersHTML;

        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
        document.getElementById('users-search-bar').after(resultsContainer);

    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        alert('Une erreur est survenue lors de la recherche');
    }
}

// Add form submit handler
document.getElementById('search-users-form')?.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    viewUserProfile();
});

// Add input handler for real-time search
document.getElementById('users-search')?.addEventListener('input', (e) => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        viewUserProfile();
    }, 300); // Délai de 300ms pour éviter trop de requêtes
});