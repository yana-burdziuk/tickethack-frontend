let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cartItems");
const totalPriceSpan = document.getElementById("totalPrice");
const cartFooter = document.getElementById("cartFooter");

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <p class="cardDescription">No tickets in your cart.</p>
      <p class="cardDescription">Why not plan a trip?</p>
    `;
    cartFooter.classList.add("hidden");
    return;
  }

  let total = 0;

  cartItems.forEach((item, index) => {
    total += item.price;

    const itemDiv = document.createElement("div");
    itemDiv.className = "ticketItem";
    itemDiv.innerHTML = `
      <span>${item.departure} > ${item.arrival}</span>
      <span>${item.time}</span>
      <span>${item.price}€</span>
      <button class="deleteButton" data-index="${index}">x</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  totalPriceSpan.textContent = `Total : ${total}€`;
  cartFooter.classList.remove("hidden");

  document.querySelectorAll(".deleteButton").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      cartItems.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      renderCart();
    });
  });
}

renderCart();
