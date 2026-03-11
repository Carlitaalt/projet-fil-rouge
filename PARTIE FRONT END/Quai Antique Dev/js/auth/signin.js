const mailInput = document.getElementById("EmailInput");
const PasswordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials(){
    let dataForm = new FormData(signinForm);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Origin", "http://localhost:3000");

    let raw = JSON.stringify({
        "email": dataForm.get("email"),
        "password": dataForm.get("mdp")
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(apiUrl + "login", requestOptions)
        .then(response => { 
            // D'abord récupérer le texte brut
            return response.text().then(text => {
                // Essayer de trouver et parser le JSON dans le texte (enlever les erreurs PHP)
                const jsonMatch = text.match(/\{.*\}/);
                if(jsonMatch) {
                    try {
                        return { ok: response.ok, data: JSON.parse(jsonMatch[0]) };
                    } catch(e) {
                        return { ok: response.ok, text: text };
                    }
                }
                return { ok: response.ok, text: text };
            });
        })
        .then(result => {
            // Vérifier que result et result.data existent
            if(result.ok && result.data && result.data.apiToken){
                //Il faudra récupérer le vrai token
                const token = result.data.apiToken;
                setToken(token);
                
                // Convertir le rôle de l'API (ex: "ROLE_CLIENT" → "client")
            let role = result.data.roles && result.data.roles.length > 0 
            ? result.data.roles[0] 
            : 'ROLE_USER';

            if (role.startsWith('ROLE_')) {
            role = role.substring(5).toLowerCase();
            }
                
                //placer ce token en cookie
                setCookie(roleCookieName, role, 7);
                console.log("Rôle stocké:", role);
                window.location.replace("/");
            } else {
                // Afficher un message d'erreur
                mailInput.classList.add("is-invalid");
                PasswordInput.classList.add("is-invalid");
                console.log("Erreur de connexion:", result.text || result.data);
            }
        })
        .catch(error => console.log('error', error));

    }
