let hotels = document.getElementById("hotels");
let burgerBtn = document.getElementById("burger");
let burgerMenu = document.getElementById("mobileMenu");

burgerBtn.addEventListener("click", function () {
  burgerMenu.classList.toggle("hidden");
  burgerBtn.classList.toggle("burgerToggle");
});

function getAllHotels() {
  fetch("https://hotelbooking.stepprojects.ge/api/Hotels/GetAll")
    .then((response) => response.json())
    .then((data) => {
      hotels.innerHTML = "";
      data.forEach((item) => {
        hotels.innerHTML += showAllHotels(item);
      });
    });
}
getAllHotels();

function showAllHotels(item) {
  return `
                <div class="roomCard">
              <img
                src="${item.featuredImage}"
                alt=""
              />
              <div class="roomInfo">
                <div>
                  <span class="roomName">${item.name}</span>
                </div>
                <button onclick="goToRoomsPage()">VIEW ROOMS</button>
              </div>
            </div>
      `;
}

function goToRoomsPage() {
  window.location.href = "./rooms.html";
}
