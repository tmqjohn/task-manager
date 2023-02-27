import React, { useState } from "react";
import { Link } from "react-router-dom";

import CreateProject from "../../routes/project/CreateProject";

import { useProjectStore } from "../../../store/store";

const SidePanel = () => {
  const [clearInputs, setClear] = useState(false);
  const projects = useProjectStore((state) => state.projects);

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

  function handleDefault() {
    setClear((prev) => !prev);
  }

  return (
    <>
      <section className="side-panel pe-4 flex-grow-0 flex-shrink-0">
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
              onClick={handleDefault}
            >
              <img src="/add_big.svg" />
            </button>
          </div>

          {projectList}
        </ul>
      </section>

      {/* create project pop-up */}
      <CreateProject clearInputs={clearInputs} />
    </>
  );
};

export default SidePanel;
