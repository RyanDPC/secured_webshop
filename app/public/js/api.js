document.addEventListener("DOMContentLoaded", () => {
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
                password_hash: formData.get("password"),
                confirmPassword: formData.get("confirmPassword"),
            };

            // Vérification des champs
            if (!data.username || !data.email || !data.password_hash || !data.confirmPassword) {
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
                    body: JSON.stringify(data
                    ),
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
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Connexion réussie !");
                    window.location.href = "/"; // Redirection vers la page principale
                } else {
                    alert(result.message || "Nom d'utilisateur ou mot de passe incorrect.");
                }
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
                alert("Impossible de se connecter. Veuillez réessayer.");
            }
        });
    }
});
