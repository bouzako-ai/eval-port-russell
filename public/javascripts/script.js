/**
 * @file Script côté client pour la gestion des formulaires et de l'authentification.
 */

/**
 * Transforme les champs d'un formulaire en objet JavaScript.
 * Les champs laissés vides sont ignorés (utile pour les modifications partielles).
 *
 * @param {HTMLFormElement} form Le formulaire à lire.
 * @returns {Object} Les données du formulaire.
 */
function formToObject(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (value !== "") {
      data[key] = value;
    }
  });
  return data;
}

/**
 * Affiche un message d'erreur.
 *
 * @param {HTMLFormElement} form Le formulaire concerné.
 * @param {string} text Le message à afficher.
 */
function showError(form, text) {
  const zone = form.querySelector(".message");
  if (!zone) {
    alert(text);
    return;
  }
  zone.textContent = text;
  zone.className = "message error";
}

// Chaque formulaire qui possède un attribut data-api est envoyé à l'API.
document.querySelectorAll("form[data-api]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.dataset.confirm && !confirm(form.dataset.confirm)) {
      return;
    }

    const method = form.dataset.method || "POST";
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (method !== "DELETE") {
      options.body = JSON.stringify(formToObject(form));
    }

    try {
      const response = await fetch(form.dataset.api, options);
      const result = await response.json();

      if (!response.ok) {
        showError(form, result.message || "Une erreur est survenue");
        return;
      }

      if (form.dataset.redirect) {
        window.location.href = form.dataset.redirect;
      } else {
        window.location.reload();
      }
    } catch (error) {
      showError(form, "Impossible de contacter le serveur");
    }
  });
});

// Renvoie vers la page d'accueil après la déconnexion.
const logoutLink = document.querySelector("[data-logout]");
if (logoutLink) {
  logoutLink.addEventListener("click", async (event) => {
    event.preventDefault();
    await fetch("/logout");
    window.location.href = "/";
  });
}
