const { Router } = require("express");

const chatController = require("../controllers/chatControllers");

const router = Router();

router
  .route("/")
  .get(chatController.getAllChats) // gets all chat history
  .post(chatController.addNewChat); // adds a new chat history

router
  .route("/:chatId")
  .patch(chatController.updateChat) // updates/inserts a new entry for chat
  .delete(chatController.deleteChat); // delete a chat history

module.exports = router;
