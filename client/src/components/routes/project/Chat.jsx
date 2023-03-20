import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
// import useDrivePicker from "react-google-drive-picker";

import {
  useProjectStore,
  useUserStore,
  useChatStore,
  useGoogleStore,
} from "../../../store/store";

import { updateNewChat } from "../../api/chat";
import { gapiDriveLoad, gapiPickerLoad } from "../../api/google";
import { getUserDetails } from "../../api/user";

import { sendMessage, receiveMessage } from "../../../helpers/socket";

const Chat = ({ chatBtnRef }) => {
  // const [openPicker, authResponse] = useDrivePicker();

  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));
  const userDetails = useUserStore((state) => state.userDetails);
  const socket = useChatStore((state) => state.socket);
  const { accessToken, setAccessToken } = useGoogleStore((state) => ({
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
  }));

  const [chatHistory, setChatHistory] = useState([]);

  const chatRef = useRef();
  const chatScrollEndRef = useRef();

  let { projectId } = useParams();

  useEffect(() => {
    gapiPickerLoad();
    gapiDriveLoad();
  }, []);

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

  async function handleOpenPicker() {
    chatBtnRef.current.click();

    const showPicker = (token) => {
      const view = new google.picker.View(google.picker.ViewId.DOCS);
      const uploadView = new google.picker.DocsUploadView();

      const picker = new google.picker.PickerBuilder()
        .addView(view)
        .addView(uploadView)
        .enableFeature(google.picker.Feature.MINE_ONLY)
        .setOAuthToken(token)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
        .setCallback(async (data) => {
          await handleAttachFile(data);
        })
        .build();

      picker.setVisible(true);
    };

    if (Object.keys(accessToken).length === 0) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive",
        callback: (tokenResponse) => {
          setAccessToken(tokenResponse);

          showPicker(tokenResponse.access_token);
        },
      });

      client.requestAccessToken({ prompt: "consent" });
    }

    if (Object.keys(accessToken).length > 0) {
      showPicker(accessToken.access_token);
    }
  }

  async function handleAttachFile(data) {
    if (data.docs) {
      const selectedFile = data.docs[0];

      const newChat = {
        message: {
          text: selectedFile.name,
          url: selectedFile.url,
        },
        messageType: "link",
        name: userDetails.fullName,
      };
      const chatId = selectedProject[0].chatHistory;
      const emailAddress = await getUserDetails(selectedProject[0].owner[0]);

      chatBtnRef.current.click();

      try {
        const { result } = await window.gapi.client.drive.permissions.create({
          fileId: selectedFile.id,
          supportsAllDrives: true,
          fields: "*",
          resource: {
            role: "writer",
            type: "user",
            emailAddress: emailAddress.email,
          },
        });

        const response = await window.gapi.client.drive.permissions.update({
          fileId: selectedFile.id,
          permissionId: result.id,
          resource: {
            pendingOwner: true,
            role: "writer",
          },
        });

        console.log(response);
      } catch (error) {
        console.log(error);
      }

      const isSuccess = await updateNewChat(newChat, chatId);

      if (isSuccess) {
        sendMessage({ ...newChat, room: projectId }, socket);

        await setChatHistory((prev) => [
          ...prev,
          { ...newChat, room: projectId },
        ]);

        setProjects();
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
