{

const userEmail = getToken();
const key = 'reservations_' + userEmail;
const reservations = JSON.parse(localStorage.getItem(key) || '[]');
const container = document.querySelector('.allReservations');
container.innerHTML = '';

if(reservations.length === 0){
    container.innerHTML = '<p class="mt-3">Aucune réservation pour le moment.</p>';
} else {
    reservations.forEach((r, index)=> {
        container.innerHTML += `
            <a href="#" class="d-block my-2">
                <span>${r.date}</span> |
                <span>${r.heure}</span> |
                <span>${r.nbConvives} personnes</span> |
                <span>${r.allergie}</span>
            </a>
            `;
    });
}

}