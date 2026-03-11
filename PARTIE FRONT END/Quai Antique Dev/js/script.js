const tokenCookieName = "accesstoken";
const roleCookieName = "role";
const apiUrl = "http://127.0.0.1:8000/api/";
const signoutBtn = document.getElementById("signout-btn");

signoutBtn.addEventListener("click", signOut);



function getRole(){
    const role = getCookie(roleCookieName);
    console.log("Rôle actuel:", role);
    return role;
}

function signOut(){
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.replace("/signin");
}

function setToken(token){
    setCookie(tokenCookieName, token, 7);
}

function getToken(){
    return getCookie(tokenCookieName);
}

function setCookie(name, value, days){
    var expires = "";
    if(days){
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++){
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name){
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected(){
    // ✅ Simplifié
    return getToken() !== null && getToken() !== undefined;
}

function showAndHideElementsforRole(){
    const userConnected = isConnected();
    const role = getRole();

    let allElementstoEdit = document.querySelectorAll("[data-show]");

    allElementstoEdit.forEach(element => {
        switch(element.dataset.show) {
            case "disconnected":
                if(userConnected) element.classList.add("d-none");
                break;
            case "connected":
                if(!userConnected) element.classList.add("d-none");
                break;
            case "admin":
                if(!userConnected || role != "admin") element.classList.add("d-none");
                break;
            case "client":
                if(!userConnected || role != "client") element.classList.add("d-none");
                break;
        }
    });
}

function sanitizeHtml(text) {
    const tempHtml = document.createElement('div');
    tempHtml.textContent = text;
    return tempHtml.innerHTML;
}

function getInfosUser(){
    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(apiUrl + "account/me", requestOptions)
        .then(response => {
            if(response.ok){
                return response.json();
            } else {
                console.log("Erreur lors de la récupération des informations de l'utilisateur");
            }
        })
        .catch(error => {
            console.error("Erreur:", error);
        });
}