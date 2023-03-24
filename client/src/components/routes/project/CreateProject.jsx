import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../api/projects";
import { getUserDetails } from "../../api/user";

import { useProjectStore } from "../../../store/store";
import { useUserStore } from "../../../store/store";
import { useChatStore } from "../../../store/store";

import { projectChanges } from "../../../helpers/socket";

import ProjectModal from "../../layout/ModalLayout/ProjectModal";

const CreateProject = ({ clearInputs }) => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const userDetails = useUserStore((state) => state.userDetails);
  const socket = useChatStore((state) => state.socket);

  const titleInput = useRef();
  const descInput = useRef();
  const closeBtnRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    titleInput.current.value = "";
    descInput.current.value = "";
  }, [clearInputs]);

  async function handleCreate(e) {
    e.preventDefault();

    if (!titleInput.current.value) {
      toast.dismiss();
      return toast.error("Project title required");
    }

    const newProject = await createProject(
      titleInput.current.value,
      descInput.current.value,
      [userDetails._id]
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
