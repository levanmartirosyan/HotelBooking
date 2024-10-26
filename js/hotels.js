let hotels = document.getElementById("hotels");

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
