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
//------------Fonction qui ajoute les produits dans le panier---------------//
function ajoutPanier() {
    panier.push({
        _id:        produit._id,
        name:       produit.name,
        price:      produit.price,
        quantite:   document.getElementById("quantite").value,
        vernis:     document.getElementById("vernis").value
    });
    const strPanier = JSON.stringify(panier);
    localStorage.setItem("panier", strPanier);

}
//---------------Déclaration de la variable qui recoit les elements du panier-----//
let produitDansPanier = JSON.parse(localStorage.getItem("panier"));
console.log(produitDansPanier);
//-------------Selection de la id ou j'injecte le code html----------//
const affichePanier = document.querySelector("#tableau");
console.log(affichePanier);
//-------------si panier = vide, affichier le panier est vide------//
if(produitDansPanier === null || produitDansPanier == 0){
const panierNull = `
<h2 class="panier-vide text-danger">Votre panier est vide</h2>
`;
document.querySelector(".panier-vide").innerHTML = panierNull;

}else {
    //----------si le panier est rempli, afficher les produits du panier------//
    let afficherLesProduits = [];
    for(elementPanier = 0; elementPanier < produitDansPanier.length; elementPanier++) {
        afficherLesProduits = afficherLesProduits +
        `
                    
                    <tbody>
                        <td>${produitDansPanier[elementPanier].name}</td>
                        <td>${produitDansPanier[elementPanier].vernis}</td>
                        <td>${produitDansPanier[elementPanier]._id}</td>
                        <td>${produitDansPanier[elementPanier].quantite}</td>
                        <td>${produitDansPanier[elementPanier].price/100} €</td>
                        <td><button class="btn_supprimerArticle">Supprimer</button></td>
                    </tbody>
                    
                    
        
        `;
    }
    
        if(elementPanier === produitDansPanier.length) {
        document.querySelector("#tableau").innerHTML = afficherLesProduits;
    }
}
//------------bouton supprimer----------------------//
var supprimerArticle = document.querySelectorAll(".btn_supprimerArticle");
console.log(supprimerArticle);
//---création d'une variable bS (pour Bouton Supprimer), initialisée à 0)
for(let bS =0; bS < supprimerArticle.length; bS++) {
supprimerArticle[bS].addEventListener("click", (Event) => {
       Event.preventDefault();
       console.log(Event);
        //selection de id produit qui va etre supprimer//
let idASupprimer = produitDansPanier[bS]._id;
produitDansPanier = produitDansPanier.filter( el => el._id !== idASupprimer);
console.log(produitDansPanier);

// stockage de la variable dans le localstorage //
localStorage.setItem("panier", JSON.stringify(produitDansPanier));
// message confirmation de suppression de l'article et recharchement de la page //
alert("Le produit est supprimer");
window.location.href = "panier.html";  

})
}
//localStorage.setItem("panier", JSON.stringify(produitDansPanier));
//-----------calcul du montant total du panier------------//
let = prixTotalCalcul = []; //----declaration de la variable pour stocker les prix de chaque article---//
//------recupérer les prix dans le panier-----//
for (let z = 0; z < produitDansPanier.length; z++) {
    let = prixProduitsDansLePanier = produitDansPanier[z].price;
    //------stocker les prix du panier dans une variable----//
    prixTotalCalcul.push(prixProduitsDansLePanier);
    console.log(prixTotalCalcul);
}
//faire l'addition des prix récupéré dans le tableau précédement créé en utlisant "reduce" vue dans le MDn //
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const pTotal = prixTotalCalcul.reduce(reducer,0);
console.log(pTotal);
// reste a afficher le prix total en html dans l'emplacement prevu dans le fichier panier.html
const affichePrixTotalHtml = `
                    <thead class="bg-info">
                        <tr></tr>
                        <th>Prix Total = ${pTotal/100} €</th>
                    </thead>
`
document.querySelector("#prix-total").innerHTML = affichePrixTotalHtml;

//--------------Gestion du formulaire de commande----------//
const afficherLeFormulaire = () => {
    //----Appel de l'id du formulaire dans le DOM--//
    document.querySelector("#formulaire").innerHTML +=
    `
                            <div class="form-group">
                                <label for="nom">Quel est votre nom ? : </label>
                                <input type="text" class="form-control" id="nom" name="nom" placeholder="Votre nom" required>
                            </div>
                            <div class="form-group">
                                <label for="prenom">Quel est votre prénom ? : </label>
                                <input type="text" class="form-control" id="prenom" name="prenom" placeholder="Votre prenom" required>
                            </div>
                            <div class="form-group">
                                <label for="adresse">Quel est votre adresse ? :</label>
                                <input type="text" class="form-control" id="adresse" name="adresse" placeholder="Votre adresse" required>
                            </div>
                            <div class="form-group">
                                <label for="ville">Quel est votre ville ? :</label>
                                <input type="text" class="form-control" id="ville" name="ville" placeholder="Votre ville" required>
                            </div>
                            <div class="form-group">
                                <label for="codepostal"> Quel est votre code postal ? :</label>
                                <input type="text" class="form-control" id="codepostal" name="codepostal" placeholder="Votre code postal" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Quel est votre e-mail ? : </label>
                                <input type="email" class="form-control" id="email" name="email" placeholder="Votre e-mail" required>
                                <div class="form-group mt-4 text-center">
                                <button type="submit" class="btn btn-primary">Je passe commande</button>
                            </div>
    
                            `;

}

afficherLeFormulaire();
