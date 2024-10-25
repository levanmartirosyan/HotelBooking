let roomTypes = document.getElementById("roomTypes");
let rooms = document.getElementById("rooms");
let filterForm = document.getElementById("filterForm");
let cards = document.getElementById("cards");
let resetBtn = document.getElementById("resetBtn");
let checkIn = document.getElementById("checkin");
let checkOut = document.getElementById("checkout");

function showAllRooms(item) {
  return `
    <div class="roomCard">
  <img
    src="${item.images[0].source}"
    alt=""
  />
  <div class="roomInfo">
    <div>
      <span class="roomName">${item.name}</span>
      <span class="roomPrice">€ ${item.pricePerNight}</span>
    </div>
    <button>BOOK NOW</button>
  </div>
</div>
`;
}

function getAllRooms() {
  fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll")
    .then((response) => response.json())
    .then((data) => {
      rooms.innerHTML = "";
      data.forEach((item) => {
        rooms.innerHTML += showAllRooms(item);
      });
    });
}
getAllRooms();

function showRoomTypes(item) {
  return `
    <span class="roomTypesItem" onclick="showRoomsByCategory(${item.id})">${item.name}</span>
    `;
}

function getRoomTypes() {
  fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes")
    .then((res) => res.json())
    .then((data) =>
      data.forEach((item) => (roomTypes.innerHTML += showRoomTypes(item)))
    );
}
getRoomTypes();

filterForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let formData = new FormData(filterForm);
  let formValues = Object.fromEntries(formData);

  fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetFiltered", {
    method: "POST",
    headers: {
      accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  })
    .then((response) => response.json())
    .then((data) => {
      rooms.innerHTML = "";
      data.forEach((item) => {
        rooms.innerHTML += showRooms(item);
      });
    });
});

function showRooms(item) {
  return `
    <div class="roomCard">
  <img
    src="${item.images[0].source}"
    alt=""
  />
  <div class="roomInfo">
    <div>
      <span class="roomName">${item.name}</span>
      <span class="roomPrice">€ ${item.pricePerNight}</span>
    </div>
    <button>BOOK NOW</button>
  </div>
</div>
`;
}

resetBtn.addEventListener("click", function () {
  location.reload();
});

let today = new Date().toISOString().split("T")[0];
checkIn.setAttribute("min", today);
checkOut.setAttribute("min", today);

checkOut.addEventListener("change", function () {
  let checkInDate = new Date(checkIn.value);
  let checkOutDate = new Date(checkOut.value);

  if (checkOutDate <= checkInDate) {
    alert("Check-out date cannot be earlier than check-in date.");
    checkOut.value = "";
  }
});

function updateDualRange() {
  let minPrice = document.getElementById("minPrice");
  let maxPrice = document.getElementById("maxPrice");
  let minPriceValue = document.getElementById("minPriceValue");
  let maxPriceValue = document.getElementById("maxPriceValue");
  let sliderTrack = document.querySelector(".slider-track");

  if (parseInt(minPrice.value) > parseInt(maxPrice.value)) {
    minPrice.value = maxPrice.value;
  }

  minPriceValue.textContent = minPrice.value;
  maxPriceValue.textContent = maxPrice.value;

  updateSliderTrack();
}

function updateSliderTrack() {
  let minPrice = document.getElementById("minPrice");
  let maxPrice = document.getElementById("maxPrice");
  let sliderTrack = document.querySelector(".slider-track");

  let min = parseInt(minPrice.min);
  let max = parseInt(maxPrice.max);

  let minPercent = ((minPrice.value - min) / (max - min)) * 100;
  let maxPercent = ((maxPrice.value - min) / (max - min)) * 100;

  sliderTrack.style.background = `linear-gradient(to right, #ddd ${minPercent}%, #8ccfd7 ${minPercent}%, #8ccfd7 ${maxPercent}%, #ddd ${maxPercent}%)`;
}
