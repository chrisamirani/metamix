export const getUserRooms = async () => {
  const res = await fetch("/user/rooms");
  const data = await res.json();

  return data;
};

export const addRoomFurniture = async (roomId, furniture) => {
  if (!roomId || !furniture) return;

  const res = await fetch("/add-furniture", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId,
      furniture,
    }),
  });
};
