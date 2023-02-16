import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { shallow } from "zustand/shallow";

import CreateProject from "../../routes/root/CreateProject";

import { getUserProjects } from "../../api/projects";
import { useProjectStore, useUserStore } from "../../../store/store";

const SidePanel = () => {
  const userDetails = useUserStore((state) => state.userDetails);
  const { projects, setProject } = useProjectStore(
    (state) => ({
      projects: state.projects,
      setProject: state.setProject,
    }),
    shallow
  );

  useEffect(() => {
    const fetchProjects = async () => {
      setProject(await getUserProjects(userDetails._id));
    };

    fetchProjects();
  }, [userDetails._id]);

  let projectList = projects?.map((project, i) => (
    <Link
      to={`project/${project._id}`}
      className="list-group-item list-group-item-action border-bottom"
      key={i}
    >
      <img src="/project_list.svg" />
      {project.title}
    </Link>
  ));

  return (
    <>
      <section className="side-panel pe-4 flex-grow-0 flex-shrink-0">
        {/* TODO: populate list with projects, mixed with as owner or as member */}
        <ul className="list-group list-group-flush">
          <Link to="/" className="list-group-item list-group-item-action">
            <img src="/home.svg" />
            Home
          </Link>
          <div className="d-flex projects-title-add pt-2">
            <h5 className="m-0">Your Projects</h5>

            <button
              className="btn ms-auto p-0"
              data-bs-toggle="modal"
              data-bs-target="#createProjectPrompt"
            >
              <img src="/add.svg" />
            </button>
          </div>

          {projectList}
        </ul>
      </section>

      {/* create project pop-up */}
      <CreateProject />
    </>
  );
};

export default SidePanel;
