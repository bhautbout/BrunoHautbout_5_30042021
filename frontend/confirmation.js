const afficheConfirmation = 

    `
    <div class="card-body">
    <h5 class="card-title text-center">Commande validée</h5>
    <p class="card-text text-center">Merci pour votre commande <strong>${localStorage.firstName}</strong></p>
    <p class="card-text text-center">Commande n° : <strong>${localStorage.orderId}</strong> d'un montant de : <strong>${localStorage.prixTotal/100} €</strong></p>
    </div>
    `
    document.getElementById('confirm').innerHTML = afficheConfirmation;
    localStorage.clear()
   