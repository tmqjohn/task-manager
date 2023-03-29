import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useProjectStore,
  useChatStore,
  useUserStore,
} from "../../../store/store";

import { addFileId } from "../../api/projects";

import { updateProject, deleteProject } from "../../api/projects";

import { projectChanges } from "../../../helpers/socket";

import ProjectModal from "../../layout/ModalLayout/ProjectModal";
import ConfirmModal from "../../layout/ModalLayout/ConfirmModal";
import { getUserDetails } from "../../api/user";

const ManageProject = ({ projectDefaults, setProjectsDefaults }) => {
  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));
  const socket = useChatStore((state) => state.socket);
  const userDetails = useUserStore((state) => state.userDetails);

  const [ownersId, setOwnersId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const titleInput = useRef();
  const descInput = useRef();
  const closeBtnRef = useRef();
  const newOwnerInput = useRef();

  const navigate = useNavigate();
  const { projectId } = useParams();

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

  async function approveFileOwnership() {
    setIsLoading(true);

    try {
      await selectedProject[0].pendingFile.forEach(async (file) => {
        await window.gapi.client.drive.permissions.create({
          fileId: file.fileId,
          moveToNewOwnersRoot: true,
          transferOwnership: true,
          resource: {
            role: "owner",
            type: "user",
            emailAddress: userDetails.email,
          },
        });

        await window.gapi.client.drive.files.update({
          fileId: file.fileId,
          addParents: selectedProject[0].googleFolderId,
        });

        await addFileId(projectId);

        setProjects();

        setIsLoading(false);
      });

      toast.dismiss();
      toast.success(
        "Files approved are now in your google drive and ownership"
      );
    } catch (error) {
      toast.dismiss();
      return toast.success(error);
    }
  }

  async function transferOwnership() {
    let searchOwnerValue = newOwnerInput.current.value;

    if (!searchOwnerValue) {
      toast.dismiss();
      return toast.error("Please enter a registered username or Gmail account");
    }

    setIsLoading(true);

    const foundUser = await getUserDetails(searchOwnerValue);

    if (foundUser.message) {
      toast.dismiss();
      setIsLoading(false);
      return toast.error(foundUser.message);
    }

    const response = await window.gapi.client.drive.files.list({
      q: `"${selectedProject[0].googleFolderId}" in parents and trashed=false`,
      fields: "files(name, id, sharingUser)",
    });

    const foundFiles = response.result.files;

    await Promise.all(
      foundFiles.map(async (file) => {
        const resultFiles = await window.gapi.client.drive.permissions.create({
          fileId: file.id,
          supportsAllDrives: true,
          moveToNewOwnersRoot: true,
          resource: {
            role: "writer",
            type: "user",
            emailAddress: foundUser.email,
          },
        });

        await window.gapi.client.drive.permissions.update({
          fileId: file.id,
          permissionId: resultFiles.result.id,
          resource: {
            pendingOwner: true,
            role: "writer",
          },
        });
      })
    ).catch((error) => {
      console.log(error);

      toast.dismiss();
      return toast.error(error.result.error.message);
    });

    try {
      const resultFolder = await window.gapi.client.drive.permissions.create({
        fileId: selectedProject[0].googleFolderId,
        supportsAllDrives: true,
        moveToNewOwnersRoot: true,
        resource: {
          role: "writer",
          type: "user",
          emailAddress: foundUser.email,
        },
      });

      await window.gapi.client.drive.permissions.update({
        fileId: selectedProject[0].googleFolderId,
        permissionId: resultFolder.result.id,
        resource: {
          pendingOwner: true,
          role: "writer",
        },
      });
    } catch (error) {
      console.log(error);

      toast.dismiss();
      return toast.error(error.result.error.message);
    }

    const owner = [...selectedProject[0].owner, foundUser._id];
    const isSuccess = await updateProject(projectId, "", "", owner);

    if (isSuccess) {
      setIsLoading(false);

      toast.dismiss();
      return toast.success(
        `'${selectedProject[0].title}' is now pending for ownership approval to user '${foundUser.fullName}'`
      );
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
          newOwner: "edit-project-new-owner",
        }}
        inputRef={{
          titleInput,
          descInput,
          closeBtnRef,
          newOwnerInput,
        }}
        pendingFileCount={selectedProject[0]?.pendingFile?.length}
        handleEdit={handleEdit}
        isLoading={isLoading}
        approveFileOwnership={approveFileOwnership}
        transferOwnership={transferOwnership}
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
