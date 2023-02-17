import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ManageProject from "./ManageProject";

import { useProjectStore, useUserStore } from "../../../store/store";

const Projects = () => {
  const projects = useProjectStore((state) => state.projects);
  const userDetails = useUserStore((state) => state.userDetails);
  const [selectedProject, setSelectedProject] = useState([]);
  const [projectDefaults, setProjectDefaults] = useState(false);

  let { projectId } = useParams();
  let manageBtn;

  useEffect(() => {
    setSelectedProject(
      projects?.filter((selectedProject) => selectedProject._id === projectId)
    );
  }, [projects, projectId]);

  function handleDefaultInput() {
    setProjectDefaults((prev) => !prev);
  }

  if (selectedProject[0]) {
    manageBtn = selectedProject[0].owner.includes(userDetails?._id) ? (
      <button
        className="btn ms-auto"
        data-bs-toggle="modal"
        data-bs-target="#manageProjectPrompt"
        onClick={handleDefaultInput}
      >
        <img src="/project_settings.svg" /> Manage Project
      </button>
    ) : null;
  }

  return (
    <>
      <div className="project-title ps-2 pt-2">
        <div className="d-flex">
          <h2 className="">{selectedProject[0]?.title}</h2>
          {manageBtn}
        </div>

        <p className="text-secondary fs-6">{selectedProject[0]?.desc}</p>
      </div>

      <ManageProject
        selectedProject={selectedProject}
        projectDefaults={projectDefaults}
        setProjectDefaults={setProjectDefaults}
      />
    </>
  );
};

export default Projects;
