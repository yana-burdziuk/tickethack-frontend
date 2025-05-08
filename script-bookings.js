const userId = localStorage.getItem('userId');
const bookingsList = document.getElementById('bookingsList');
const messageContainer = document.getElementById('bookingsMessageContainer');
const finalMessage = document.getElementById('finalMessage');
const line = document.getElementById('line');

fetch(`http://localhost:3000/bookings/${userId}`)
  .then(response => response.json())
  .then(data => {
    if (data.result && data.bookings.length > 0) {
      messageContainer.style.display = 'none';
      finalMessage.style.display = 'block';
      line.style.display = 'block';

      data.bookings.forEach(booking => {
        const departureTime = new Date(booking.trip.date);
        const now = new Date();
        const hoursLeft = Math.round((departureTime - now) / (1000 * 60 * 60));

        const card = document.createElement('div');
        card.className = 'trip-card';
        card.innerHTML = `
          <div class="trip-info">
            <span>${booking.trip.departure} > ${booking.trip.arrival}</span>
            <span>${booking.trip.departureTime}</span>
            <span>${booking.trip.price}€</span>
            <span>Departure in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}</span>
          </div>
        `;
        bookingsList.appendChild(card);
      });
    }
  });