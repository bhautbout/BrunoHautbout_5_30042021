const afficheConfirmation = 

    `
        <p>Merci pour votre commande <strong>${localStorage.firstName}</strong></p>
        <p>Commande n° : <strong>${localStorage.orderId}</strong></p>
    `
    document.getElementById('confirm').innerHTML = afficheConfirmation;
   // localStorage.clear()
   