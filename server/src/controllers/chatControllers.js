const asyncHandler = require("express-async-handler");
const Chat = require("../schema/ChatSchema");

/**@ GET request
 * gets all the chats
 * /api/chat
 */
const getAllChats = asyncHandler(async (req, res) => {
  const foundChats = await Chat.find().lean();

  return res.status(200).json(foundChats);
});

/**@ POST request
 * add new chat
 * /api/chat
 */
const addNewChat = asyncHandler(async (req, res) => {
  const { chatHistory } = req.body;

  const newChat = new Chat({
    chatHistory,
  });

  const savedChat = await newChat.save();

  return res.status(200).json(savedChat);
});

/**@ PATCH request
 * update chat
 * /api/chat/:chatId
 */
const updateChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { chatHistory } = req.body;

  const foundChat = await Chat.findById(chatId).exec();

  foundChat.chatHistory = [...foundChat.chatHistory, ...chatHistory];

  const result = await foundChat.save();

  if (result === foundChat) {
    res.status(200).json({ message: "Chat successfully updated", result });
  } else {
    res.status(400).json({ message: "There was an error updating chats." });
  }
});

/**@ DELETE request
 * delete chat
 * /api/chat/:chatId
 */
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const result = await Chat.findByIdAndDelete(chatId).exec();
  console.log(result);

  if (result.acknowledged) {
    res.status(200).json({ message: "Chat successfully deleted" });
  } else {
    res.status(400).json({ message: "There was an error deleting the chat" });
  }
});

module.exports = {
  getAllChats,
  addNewChat,
  updateChat,
  deleteChat,
};
