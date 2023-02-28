import React from "react";

import { useProjectStore } from "../../../store/store";

import "./styles/project.css";

const Chat = () => {
  const sampleChatBubble = [
    ["Hi!aaaaaa", true, "Janella"],
    ["Hello!aaaaaaaaaa", false, "John Rey"],
    ["Hello!aaaaaaaaaa", true, "Aishia"],
    ["Hello!aaaaaaaaaa", true, "Janella"],
    ["Hello!aaaaaaaaaa", false, "John Rey"],
  ];

  const selectedProject = useProjectStore((state) => state.selectedProject);

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
            <form autoComplete="off">
              <textarea className="chat-input form-control" />
            </form>
            <button className="btn border border-0 p-0 pe-1 mt-1">
              <img src="/attach_small.svg" /> Attach Files
            </button>
          </div>
          <div className="send-button">
            <button className="btn btn-primary border border-0 p-1">
              <img src="/send_big.svg" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Chat;
