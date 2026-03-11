{
    
const defaultPhotos = [
    {id: 1, title: "La salle de restaurant", imagePath: "images/photo-galerie1.jpg"},
    {id: 2, title: "Des légumes de saison", imagePath: "images/photo-galerie2.jpg"},
    {id: 3, title: "La cuisine et ses cuisiniers", imagePath: "images/photo-galerie3.jpg"},
];

function loadImages() {
    const savedPhotos = JSON.parse(localStorage.getItem('galerie') || '[]');
    const allPhotos = [...defaultPhotos, ...savedPhotos];
    const galerieImage = document.getElementById("allImages");
    galerieImage.innerHTML = "";
    allPhotos.forEach(picture => {
        galerieImage.innerHTML += getImage(picture.id, picture.title, picture.imagePath);
    });
    showAndHideElementsforRole();
}

function getImage(id, titre, urlImage) {
    titre = sanitizeHtml(titre);

    return `<div class="col p-3">
        <div class="image-card text-white">
            <img src="${urlImage}" class="rounded w-100" alt="${titre}">
            <p class="titre-image">${titre}</p>
            <div class="action-image-buttons" data-show="admin">
                <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#EditionPhotoModal"><i class="bi bi-pencil-square"></i></button>
                <button type="button" class="btn btn-outline-light" onclick="deleteImage(${id})" data-bs-toggle="modal" data-bs-target="#DeletePhotoModal"><i class="bi bi-trash"></i></button>
            </div>
        </div>
    </div>`;
}

// Ajouter une image
document.getElementById("btnSavePhoto").addEventListener("click", function(){
    const title = document.getElementById("photoTitle").value;
    const file = document.getElementById("photoFile").files[0];

    if (!title || !file) {
        alert("Veuillez remplir le titre et choisir une image");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e){
        const savedPhotos = JSON.parse(localStorage.getItem('galerie') || '[]');
        savedPhotos.push({
            id: Date.now(),
            title: title,
            imagePath: e.target.result
        });
        localStorage.setItem('galerie', JSON.stringify(savedPhotos));

        document.getElementById("photoTitle").value = "";
        document.getElementById("photoFile").value = "";
        bootstrap.Modal.getInstance(document.getElementById("EditionPhotoModal")).hide();
        loadImages();
    };
    reader.readAsDataURL(file);

});

document.getElementById("btnDeletePhoto").addEventListener("click", function() {
    const id = window._deleteId;
    if (!id) return;
    const savedPhotos = JSON.parse(localStorage.getItem('galerie') || '[]');
    const updated = savedPhotos.filter(p => p.id !== id);
    localStorage.setItem('galerie', JSON.stringify(updated));
    bootstrap.Modal.getInstance(document.getElementById("DeletePhotoModal")).hide();
    loadImages();
});

loadImages();

}