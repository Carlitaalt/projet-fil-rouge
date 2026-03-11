export default class Route {
    constructor(url, title, pathHtml, authorize, pathJS = "") {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.pathJS = pathJS;
        this.authorize = authorize;
    }
}

/*

[]-> Tout le monde peut y accéder
["disconnected"]-> Seules les personnes non connectées peuvent y accéder
["client"]-> Seules les personnes avec le rôle client peuvent y accéder
["admin"]-> Seules les personnes avec le rôle admin peuvent y accéder
["admin", "client"]-> Seules les personnes avec le rôle admin ou client peuvent y accéder

*/