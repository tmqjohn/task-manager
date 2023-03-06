import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  useProjectStore,
  useUserStore,
  useChatStore,
} from "../../../store/store";

import { sendMessage, receiveMessage } from "../../../helpers/socket";

import "./styles/project.css";

// TODO: declare at MainInit socket and put socket in store

const Chat = () => {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const userDetails = useUserStore((state) => state.userDetails);
  const socket = useChatStore((state) => state.socket);

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  let { projectId } = useParams();

  const sampleChatBubble = [
    ["Hi!aaaaaa", true, "Janella Reine Tungul"],
    ["Hello!aaaaaaaaaaaaaaaaaaaa", false, "John Rey Tungul"],
    ["Hello!aaaaaaaaaa", true, "Aishia Echague"],
    ["Hello!aaaaaaaaaa", true, "Janella Tungul"],
    ["Hello!aaaaaaaaaa", false, "John Rey Tungul"],
  ];

  function handleSendMessage() {
    sendMessage(
      {
        name: userDetails.fullName,
        room: projectId,
        message,
      },
      socket
    );
  }

  useEffect(() => {
    receiveMessage(socket, (message) => {
      setMessageReceived(message);
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
          {sampleChatBubble.map((chat, i) => (
            <div className="chat-container d-flex" key={i}>
              {chat[1] ? (
                <div className="other-chat-container d-flex flex-column me-auto m-1">
                  <div className="other-chat-name text-muted">{chat[2]}</div>
                  <div className="other-chat text-bg-secondary border rounded-5 p-2">
                    {chat[0]}
                  </div>
                </div>
              ) : (
                <div className="me-chat text-bg-primary border rounded-5 p-2 ms-auto m-1">
                  {chat[0]}
                </div>
              )}
            </div>
          ))}
        </section>
        <section className="offcanvas-footer d-flex flex-row border border-top p-3">
          <div className="input-send-divider w-100 h-100 me-2">
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <textarea
                className="chat-input form-control"
                onChange={(event) => setMessage(event.target.value)}
              />
            </form>
            <button className="btn border border-0 p-0 pe-1 mt-1">
              <img src="/attach_small.svg" /> Attach Files
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
