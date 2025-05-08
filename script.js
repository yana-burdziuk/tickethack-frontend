// Simule un userId pour l'utilisateur courant
if (!localStorage.getItem('userId')) {
  localStorage.setItem('userId', '66470dd18e87c559c63b2acb');
}

// Sélection des éléments HTML
const searchButton = document.getElementById('searchButton');
const departureInput = document.getElementById('departureInput');
const arrivalInput = document.getElementById('arrivalInput');
const dateInput = document.getElementById('dateInput');
const resultsFound = document.getElementById('resultsFound');
const resultsNotFound = document.getElementById('resultsNotFound');
const defaultDisplay = document.getElementById('defaultDisplay');
const tripsList = document.getElementById('tripsList');
const resultText = document.getElementById('resultText');

// Gestion du clic sur le bouton de recherche
searchButton.addEventListener('click', () => {
  const departure = departureInput.value.trim();
  const arrival = arrivalInput.value.trim();
  const date = dateInput.value;

  // Réinitialise l'affichage
  resultsFound.style.display = 'none';
  resultsNotFound.style.display = 'none';
  defaultDisplay.style.display = 'none';

  // Vérifie si tous les champs sont remplis
  if (!departure || !arrival || !date) {
    resultsNotFound.style.display = 'block';
    resultText.textContent = 'No trip found.';
    return;
  }

  // Requête API pour récupérer les trajets
  fetch(`http://localhost:3000/trips?departure=${departure}&arrival=${arrival}&date=${date}`)
    .then(response => response.json())
    .then(data => {
      if (data.result && data.trips.length > 0) {
        resultsFound.style.display = 'block';
        renderTrips(data.trips);
      } else {
        resultsNotFound.style.display = 'block';
        resultText.textContent = 'No trip found.';
      }
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des trajets :', error);
      resultsNotFound.style.display = 'block';
      resultText.textContent = 'No trip found.';
    });
});

// Fonction pour afficher les trajets
function renderTrips(trips) {
  tripsList.innerHTML = '';
  trips.forEach(trip => {
    const tripCard = document.createElement('div');
    tripCard.className = 'trip-card';

    tripCard.innerHTML = `
      <div class="trip-info">
        <span>${trip.departure} > ${trip.arrival}</span>
        <span>${trip.departureTime}</span>
        <span>${trip.price}€</span>
      </div>
      <button class="book-button" data-id="${trip._id}">Book</button>
    `;

    tripsList.appendChild(tripCard);
  });

  // Ajout d'un écouteur sur les boutons "Book"
  const bookButtons = document.querySelectorAll('.book-button');
  bookButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tripId = button.dataset.id;
      const userId = localStorage.getItem('userId');

      fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tripId })
      })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            window.location.href = './cart.html';
          } else {
            alert('Error adding to cart');
          }
        })
        .catch(() => alert('Server error'));
    });
  });
}