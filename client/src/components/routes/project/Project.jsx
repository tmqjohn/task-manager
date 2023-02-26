import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useProjectStore, useUserStore } from "../../../store/store";

import ManageProject from "./ManageProject";
import Group from "./Group";

const Projects = () => {
  const userDetails = useUserStore((state) => state.userDetails);
  const { projects, selectedProject, setSelectedProject } = useProjectStore(
    (state) => ({
      projects: state.projects,
      selectedProject: state.selectedProject,
      setSelectedProject: state.setSelectedProject,
    })
  );
  const [projectDefaults, setProjectsDefaults] = useState(false);

  let { projectId } = useParams();
  let manageBtn;

  useEffect(() => {
    setSelectedProject(projectId);
  }, [projects, projectId]);

  function handleDefaultInput() {
    setProjectsDefaults((prev) => !prev);
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
      <section className="project-title py-2">
        <div className="settings-divider d-flex">
          <h2 className="">{selectedProject[0]?.title}</h2>
          {manageBtn}
        </div>

        <p className="text-secondary m-0 fs-6">{selectedProject[0]?.desc}</p>
      </section>

      <Group selectedProject={selectedProject} userDetails={userDetails} />

      <ManageProject
        projectDefaults={projectDefaults}
        setProjectsDefaults={setProjectsDefaults}
      />
    </>
  );
};

export default Projects;
