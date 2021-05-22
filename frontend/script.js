var produit;
var panier = [];
const sPanier = localStorage.getItem("panier");
if (sPanier != null ) panier = JSON.parse(sPanier);

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
function afficheDetail() {
    let params = (new URL(document.location)).searchParams;
    let id = params.get("id");

    fetch(`http://localhost:3000/api/furniture/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        produit = data;
        document.getElementById("detailProduit").innerHTML += `
        <div class="col-6">
                <div class="card mt-4">
                    <img class="card-img-top" src="${data.imageUrl}" alt="${data.name}">
                </div>
        </div>
        <div class="col-6">
                <div class="card mt-4">
                    <div class="card-body">
                        <h2 class="card-title">${data.name}</h2>
                        <h3 class="card-text">${data.description}</h3>
                        <h4 class="card-text">Prix : ${data.price / 100} €</h4>
                        <h5 class="card-text">Choisissez votre vernis :</h5>
                            <select class="form-control" id="vernis">
                                <option value="${data.varnish [0]}">${data.varnish [0]}</option>
                                <option value="${data.varnish [1]}">${data.varnish [1]}</option>
                                <option value="${data.varnish [2]}">${data.varnish [2]}</option>
                                <option value="${data.varnish [3]}">${data.varnish [3]}</option>
                            </select>
                            <br>
                                <h6 class="card-text">Quantité :</h6>
                                <select class="form-control" id="quantite">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <br>
                            <button class="btn btn-dark" type="button" onclick="ajoutPanier()">Ajouter au panier </button>

                    </div>
                </div>
        </div>`;
        
    })
}
function ajoutPanier() {
    panier.push({
        _id:        produit._id,
        name:       produit.name,
        price:      produit.price,
        quantite:   document.getElementById("quantite").value,
        vernis:     document.getElementById("vernis").value
    });
    console.log(panier);
    const strPanier = JSON.stringify(panier);
    localStorage.setItem("panier", strPanier);

}
