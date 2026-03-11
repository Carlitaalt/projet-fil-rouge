getInfosUser().then(user => {
    if(!user) return;

    document.getElementById("NomInput").value = sanitizeHtml(user.lastName || "");
    document.getElementById("PrenomInput").value = sanitizeHtml(user.firstName || "");
    document.getElementById("AllergieInput").value = sanitizeHtml(user.allergy || "");
    document.getElementById("NbConvivesInput").value = parseInt(user.guestNumber || 1);
})
.catch(error => console.error("Erreur chargement de compte:", error));

//Modifier les infos utilisateurs
document.getElementById("btnSaveAccount").addEventListener("click", saveAccount);

function saveAccount(){

    //Vérifier que l'utilisateur est toujours connecté 
    if(!getToken()){
        window.location.replace("/signin");
        return;
    }

    const nomInput = document.getElementById("NomInput").value.trim();
    const prenomInput = document.getElementById("PrenomInput").value.trim();
    const allergyInput = document.getElementById("AllergieInput").value.trim();
    const guestNumber = parseInt(document.getElementById("NbConvivesInput").value);

    //Validation des champs
    if(!nomInput || !prenomInput){
        alert("Le nom et le prénom sont obligatoires");
        return;
    }

    if(nomInput.length > 64 || prenomInput.length > 32){
        alert("Le nom ou le prénom est trop long");
        return;
    }

    if(allergyInput.length > 255){
        alert("Le champ allergie est trop long (255 caractères max)");
        return;
    }

    if(isNaN(guestNumber) || guestNumber < 1 || guestNumber > 20) {
        alert("Le nombre de convives doit être compris entre 1 et 20");
        return;
    }

    const data = {
        lastName: nomInput,
        firstName: prenomInput,
        allergy: allergyInput,
        guestNumber: guestNumber
    };

    fetch(apiUrl + 'account/edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-AUTH-TOKEN': getToken()
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok) {
            alert("Informations mises à jour avec succès");
        } else if (response.status === 401) {
            alert("Session expirée, veuillez vous reconnecter");
            window.location.replace("/signin");
        } else {
            alert("Erreur lors de la mise à jour des informations. Veuillez réessayer.");
        }
    })
    .catch(error => console.error("Erreur: ", error));
}