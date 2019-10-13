import http from "./httpService";

async function getRooms() {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/rooms`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function getAvailableRooms(checkIn, checkOut, bookingId = null) {
  try {
    const { data: availableRooms } = await http.post(
      `${http.baseUrl}/rooms/available`,
      {
        checkIn,
        checkOut,
        bookingId
      }
    );
    return availableRooms;
  } catch (error) {
    console.log(error);
  }
}

export default { getRooms, getAvailableRooms };
