import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useProjectStore } from "../../../store/store";

import { addNewGroup, updateGroup, deleteGroup } from "../../api/group";
import { getUserProjects } from "../../api/projects";

const Group = ({ selectedProject, userDetails }) => {
  const setProject = useProjectStore((state) => state.setProject);

  const [groups, setGroups] = useState([]);

  const [addGroupBtn, setAddGroupBtn] = useState();
  const [editGroupId, setEditGroupId] = useState();

  const { projectId } = useParams();

  const groupTitleInput = useRef();
  const closeBtn = useRef();

  useEffect(() => {
    setAddGroupBtn(
      selectedProject[0]?.owner.includes(userDetails?._id) ? (
        <section className="control-buttons d-flex w-25">
          <button
            className="btn btn-primary p-1 ms-1 mb-2"
            onClick={handleAddGroup}
          >
            <img src="/group_add.svg" /> Add Group
          </button>
        </section>
      ) : null
    );

    setGroups(
      selectedProject[0]?.groupDetails.map((group) => (
        <article className="project-group mt-2" key={group?._id}>
          <div className="group-title d-flex">
            <h4>{group?.title}</h4>

            {selectedProject[0].owner.includes(userDetails?._id) ? (
              <>
                <button className="btn ms-2 p-0" data-bs-toggle="dropdown">
                  <img src="/more.svg" />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="btn dropdown-item"
                      data-bs-target="#editGroupTitle"
                      data-bs-toggle="modal"
                      onClick={() =>
                        handleShowGroupEdit(group?.title, group?._id)
                      }
                    >
                      Edit Group Title
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn dropdown-item"
                      onClick={() => handleRemoveGroup(group?._id)}
                    >
                      Remove Group
                    </button>
                  </li>
                </ul>
              </>
            ) : null}
          </div>

          <table className="table mb-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td colSpan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </article>
      ))
    );
  }, [selectedProject]);

  async function handleAddGroup() {
    const isSuccess = await addNewGroup(projectId);

    if (isSuccess) {
      setProject(await getUserProjects(userDetails._id));
    }
  }

  function handleShowGroupEdit(title, id) {
    groupTitleInput.current.value = title;

    setEditGroupId(id);
  }

  async function handleSubmitEditGroup() {
    const isSuccess = await updateGroup(
      groupTitleInput.current.value,
      editGroupId
    );

    if (isSuccess) {
      setProject(await getUserProjects(userDetails._id));

      closeBtn.current.click();
    }
  }

  async function handleRemoveGroup(id) {
    const isSuccess = await deleteGroup(id, projectId);

    if (isSuccess) {
      setProject(await getUserProjects(userDetails._id));

      toast.dismiss();
      toast.success(isSuccess.message);
    }
  }

  return (
    <>
      <section className="project-content d-flex flex-column flex-fill py-2">
        {addGroupBtn}
        <section className="project-group-list flex-fill">{groups}</section>
      </section>

      <div
        className="modal fade"
        id="editGroupTitle"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Group Title</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="group-title" className="col-form-label">
                Title:
              </label>
              <input
                type="text"
                className="form-control"
                id="group-title"
                ref={groupTitleInput}
                autoComplete="off"
                required
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeBtn}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitEditGroup}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Group;
