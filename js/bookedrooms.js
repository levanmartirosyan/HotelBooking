let bookedRooms = document.getElementById("bookedRooms");
let loading = document.getElementById("loading");

function sanitizeHTML(string) {
  const div = document.createElement("div");
  div.textContent = string;
  return div.innerHTML;
}

function showBookedRooms(item, hotel, room) {
  return `
    <tr id="booking-${item.id}">
      <td>
        <img src="${sanitizeHTML(
          hotel?.featuredImage || ""
        )}" alt="Hotel Image" />
      </td>
      <td>
        <p>${sanitizeHTML(hotel?.name || "Hotel Name Not Available")}</p>
        <span style="color: #838383">${sanitizeHTML(
          hotel?.city || "City Not Available"
        )}</span>
      </td>
      <td>
        <img src="${sanitizeHTML(
          room?.images?.[0]?.source || ""
        )}" alt="Room Image" />
      </td>
      <td>
        <p>${sanitizeHTML(room?.name || "Room Name Not Available")}</p>
        <span>${sanitizeHTML(
          room?.pricePerNight?.toString() || "Price Not Available"
        )} €</span>
      </td>
      <td class="namePhone">
        <p>Name: ${sanitizeHTML(
          item.customerName == null || "" ? "Not Chosen" : item.customerName
        )}</p>
        <span>Phone: ${sanitizeHTML(
          item.customerPhone == null || "" ? "Not Chosen" : item.customerPhone
        )}</span>
      </td>
      <td></td>
      <td></td>
      <td>
        <span class="status">${sanitizeHTML(
          item.isConfirmed ? "Booked" : "Unconfirmed"
        )}</span>
      </td>
      <td>
        <p>${sanitizeHTML(item.checkInDate.slice(0, 10))}</p>
      </td>
      <td>
        <p>${sanitizeHTML(item.checkOutDate.slice(0, 10))}</p>
      </td>
      <td>
        <p>${sanitizeHTML(item.totalPrice.toString())} €</p>
      </td>
      <td>
        <button onclick="cancelBooking(${item.id})">CANCEL BOOKING</button>
      </td>
    </tr>
  `;
}

async function getBookedRooms() {
  loading.style.display = "block";
  try {
    const bookedRoomsResponse = await fetch(
      "https://hotelbooking.stepprojects.ge/api/Booking"
    );
    const bookedRoomsData = await bookedRoomsResponse.json();

    const hotelsResponse = await fetch(
      "https://hotelbooking.stepprojects.ge/api/Hotels/GetAll"
    );
    const hotelsData = await hotelsResponse.json();

    const roomsResponse = await fetch(
      "https://hotelbooking.stepprojects.ge/api/Rooms/GetAll"
    );
    const roomsData = await roomsResponse.json();

    bookedRooms.innerHTML = "";

    bookedRoomsData.forEach((item) => {
      const room = roomsData.find((r) => r.id === item.roomID);
      const hotel = hotelsData.find((h) => h.id === room?.hotelId);

      bookedRooms.innerHTML += showBookedRooms(item, hotel, room);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.style.display = "none";
  }
}

function cancelBooking(bookingId) {
  fetch(`https://hotelbooking.stepprojects.ge/api/Booking/${bookingId}`, {
    method: "DELETE",
  }).then((response) => {
    if (response) {
      const row = document.getElementById(`booking-${bookingId}`);
      if (row) row.remove();
      alert("Booking canceled successfully.");
    } else {
      alert("Failed to cancel booking.");
    }
  });
}
getBookedRooms();
