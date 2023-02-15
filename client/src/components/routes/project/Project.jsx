import React from "react";
import { useParams } from "react-router-dom";

import { useProjectStore } from "../../../store/store";

const Projects = () => {
  const projects = useProjectStore((state) => state.projects);

  let { projectId } = useParams();

  const showProject = projects.filter((project) => project._id == projectId);

  return (
    <>
      <div className="project-title ps-2 pt-2">
        <div className="d-flex">
          <h2 className="">{showProject[0]?.title}</h2>
          <button className="btn ms-auto">
            <img src="/project_settings.svg" /> Settings
          </button>
        </div>

        <p className="text-secondary fs-6">{showProject[0]?.desc}</p>
      </div>
    </>
  );
};

export default Projects;
