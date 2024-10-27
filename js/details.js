let roomId = localStorage.getItem("roomId");
let imgSlider = document.getElementById("sliderImages");
let detailRoomName = document.getElementById("detailRoomName");
let bookingForm = document.getElementById("bookingForm");
let addInfo = document.getElementById("addInfo");
let checkIn = document.getElementById("checkin");
let checkOut = document.getElementById("checkout");
let loading = document.getElementById("loading");
let burgerBtn = document.getElementById("burger");
let burgerMenu = document.getElementById("mobileMenu");
let filterErrorResult = document.getElementById("filterErrorResult");
let filterSuccessResult = document.getElementById("filterSuccessResult");
let anyInfoResult = document.getElementById("anyInfoResult");
let errorBox = document.getElementById("errorBox");
let successBox = document.getElementById("successBox");
let anyInfoBox = document.getElementById("anyInfoBox");

burgerBtn.addEventListener("click", function () {
  burgerMenu.classList.toggle("hidden");
  burgerBtn.classList.toggle("burgerToggle");
});

let today = new Date().toISOString().split("T")[0];
checkIn.setAttribute("min", today);
checkOut.setAttribute("min", today);

checkOut.addEventListener("change", function () {
  let checkInDate = new Date(checkIn.value);
  let checkOutDate = new Date(checkOut.value);

  if (checkOutDate <= checkInDate) {
    errorBox.style.opacity = 1;
    errorBox.style.transform = "translateY(20px)";
    filterErrorResult.innerText =
      "Check-out date cannot be earlier than check-in date!";
    setTimeout(() => {
      errorBox.style.transform = "translateY(-100px)";
    }, 1500);
    checkOut.value = "";
  }
});

function getRoomsForDetails() {
  fetch(`https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${roomId}`)
    .then((res) => res.json())
    .then((data) => {
      imgSlider.innerHTML = roomInfoImg(data);
      detailRoomName.innerHTML = roomInfoName(data);
      addInfo.innerHTML = additionalRoomInfo(data);
    });
}
getRoomsForDetails();
function roomInfoImg(item) {
  const images = item.images
    .map((img) => `<img src="${img.source}" alt="">`)
    .join("");
  return images;
}

let currentSlide = 0;

function setupSlider(images) {
  sliderImages.innerHTML = images
    .map((img) => `<img src="${img.source}" alt="">`)
    .join("");
  showSlide(currentSlide);
}

function changeSlide(n) {
  const slides = document.querySelectorAll(".slides img");
  currentSlide = (currentSlide + n + slides.length) % slides.length;
  showSlide(currentSlide);
}

setInterval(() => {
  changeSlide(1);
}, 5000);

function showSlide(n) {
  const slides = document.querySelector(".slides");
  const slideWidth = slides.children[n].clientWidth;
  slides.style.transform = `translateX(-${n * slideWidth}px)`;
}

function roomInfoName(item) {
  return ` 
    <p>${item.name}</p>
    <span>€ ${item.pricePerNight} - <span class="miniInfo">a night</span></span>
   `;
}

function additionalRoomInfo(item) {
  return ` 
            <span>Name: <span>${item.name}</span></span>
            <span
              >Availability: ${
                item.available
                  ? `<i class="fi fi-ss-check-circle"></i
              >`
                  : `<i class="fi fi-ss-cross-circle"></i
              >`
              }</span>
            <span>Price: <span>€ ${item.pricePerNight}</span></span>
            <span>Max Guests: <span>${item.maximumGuests}</span></span>
            <span>Room ID: <span>${item.id}</span></span>
     `;
}

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let myForm = new FormData(bookingForm);
  let formInfo = Object.fromEntries(myForm);
  formInfo["roomID"] = roomId;

  fetch("https://hotelbooking.stepprojects.ge/api/Booking", {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formInfo),
  })
    .then((res) => res.text())
    .then((pasuxi) => {
      anyInfoBox.style.opacity = 1;
      anyInfoBox.style.transform = "translateY(20px)";
      anyInfoResult.innerText = pasuxi;
      setTimeout(() => {
        anyInfoBox.style.transform = "translateY(-100px)";
        bookingForm.reset();
      }, 2000);
    })
    .catch((err) => {
      errorBox.style.opacity = 1;
      errorBox.style.transform = "translateY(20px)";
      filterErrorResult.innerText = err;
      setTimeout(() => {
        errorBox.style.transform = "translateY(-100px)";
      }, 2000);
    });
});
