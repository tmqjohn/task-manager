import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useProjectStore, useChatStore } from "../../../store/store";

import { updateProject, deleteProject } from "../../api/projects";

import { projectChanges } from "../../../helpers/socket";

import ProjectModal from "../../layout/ModalLayout/ProjectModal";
import ConfirmModal from "../../layout/ModalLayout/ConfirmModal";

const ManageProject = ({ projectDefaults, setProjectsDefaults }) => {
  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));
  const socket = useChatStore((state) => state.socket);

  const [ownersId, setOwnersId] = useState([]);

  const titleInput = useRef();
  const descInput = useRef();
  const closeBtnRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    titleInput.current.value = selectedProject[0]?.title;
    descInput.current.value = selectedProject[0]?.desc;

    setOwnersId(selectedProject[0]?.owner);
  }, [projectDefaults]);

  async function handleEdit() {
    if (!titleInput.current.value) {
      toast.dismiss();
      return toast.error("Project title required");
    }

    const updatedProjects = await updateProject(
      selectedProject[0]._id,
      titleInput.current.value,
      descInput.current.value,
      ownersId
    );

    if (updatedProjects) {
      setProjects();
      projectChanges(socket);

      closeBtnRef.current.click();
      toast.dismiss();
      toast.success("Project has been updated successfully!");
    }
  }

  async function handleDelete() {
    let taskIds = [];

    selectedProject[0].groupDetails.map((task) =>
      task.tasks.map((taskId) => taskIds.push(taskId))
    );

    const updatedProjects = await deleteProject(
      selectedProject[0]._id,
      selectedProject[0].owner[0],
      selectedProject[0].groups,
      taskIds,
      selectedProject[0].chatHistory
    );

    if (updatedProjects) {
      setProjects();
      projectChanges(socket);
      navigate("/");

      toast.dismiss();
      toast.success("Project has been deleted successfully!");
    }
  }

  return (
    <>
      <ProjectModal
        id="manageProjectPrompt"
        title="Manage Project"
        inputId={{
          title: "edit-project-title",
          desc: "edit-project-desc",
        }}
        inputRef={{
          titleInput,
          descInput,
          closeBtnRef,
        }}
        handleEdit={handleEdit}
        submitBtnLabel="Update Project"
        projectDefaults={projectDefaults}
      />

      <ConfirmModal
        id="confirmDeletePrompt"
        title={`Are you sure you want to delete '${selectedProject[0]?.title}' project?`}
        body="This will also delete all the groups and tasks in the project. This action cannot be undone."
        submitFunction={async () => await handleDelete()}
        optionalClose={true}
        optionalCloseTarget="#manageProjectPrompt"
        optionalFunction={() => setProjectsDefaults((prev) => !prev)}
      />
    </>
  );
};

export default ManageProject;
