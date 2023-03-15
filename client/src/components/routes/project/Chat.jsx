import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useDrivePicker from "react-google-drive-picker";

import {
  useProjectStore,
  useUserStore,
  useChatStore,
  useGoogleStore,
} from "../../../store/store";

import { updateNewChat } from "../../api/chat";

import { sendMessage, receiveMessage } from "../../../helpers/socket";

const Chat = ({ chatBtnRef }) => {
  const [openPicker, authResponse] = useDrivePicker();

  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));
  const userDetails = useUserStore((state) => state.userDetails);
  const socket = useChatStore((state) => state.socket);
  const accessToken = useGoogleStore((state) => state.accessToken);

  const [chatHistory, setChatHistory] = useState([]);

  const chatRef = useRef();
  const chatScrollEndRef = useRef();

  let { projectId } = useParams();

  useEffect(() => {
    setChatHistory(selectedProject[0]?.chatHistoryDetails.chatHistory);
  }, [selectedProject]);

  useEffect(() => {
    chatScrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, selectedProject]);

  async function handleSendMessage() {
    const newChat = {
      message: {
        text: chatRef.current.value,
      },
      messageType: "chat",
      name: userDetails.fullName,
    };
    const chatId = selectedProject[0].chatHistory;

    const isSuccess = await updateNewChat(newChat, chatId);

    if (isSuccess) {
      sendMessage({ ...newChat, room: projectId }, socket);

      await setChatHistory((prev) => [
        ...prev,
        { ...newChat, room: projectId },
      ]);

      setProjects();

      chatRef.current.value = "";
    }
  }

  useEffect(() => {
    receiveMessage(socket, (chat) => {
      setChatHistory((prev) => [...prev, chat]);

      setProjects();
    });
  }, [socket]);

  function handleOpenPicker() {
    chatBtnRef.current.click();

    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_API_KEY,
      viewId: "DOCS",
      token: accessToken.access_token,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      customScopes: ["https://www.googleapis.com/auth/drive"],
      callbackFunction: (data) => {
        handleAttachFile(data);
      },
    });
  }

  async function handleAttachFile(data) {
    if (data.docs) {
      const newChat = {
        message: {
          text: data.docs[0].name,
          url: data.docs[0].url,
        },
        messageType: "link",
        name: userDetails.fullName,
      };
      const chatId = selectedProject[0].chatHistory;

      const isSuccess = await updateNewChat(newChat, chatId);

      if (isSuccess) {
        sendMessage({ ...newChat, room: projectId }, socket);

        await setChatHistory((prev) => [
          ...prev,
          { ...newChat, room: projectId },
        ]);

        setProjects();

        chatBtnRef.current.click();
      }
    }

    if (data.action === "cancel") chatBtnRef.current.click();
  }

  return (
    <>
      <div className="offcanvas offcanvas-end" id="chatSystem">
        <section className="offcanvas-header border border-bottom">
          <h5 className="project-chat-title">{selectedProject[0]?.title}</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </section>
        <section className="offcanvas-body">
          {chatHistory?.map((chat, i) => (
            <div className="chat-container d-flex flex-column" key={i}>
              {chat.name === userDetails.fullName ? (
                <div className="me-chat-container d-flex align-self-end">
                  <div
                    className="me-chat-message text-bg-primary border rounded-5 p-2 m-1"
                    key={i}
                  >
                    {chat.messageType === "chat" ? (
                      chat.message.text
                    ) : (
                      <a className="text-white" href={chat.message.url}>
                        {chat.message.text}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="other-chat-container d-flex flex-shrink-0 flex-column m-1">
                  <div className="other-chat-name text-muted">{chat.name}</div>
                  <div className="other-chat text-bg-secondary border rounded-5 p-2 align-self-baseline">
                    {chat.messageType === "chat" ? (
                      chat.message.text
                    ) : (
                      <a className="text-white" href={chat.message.url}>
                        {chat.message.text}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="scroll-end-placeholder" ref={chatScrollEndRef} />
        </section>
        <section className="offcanvas-footer d-flex border border-top p-3">
          <div className="input-send-divider w-100 d-flex flex-column me-2">
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                className="chat-input form-control"
                ref={chatRef}
                onSubmit={handleSendMessage}
                required
              />
            </form>
            <button
              className="btn align-self-baseline border border-0 p-0 pe-1 mt-1"
              onClick={handleOpenPicker}
            >
              <img
                width="20"
                src="https://img.icons8.com/color/48/null/google-drive--v2.png"
              />{" "}
              Attach Files
            </button>
          </div>
          <div className="send-button">
            <button
              className="btn btn-primary border border-0 p-1"
              onClick={() => handleSendMessage()}
            >
              <img src="/send_big.svg" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Chat;
