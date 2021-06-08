var produit;
var panier = [];
const sPanier = localStorage.getItem("panier");
if (sPanier != null ) panier = JSON.parse(sPanier);

//-------------------Fonction qui permet d'afficher la liste des produits-----------------------//
function listeproduits() {

    fetch("http://localhost:3000/api/furniture")
    .then(response => response.json())
    .then(data => {
        produit = data;
        for (produit of data) {
            document.getElementById("listeproduit").innerHTML += `
            <div class="col-12 col-lg-4 mb-4">
                    <div class="card">
                    <img class="card-img-top" src="${produit.imageUrl}" alt="${produit.name}">
                        <div class="card-body">
                            <h5 class="card-title">${produit.name}</h5>
                            <p class="card-text">${produit.price / 100} €</p>
                        </div>
                        <a class="btn btn-secondary" href="detail-produit.html?id=${produit._id}">Détails</a>
                    </div>
                </div>`;

        }
    })
}

function afficheDetail() {

    let params = (new URL(document.location)).searchParams;
    var id = params.get("id");
    console.log(id);

    fetch(`http://localhost:3000/api/furniture/${id}`)
    .then(response => response.json())
    .then(data => {
        produit = data;
        //-----------Récupération des options de vernis------------//
        let varnish = ""
        data.varnish.forEach(element => {
            varnish += `<option value="${element}">${element}</options>`
        });
        console.log(varnish);
        
        //---------------Injection du code html du détail produit dans le DOM-------------//
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
                        <h4 class="card-text">Prix : ${data.price /100} €</h4>
                        <h5 class="card-text">Choisissez votre vernis :</h5>
                            <select class="form-control" name="vernis" id="vernis">
                                `+varnish+`
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
                            <button class="btn btn-secondary" type="button" onclick="ajoutPanier()">Ajouter au panier </button>
                            <a class="btn btn-success" href="index.html" role="button">Continuer mes achats</a>
                    </div>
                </div>
        </div>`;
    })
    
}


//------------Fonction qui ajoute les produits dans le panier---------------//
function ajoutPanier() {
    console.log(produit);
    
    let exist = false;
    for(let i=0; i<panier.length; i++) {
        if(produit._id == panier[i]._id) {
            panier[i].quantite = +panier[i].quantite + (+document.getElementById("quantite").value);
            exist = true;
            break;
        }
    }
    if(exist==false) {
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
    localStorage.setItem("panier", strPanier);
    console.log(strPanier);
}

    //---------------Déclaration de la variable qui recoit les elements du panier-----//
let produitDansPanier = JSON.parse(localStorage.getItem("panier"));
    console.log(produitDansPanier);

function affichePanier() {
    
    
    //-------------Selection de la id ou j'injecte le code html----------//
    const affichePanier = document.querySelector("#tableau");
    //-------------si panier = vide, affichier le panier est vide------//
    if(produitDansPanier === null || produitDansPanier == 0){
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

        for(elementPanier = 0; elementPanier < produitDansPanier.length; elementPanier++) {
            afficherLesProduits = afficherLesProduits +
            `
                        
                        <tbody>
                            <td>${produitDansPanier[elementPanier].name}</td>
                            <td>${produitDansPanier[elementPanier].vernis}</td>
                            <td>${produitDansPanier[elementPanier]._id}</td>
                            <td>${produitDansPanier[elementPanier].quantite}</td>
                            <td>${produitDansPanier[elementPanier].price / 100} €</td>
                            <td>${produitDansPanier[elementPanier].quantiteParArticle / 100} €</td>
                            <td><button class="btn_supprimerArticle">Supprimer</button></td>
                        </tbody>
                        
                        
            
            `;
        }
        
            if(elementPanier === produitDansPanier.length) {
            document.querySelector("#tableau").innerHTML = afficherLesProduits;
        }
    }
    //-----------calcul du montant total du panier------------//
    let = prixTotalCalcul = 0; //----declaration de la variable pour stocker les prix de chaque article---//
    //------recupérer les prix dans le panier-----//
    for (let z = 0; z < produitDansPanier.length; z++) {
        prixTotalCalcul+= produitDansPanier[z].price * produitDansPanier[z].quantite;
    }
    if(prixTotalCalcul === null || prixTotalCalcul == 0){//------si le prix total est null ou egal à 0, ne pas afficher l'entete du tableau---//
        const supprimeTableau = `
                          
        `
          document.querySelector("#prix-total").innerHTML = supprimeTableau;
      
      }else {//-----------dans le cas contraire, afficher l'entete du tableau avec le prix total----//
      
      
      const affichePrixTotalHtml = `
                          <thead class="bg-info">
                              <tr></tr>
                              <th>Prix Total = ${prixTotalCalcul/100} €</th>
                          </thead>
      `
      document.querySelector("#prix-total").innerHTML = affichePrixTotalHtml;
       
    }
    //---------Enregistrement du prix total dans le localStorage------------//
    localStorage.setItem("prixTotal", JSON.stringify(prixTotalCalcul));
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
}

//localStorage.setItem("panier", JSON.stringify(produitDansPanier));



//-------------------Validation de la commande----------------------//

function validCommande() {  
    event.preventDefault();
    //-------------espace réservé pour les tests-----------//
    if(document.forms['formulaire'] !="") {
    var contact = {
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

    fetch("http://localhost:3000/api/furniture/order", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({contact, products})
    })
    
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if(response.orderId) {
            alert(`Votre commande numéro ${response.orderId} à bien été passée.`)
            localStorage.setItem("orderId", response.orderId)
            localStorage.setItem("firstName", response.contact.firstName)
            window.location.href = "/frontend/confirmation-commande.html";
            } else{
                alert(`Votre commande comporte une erreur`)
            }
    });       
}
}

