getInfosUser().then(user => {
    if(!user) return;

    document.getElementById("NomInput").value = user.lastName || "";
    document.getElementById("PrenomInput").value = user.firstName || "";

    document.getElementById("AllergieInput").value = user.allergy || "";
    document.getElementById("NbConvivesInput").value = user.guestNumber || 1;

}).catch(error => console.error("Erreur:", error));

document.querySelector('button[type="submit').addEventListener('click', function(e){
    e.preventDefault();

    const date = document.getElementById('DateInput').value;
    const heure = document.getElementById('selectHour').value;

    if(!date){
        alert("Veuillez choisir une date !");
        return;
    }

    const reservation = {
        nom: document.getElementById('NomInput').value,
        prenom: document.getElementById('PrenomInput').value,
        allergie: document.getElementById('AllergieInput').value || "Pas d'allergie",
        nbConvives: document.getElementById('NbConvivesInput').value,
        date: date,
        heure: heure,
        service: document.querySelector('input[name="serviceChoisi"]:checked').value
    };

    const userEmail = getToken();
    const key = 'reservations_' + userEmail;
    const reservations = JSON.parse(localStorage.getItem(key) || '[]');
    reservations.push(reservation);
    localStorage.setItem(key, JSON.stringify(reservations));

    window.location.href = '/allResa';
})