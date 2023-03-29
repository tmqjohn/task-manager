import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  useProjectStore,
  useUserStore,
  useChatStore,
} from "../../../store/store";

import { updateProject } from "../../../helpers/socket";

const Main = () => {
  const { projects, setProjects } = useProjectStore((state) => ({
    projects: state.projects,
    setProjects: state.setProjects,
  }));
  const userDetails = useUserStore((state) => state.userDetails);
  const socket = useChatStore((state) => state.socket);

  useEffect(() => {
    updateProject(socket, () => {
      setProjects();
    });
  }, [socket]);

  const projectsOwned = projects?.map((project, i) => {
    if (project.owner.includes(userDetails._id))
      return (
        <div className="col-2" key={i}>
          <div className="card h-100">
            <div className="card-body">
              <Link
                to={`project/${project._id}`}
                className="hidden stretched-link"
              />
              <h5 className="card-title">{project.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{project.desc}</h6>
              <ul className="card-text">
                {project.membersName?.map((member, i) => (
                  <li className="text-black-50" key={i}>
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
  });

  const projectsIn = projects?.map((project, i) => {
    if (!project.owner.includes(userDetails._id))
      return (
        <div className="col-2" key={i}>
          <div className="card h-100">
            <div className="card-body">
              <Link
                to={`project/${project._id}`}
                className="hidden stretched-link"
              />
              <h5 className="card-title">{project.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{project.desc}</h6>
              <ul className="card-text">
                {project.membersName?.map((member, i) => (
                  <li className="text-black-50" key={i}>
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
  });

  return (
    <>
      {/* /main route */}
      <div className="container-fluid py-2">
        <h2>Projects You Manage</h2>

        <div className="owned-projects container-fluid mb-3">
          <div className="row mt-1 g-3">
            {projectsOwned.filter((project) => project !== undefined).length ? (
              projectsOwned
            ) : (
              <div className="text-secondary">No projects to show</div>
            )}
          </div>
        </div>

        <h2>Projects You're In</h2>
        <div className="in-projects container-fluid">
          <div className="row mt-1 g-3">
            {" "}
            {projectsIn.filter((project) => project !== undefined).length ? (
              projectsIn
            ) : (
              <div className="text-secondary">No projects to show</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
