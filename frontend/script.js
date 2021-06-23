var produit;
//initialisation de la variable produit---//
var panier = [];
const sPanier = localStorage.getItem("panier");
if (sPanier != null ) panier = JSON.parse(sPanier);

//-------------------Fonction qui permet d'afficher la liste des produits-----------------------//
function listeProduits() {

    fetch("http://localhost:3000/api/furniture") //---Récupération des produits---//
    .then(response => response.json()) //---conversion des données en JSON---//
    .then(data => {
        produit = data;
        for (produit of data) { //---Affichage de chaque produit de data dans le DOM---//
            document.getElementById("listeproduit").innerHTML += `
            <div class="col-lg-6 col-md-6 mb-4">
                    <div class="card">
                    <img class="card-img-top" src="${produit.imageUrl}" alt="${produit.name}">
                        <div class="card-body">
                            <h3 class="card-title">${produit.name}</h3>
                            <h4 class="card-text"><strong>${produit.price / 100} €</strong></h4>
                        </div>
                        <a class="btn btn-secondary" href="detail-produit.html?id=${produit._id}">Détails</a>
                    </div>
                </div>`;

        }
    })
    .catch(error => {
        console.warn("Erreur de chargement !", error);
    }) 
}
//------------------Fonction qui ajout les détails du produit sélectionné----------------//
function afficheDetail() {

    let params = (new URL(document.location)).searchParams;
    //---Récupération de l'Url de l'objet--//
    var id = params.get("id");
    //---Le parametre de l'id va dans une variable--//

    fetch(`http://localhost:3000/api/furniture/${id}`)
    //---Appel de l'Api avec l'id récupéré--//
    .then(response => response.json())
    //---Transforme response en objet JSON---//
    .then(data => {
        produit = data;
        //-----------Récupération des options de vernis------------//
        let varnish = ""
        data.varnish.forEach(element => {
            varnish += `<option value="${element}">${element}</options>`
        });
        
        //---------------Injection du code html du détail produit dans le DOM-------------//
        document.getElementById("detailProduit").innerHTML += `
        <div class="col-lg-6">
                <div class="card mt-4">
                    <img class="card-img-top" src="${data.imageUrl}" alt="${data.name}">
                </div>
        </div>
        <div class="col-lg-6">
                <div class="card mt-4">
                    <div class="card-body">
                        <h2 class="card-title">${data.name}</h2>
                        <p class="card-text">${data.description}</p>
                        <h3 class="card-text">Prix : ${data.price /100} €</h3>
                        <h4 class="card-text">Choisissez votre vernis :</h4>
                            <select class="form-control" name="vernis" id="vernis">
                                `+varnish+`
                            </select>
                            <br>
                            <h5 class="card-text">Quantité :</h5>
                                <select class="form-control" id="quantite">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <br>
                            <button class="btn btn-secondary" type="button" onclick="ajoutPanier()">Ajouter au panier </button>
                            <a class="btn btn-success" href="index.html" role="button">Continuer mes achats</a>
                    </div>
                </div>
        </div>`;
    })
    
}

//------------Fonction qui ajoute les produits dans le panier---------------//
function ajoutPanier() {
    let exist = false;
    //---Initialisation de la variable "exist"--//
    for(let i=0; i<panier.length; i++) {
        if(produit._id == panier[i]._id) {
            panier[i].quantite = +panier[i].quantite + (+document.getElementById("quantite").value);
            exist = true;
            break;
        }
    }
    
    
    //---Chaque enregistrement de panier est lu pour voir si le produit que l'on ajoute existe---//
    //---Si exist = true alors on ajoute la quantite du produit à la quantite du produit dans le panier--//
    if(exist==false) {
        
    //---Si le produit que l'on veut ajouter n'existe pas, l'ajouter au panier---//
        panier.push({
            _id:                produit._id,
            name:               produit.name,
            price:              produit.price,
            quantite:           document.getElementById("quantite").value,
            quantiteParArticle: produit.price * document.getElementById("quantite").value,
            vernis:             document.getElementById("vernis").value
        });
    }
    
        
    
    const strPanier = JSON.stringify(panier);
    

    //---On convertit le panier en JSON---//
    localStorage.setItem("panier", strPanier);
    //---Stockage dans le panier---//
}

let produitDansPanier = JSON.parse(localStorage.getItem("panier")) || [];
    //---------------Déclaration de la variable qui recoit les elements du panier-----//
function affichePanier() {
    //---fonction qui affiche les produits du panier---//
    

    
    if(produitDansPanier === null || produitDansPanier == 0){
    //-------------si panier = vide, affichier le panier est vide------//
    const panierNull = `
    <h2 class="panier-vide text-danger">Votre panier est vide</h2>
    `;
    document.querySelector(".panier-vide").innerHTML = panierNull;
    

    }else {
        //----------si le panier est rempli, afficher les produits du panier------//
        let afficherLesProduits = [];

        document.getElementById('entete_tableau').innerHTML +=
        `
        <thead class="bg-info">
            <tr>
                <th>Nom</th>
                <th>Vernis</th>
                <th>Id produit</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Prix Total</th>
                <th></th>
            </tr>
        </thead>
        `;
        //---Affichage de l'entete du tableau---//
        for(elementPanier = 0; elementPanier < produitDansPanier.length; elementPanier++) {
            var prixTotalQuantite = produitDansPanier[elementPanier].quantite * produitDansPanier[elementPanier].price;
            afficherLesProduits = afficherLesProduits +
            `
                        
                        <tbody>
                            <td>${produitDansPanier[elementPanier].name}</td>
                            <td>${produitDansPanier[elementPanier].vernis}</td>
                            <td>${produitDansPanier[elementPanier]._id}</td>
                            <td>${produitDansPanier[elementPanier].quantite}</td>
                            <td>${produitDansPanier[elementPanier].price / 100} €</td>
                            <td>${prixTotalQuantite /100} €</td>
                            <td><button class="btn_supprimerArticle">Supprimer</button></td>
                        </tbody>
                        
                        
            
            `;
        }
            if(elementPanier === produitDansPanier.length) {
            document.querySelector("#tableau").innerHTML = afficherLesProduits;
        }
    }
    //---Affichage des elements du panier---//

    let = prixTotalCalcul = 0;
    //-----------calcul du montant total du panier------------//
    //----declaration de la variable pour stocker les prix de chaque article---//
    for (let z = 0; z < produitDansPanier.length; z++) {
        prixTotalCalcul+= produitDansPanier[z].price * produitDansPanier[z].quantite;
    }
    //------recupérer les prix dans le panier-----//

    if(prixTotalCalcul === null || prixTotalCalcul == 0){
    //------si le prix total est null ou egal à 0, ne pas afficher l'entete du tableau---//
        const supprimeTableau = `
                          
        `
          document.querySelector("#prix-total").innerHTML = supprimeTableau;
      
      }else {
    //-----------dans le cas contraire, afficher l'entete du tableau avec le prix total----//
      
      
      const affichePrixTotalHtml = `
                          <thead class="bg-info">
                              <tr></tr>
                              <th>Prix Total = ${prixTotalCalcul/100} €</th>
                          </thead>
      `
      document.querySelector("#prix-total").innerHTML = affichePrixTotalHtml;
       
    }
    localStorage.setItem("prixTotal", JSON.stringify(prixTotalCalcul));
    //---------Enregistrement du prix total dans le localStorage------------//

    
    var supprimerArticle = document.querySelectorAll(".btn_supprimerArticle");
    //------------bouton supprimer----------------------//
    
    for(let bS =0; bS < supprimerArticle.length; bS++) {
    //---création d'une variable bS (pour Bouton Supprimer), initialisée à 0)
    supprimerArticle[bS].addEventListener("click", (Event) => {
        Event.preventDefault();
            
    let idASupprimer = produitDansPanier[bS]._id;
    produitDansPanier = produitDansPanier.filter( el => el._id !== idASupprimer);
    //selection de id produit qui va etre supprimer//

    
    localStorage.setItem("panier", JSON.stringify(produitDansPanier));
    // stockage de la variable dans le localstorage //
    
    alert("Le produit est supprimer");
    // message confirmation de suppression de l'article et recharchement de la page //
    window.location.href = "panier.html";  

        })
    }
}

//-------------------Validation de la commande----------------------//
//---le formulaire est validé par la méthode POST et l'envoi au serveur---//


function validCommande() {  
    event.preventDefault();
    if(document.forms['formulaire'] !="") {
//---les données sont valides, on envoi le formulaire---//
    var contact = {
//---On récupère les données du formulaire avec leur valeur---//
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    };
    var products = []
    for (let z = 0; z < produitDansPanier.length; z++) {
        products.push(produitDansPanier[z]._id);
    }
//---Les produits sont envoyés dans le panier---//

    fetch("http://localhost:3000/api/furniture/order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({contact, products})
    })
//---Contact et products sont transformés en JSON---//
    
        .then(response => response.json())
        .then(response => {
            if(response.orderId) {
            alert(`Votre commande numéro ${response.orderId} à bien été passée.`)
            localStorage.setItem("orderId", response.orderId)
            localStorage.setItem("firstName", response.contact.firstName)
            window.location.href = "/frontend/confirmation-commande.html";
//---Si la réponse est ok, la page confirmation-commande.html est appelée et affiche les références---//
            } else{
                alert(`Votre commande comporte une erreur`)
            }
    });       
}
else {
    alert("Veuillez remplir le formulaire !")
}

}
//---Fonction pour l'affichage de la commande---//

function confirmationCommande(){
    const afficheConfirmation = 

    `
    <div class="card-body">
    <h2 class="card-title text-center">Commande validée</h2>
    <p class="card-text text-center">Merci pour votre commande <strong>${localStorage.firstName}</strong></p>
    <p class="card-text text-center">Commande n° : <strong>${localStorage.orderId}</strong> d'un montant de : <strong>${localStorage.prixTotal/100} €</strong></p>
    </div>
    `
    document.getElementById('confirm').innerHTML = afficheConfirmation;
    localStorage.clear()
    //---Vidage du localStorage après confirmation de la commande---//

}
