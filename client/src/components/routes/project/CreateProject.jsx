import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../api/projects";
import { gapiDriveLoad } from "../../api/google";

import { useProjectStore, useGoogleStore } from "../../../store/store";
import { useUserStore } from "../../../store/store";
import { useChatStore } from "../../../store/store";

import { projectChanges } from "../../../helpers/socket";

import ProjectModal from "../../layout/ModalLayout/ProjectModal";

const CreateProject = ({ clearInputs }) => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const userDetails = useUserStore((state) => state.userDetails);
  const socket = useChatStore((state) => state.socket);
  const { accessToken, setAccessToken } = useGoogleStore((state) => ({
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
  }));

  const titleInput = useRef();
  const descInput = useRef();
  const closeBtnRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    titleInput.current.value = "";
    descInput.current.value = "";
  }, [clearInputs]);

  useEffect(() => {
    gapiDriveLoad();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();

    if (!titleInput.current.value) {
      toast.dismiss();
      return toast.error("Project title required");
    }

    if (Object.keys(accessToken).length === 0) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive",
        callback: async (tokenResponse) => {
          setAccessToken(tokenResponse);

          await autheticated();
        },
      });

      client.requestAccessToken({ prompt: "consent" });
    }

    if (Object.keys(accessToken).length > 0) {
      await autheticated();
    }

    async function autheticated() {
      let fileId;
      const fileMetadata = {
        name: titleInput.current.value,
        mimeType: "application/vnd.google-apps.folder",
      };

      try {
        const file = await window.gapi.client.drive.files.create({
          resource: fileMetadata,
        });

        fileId = file.result.id;
      } catch (error) {
        toast.dismiss();
        return toast.error(error.result.error.message);
      }

      // TODO: Auth when access token is missing // folder transfer ownership, batch permission

      const newProject = await createProject(
        titleInput.current.value,
        descInput.current.value,
        [userDetails._id],
        fileId
      );

      if (newProject) {
        setProjects();
        projectChanges(socket);
        navigate(`/project/${newProject._id}`);

        closeBtnRef.current.click();
        toast.dismiss();
        toast.success("Project has been created successfully!");
      }
    }
  }

  return (
    <ProjectModal
      id="createProjectPrompt"
      title="Create Project"
      inputId={{
        title: "new-project-title",
        desc: "new-project-desc",
      }}
      inputRef={{
        titleInput,
        descInput,
        closeBtnRef,
      }}
      handleCreate={handleCreate}
      submitBtnLabel="Create Project"
    />
  );
};

export default CreateProject;
