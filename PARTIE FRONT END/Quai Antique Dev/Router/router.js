import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page d'erreur 404
const error404Route = new Route("/404", "Page introuvable", "pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
    let currentRoute = null;
    // Parcours de toutes les routes pour trouver la correspondance
    allRoutes.forEach((element) => {
        if (element.url == url) {
            currentRoute = element;
        }
    });
    // Si aucune route ne correspond, retourner la route d'erreur 404
    if (currentRoute != null) {
        return currentRoute;
    } else {
        return error404Route;
    }
};

// Fonction pour charger une page en fonction de l'URL
const LoadContentPage = async () => {

    //Nettoyer les modales bootstrap au changement de page
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');

    const path = window.location.pathname;
    
    // Supprimer le préfixe du dossier du projet pour obtenir le chemin relatif
    const projectFolder = "/Projet Fil Rouge/PARTIE FRONT END/Quai Antique Dev";
    let relativePath = path;
    if (path.startsWith(projectFolder)) {
        relativePath = path.substring(projectFolder.length);
    }
    // Gérer le cas avec %20 pour les espaces
    const projectFolderEncoded = "/Projet%20Fil%20Rouge/PARTIE%20FRONT%20END/Quai%20Antique%20Dev";
    if (path.startsWith(projectFolderEncoded)) {
        relativePath = path.substring(projectFolderEncoded.length);
    }
    // Si le chemin est vide ou juste un slash, le transformer en "/"
    if (relativePath === "" || relativePath === "/") {
        relativePath = "/";
    }
    
    // Récupération de l'URL actuelle 
    const actualRoute = getRouteByUrl(relativePath);

    //Vérifier les droits d'accès à la page
    const allRolesArray = actualRoute.authorize;

    if(allRolesArray.length > 0){

        if(allRolesArray.includes("disconnected")){
            if(isConnected()){
                window.location.replace("/"); //Rediriger vers la page d'accueil
            }
        } else {
            const roleUser = getRole();
            if(!allRolesArray.includes(roleUser)){
                window.location.replace("/"); //Rediriger vers la page d'accueil
            }
        }
    }

    // Récupération du contenu HTML de la route
    const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = html;

    // Ajout du contenu Javascript
    if(actualRoute.pathJS != "") {
        const oldScript = document.querySelector(`script[data-page-script]`);
        if(oldScript) oldScript.remove();

        // Création d'une balise script
        await new Promise((resolve) => {
        var scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", actualRoute.pathJS + "?t=" + Date.now());
        scriptTag.setAttribute("data-page-script", "true");

        // Ajout de la balise script au corps du document
        document.querySelector("body").appendChild(scriptTag);
        });
    }

    // Changement du titre de la page
    document.title = actualRoute.title + " - " + websiteName;

    //Afficher et masquer les éléments en fonction du rôle
    showAndHideElementsforRole();
};

// Event listener pour intercepter les clics sur les liens
document.addEventListener('click', (event) => {
    if(event.target.tagName === 'A' || event.target.closest('a')) {
        const link = event.target.tagName === 'A' ? event.target : event.target.closest('a');
        if(link.href && link.href.startsWith(window.location.origin)) {
            event.preventDefault();
            window.history.pushState({}, "", link.href);
            LoadContentPage();
        }
    }
});

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
    event.preventDefault();
    // Mis à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);
    // Chargement du contenu de la page correspondante
    LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur 
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété de la fenêtre
window.routeEvent = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();