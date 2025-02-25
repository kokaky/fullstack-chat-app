import Room from "../models/room_model.js";

export const getRoomId = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    // 从数据库中获取roomId
    const filterRoomId = await Room.find({
      roomId: roomId,
    });
    console.log(filterRoomId);

    res.status(200).json(filterRoomId);
  } catch (error) {
    console.log("错误发生在获取roomIdController中:", error);
    res.status(500).json({ error: "服务器错误，请稍后再试" });
  }
};

export const removeRoomId = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    //从数据库中删除对应roomId
    await Room.deleteMany({ roomId: roomId });
    res.status(200).json({ result: "删除成功" });
  } catch (error) {
    console.log("错误发生在获取roomIdController中:", error);
    res.status(500).json({ error: "服务器错误，请稍后再试" });
  }
};
