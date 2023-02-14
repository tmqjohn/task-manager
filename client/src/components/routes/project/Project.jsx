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
        <h2 className="">{showProject[0]?.title}</h2>
        <p className="text-secondary fs-6">{showProject[0]?.desc}</p>
      </div>
    </>
  );
};

export default Projects;
