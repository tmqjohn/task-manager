import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import {
  useProjectStore,
  useUserStore,
  useChatStore,
} from "../../../store/store";

import { updateNewChat } from "../../api/chat";

import { sendMessage, receiveMessage } from "../../../helpers/socket";

const Chat = () => {
  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));
  const userDetails = useUserStore((state) => state.userDetails);
  const socket = useChatStore((state) => state.socket);

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
      name: userDetails.fullName,
      message: chatRef.current.value,
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
                    {chat.message}
                  </div>
                </div>
              ) : (
                <div className="other-chat-container d-flex flex-shrink-0 flex-column m-1">
                  <div className="other-chat-name text-muted">{chat.name}</div>
                  <div className="other-chat text-bg-secondary border rounded-5 p-2 align-self-baseline">
                    {chat.message}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="scroll-end-placeholder" ref={chatScrollEndRef} />
        </section>
        <section className="offcanvas-footer d-flex border border-top p-3">
          <div className="input-send-divider w-100 h-100 me-2">
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
                onSubmit={() => handleSendMessage()}
                required
              />
            </form>
            <button className="btn border border-0 p-0 pe-1 mt-1">
              <img
                width="20"
                src="https://img.icons8.com/color/48/null/google-drive--v2.png"
              />{" "}
              Google Drive
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
