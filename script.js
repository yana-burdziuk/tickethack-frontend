// sélection des éléments HTML
const searchButton = document.getElementById("searchButton");
const departureInput = document.getElementById("departureInput");
const arrivalInput = document.getElementById("arrivalInput");
const dateInput = document.getElementById("dateInput");
const resultsFound = document.getElementById("resultsFound");
const resultsNotFound = document.getElementById("resultsNotFound");
const defaultDisplay = document.getElementById("defaultDisplay");
const tripsList = document.getElementById("tripsList");
const resultText = document.getElementById("resultText");

// gestion du clic sur le bouton de recherche
searchButton.addEventListener("click", () => {
  const departure = departureInput.value.trim();
  const arrival = arrivalInput.value.trim();
  const date = dateInput.value;

  // pour reinit l'affichage
  resultsFound.style.display = "none";
  resultsNotFound.style.display = "none";
  defaultDisplay.style.display = "none";

  // on vérifie si tous les champs sont remplis
  if (!departure || !arrival || !date) {
    resultsNotFound.style.display = "block";
    resultText.textContent = "No trip found";
    return;
  }
  //  on récupère les trajets
  fetch(
    `http://localhost:3000/trips?departure=${departure}&arrival=${arrival}&date=${date}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.result && data.trips.length > 0) {
        resultsFound.style.display = "block";
        renderTrips(data.trips);
      } else {
        resultsNotFound.style.display = "block";
        resultText.textContent = "No trip found";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des trajets :", error);
      resultsNotFound.style.display = "block";
      resultText.textContent = "No trip found";
    });
});

// fonction pour afficher les trajets
function renderTrips(trips) {
  tripsList.innerHTML = "";
  trips.forEach((trip) => {
    const tripCard = document.createElement("div");
    const date = new Date(trip.date);

    //formater la date pour recuperer que l'heure
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const hourOnly = `${hours}:${minutes}`;
    tripCard.className = "trip-card";

    tripCard.innerHTML = `
        <div class="trip-info">
          <span>${trip.departure} > ${trip.arrival}</span>
          <span>${hourOnly}</span>
          <span>${trip.price}€</span>
        </div>
        <button class="book-button" data-id="${trip._id}">Book</button>
      `;

    tripsList.appendChild(tripCard);
  });

  // ajout d'un event listener sur les boutons "Book"
  const bookButtons = document.querySelectorAll(".book-button");
  bookButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tripId = button.dataset.id;
      const userId = localStorage.getItem("userId");
      // on crée le panier
      fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tripId }),
      })
        .then((response) => response.json())
        .then((data) => {

          //s'il y a un retour de cart créé on cherche le trip correspondant par l'id dans la base trips
          // et on rajoute les infos dans le cart actuel

          if (data.result) {
            const trip = trips.find((t) => t._id === tripId);

            //on doit toujours formater la date pour avoir que l'heure

            const formattedDate = new Date(trip.date);
            const hour =
              formattedDate.getUTCHours().toString().padStart(2, "0") +
              ":" +
              formattedDate.getUTCMinutes().toString().padStart(2, "0");
            
            //création du panier

            const cartItem = {
              departure: trip.departure,
              arrival: trip.arrival,
              time: hour,
              price: trip.price,
            };

            // on ajoute au localStorage (espace de stockage, permet de sauvegarder des données côté client
            //et les réutilisés sur l'autre page) --> du stackoverflow, le concept est assez flou encore

            let cart = JSON.parse(localStorage.getItem("cart")) || []; // je récup le panier si y’en a un, sinon je crée un panier vide []
            
            //on rajoute le trajet que le user vient de réserver dans ce tableau
           
            cart.push(cartItem); 
         
            // on enregistre le panier dans le navigateur,
            // mais comme on ne peut pas stocker de tableau directement, on le transforme en texte JSON

            localStorage.setItem("cart", JSON.stringify(cart));
   
            // redirect
            window.location.href = "./cart.html";
          }
        });
    });
  });
}
