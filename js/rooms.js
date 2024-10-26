let roomTypes = document.getElementById("roomTypes");
let rooms = document.getElementById("rooms");
let filterForm = document.getElementById("filterForm");
let cards = document.getElementById("cards");
let resetBtn = document.getElementById("resetBtn");
let checkIn = document.getElementById("checkin");
let checkOut = document.getElementById("checkout");
let loading = document.getElementById("loading");

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
    <button onclick="gotoDetails(${item.id})">BOOK NOW</button>
  </div>
</div>
`;
}

function getAllRooms() {
  loading.style.display = "block";
  fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll")
    .then((response) => response.json())
    .then((data) => {
      rooms.innerHTML = "";
      data.forEach((item) => {
        rooms.innerHTML += showAllRooms(item);
        loading.style.display = "none";
      });
    });
}
getAllRooms();

function showRoomTypes(item) {
  return `
    <span class="roomTypesItem" onclick="showRoomsByCategory(${item.roomTypeId})">${item.name}</span>
    `;
}

function showRoomsByCategory(roomTypeId) {
  fetch(`https://hotelbooking.stepprojects.ge/api/Rooms/GetAll`)
    .then((response) => response.json())
    .then((finalData) => {
      const filteredRooms = finalData.filter(
        (room) => room.roomTypeId === roomTypeId
      );
      console.log(filteredRooms);

      rooms.innerHTML = "";
      rooms.innerHTML += showAllRooms(filteredRooms);
    });
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

  document.getElementById("minPriceValue").innerText = `€ ${minPrice.value}`;
  document.getElementById("maxPriceValue").innerText = `€ ${maxPrice.value}`;
}

document
  .getElementById("minPrice")
  .addEventListener("input", updateSliderTrack);
document
  .getElementById("maxPrice")
  .addEventListener("input", updateSliderTrack);

function gotoDetails(id) {
  localStorage.setItem("roomId", id);
  window.location.href = "./details.html";
}
