let favoriteRooms = document.getElementById("favoriteRoomsList");

function showFavoriteCards(item) {
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

function getFavoriteRooms() {
  fetch("https://hotelbooking.stepprojects.ge/api/Rooms/GetAll")
    .then((response) => response.json())
    .then((data) => {
      favoriteRooms.innerHTML = "";
      let limitedRooms = data.slice(0, 6);
      limitedRooms.forEach((item) => {
        favoriteRooms.innerHTML += showFavoriteCards(item);
      });
    });
}
getFavoriteRooms();

function gotoDetails(id) {
  localStorage.setItem("roomId", id);
  window.location.href = "./details.html";
}
