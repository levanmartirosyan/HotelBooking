let cities = document.getElementById("cities");
let hotels = document.getElementById("hotels");

async function getAllHotels() {
  let hotelList = await fetch(
    "https://hotelbooking.stepprojects.ge/api/Hotels/GetAll"
  );
  return hotelList.json();
}

getAllHotels().then((data) => {
  hotels.innerHTML = "";
  data.forEach((item) => {
    hotels.innerHTML += showAllHotels(item);
  });
});

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
                <button>VIEW ROOMS</button>
              </div>
            </div>
      `;
}
