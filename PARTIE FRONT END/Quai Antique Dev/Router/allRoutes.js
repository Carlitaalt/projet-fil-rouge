import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "pages/home.html", []),
    new Route ("/galerie", "La galerie", "/pages/galerie.html", [], "js/galerie.js"),
    new Route ("/signin", "Connexion", "/pages/auth/signin.html", ['disconnected'], "js/auth/signin.js"),
    new Route ("/signup", "Inscription", "/pages/auth/signup.html", ['disconnected'], "js/auth/signup.js"),
    new Route ("/account", "Mon compte", "/pages/auth/account.html", ['client', 'admin', 'user'], "js/auth/account.js"),
    new Route ("/editPassword", "Changement de mot de passe", "/pages/auth/editPassword.html", ['client', 'admin', 'user']),
    new Route ("/allResa", "Mes réservations", "/pages/reservations/allResa.html", ['client', 'user'], "js/reservations/allResa.js"),
    new Route ("/reserver", "Réserver une table", "/pages/reservations/reserver.html", ['client', 'user'], "js/reservations/reserver.js"),
    new Route ("/carte", "La carte", "/pages/carte.html", []),
];

//Le titre s'affiche comme ceci : Route.titre - websiteName
export const websiteName = "Quai Antique";