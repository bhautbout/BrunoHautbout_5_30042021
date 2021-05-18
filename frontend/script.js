function listeproduits() {
    fetch("http://localhost:3000/api/furniture")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        for (const produit of data) {
            document.getElementById("listeproduit").innerHTML += `
            <div class="col-4">
            <a href="detail-produit.html?id=${produit._id}">
            <div class="card">
                <img class="card-img-top" src="${produit.imageUrl}" alt="${produit.name}">
            </div>
        </div>
        <div class="col-8">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${produit.name}</h2>
                    <h4 class="card-text">${produit.price / 100} €</h4>
                </div>
            </div></a>
        </div>`;

        }
    })
}