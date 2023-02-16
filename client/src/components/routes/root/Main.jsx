import React from "react";
import { Link } from "react-router-dom";

import { useProjectStore, useUserStore } from "../../../store/store";

const Main = () => {
  const projects = useProjectStore((state) => state.projects);
  const userDetails = useUserStore((state) => state.userDetails);

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
        <h6 className="main-section-title pb-2">
          Good day, {userDetails.fullName}!
        </h6>

        {/* TODO: populate projects owned */}
        <p className="fs-3">Projects You Own</p>

        <div className="owned-projects container-fluid">
          <div className="row g-3">{projectsOwned}</div>
        </div>

        {/* TODO: populate projects you're member */}
        <p className="fs-3 mt-3">Projects You're In</p>

        <div className="in-projects container-fluid">
          <div className="row g-3">{projectsIn}</div>
        </div>
      </div>
    </>
  );
};

export default Main;
