import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useProjectStore, useGroupStore } from "../../../store/store";

import { addNewGroup, updateGroup, deleteGroup } from "../../api/group";

import ConfirmModal from "../../layout/ModalLayout/ConfirmModal";
import GroupsModal from "../../layout/ModalLayout/GroupsModal";

const Group = ({ selectedProject, userDetails }) => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const { groups, setGroups } = useGroupStore((state) => ({
    groups: state.groups,
    setGroups: state.setGroups,
  }));

  const [addGroupBtn, setAddGroupBtn] = useState();
  const [groupId, setGroupId] = useState();
  const [groupName, setGroupName] = useState();

  const { projectId } = useParams();

  const groupTitleNewInput = useRef();
  const groupTitleEditInput = useRef();
  const closeEditBtn = useRef();
  const closeNewBtn = useRef();

  useEffect(() => {
    setAddGroupBtn(
      selectedProject[0]?.owner.includes(userDetails?._id) ? (
        <>
          <section className="control-buttons d-flex w-25">
            <button
              className="btn btn-primary p-1 ms-1 mb-2"
              data-bs-target="#addGroupPrompt"
              data-bs-toggle="modal"
              onClick={handleShowGroupAdd}
            >
              <img src="/group_add.svg" /> Add Group
            </button>
          </section>
        </>
      ) : null
    );

    setGroups(selectedProject[0]?.groupDetails);
  }, [selectedProject]);

  function handleShowGroupAdd() {
    groupTitleNewInput.current.value = "";
  }

  async function handleAddGroup() {
    const isSuccess = await addNewGroup(
      projectId,
      groupTitleNewInput.current.value
    );

    if (isSuccess) {
      setProjects();

      closeNewBtn.current.click();
    }
  }

  function handleShowGroupEdit(title, id) {
    groupTitleEditInput.current.value = title;

    setGroupId(id);
  }

  async function handleSubmitEditGroup() {
    const isSuccess = await updateGroup(
      groupTitleEditInput.current.value,
      groupId
    );

    if (isSuccess) {
      setProjects();

      closeEditBtn.current.click();
    }
  }

  function handleShowRemoveGroup(title, id) {
    setGroupId(id);
    setGroupName(title);
  }

  async function handleRemoveGroup() {
    const isSuccess = await deleteGroup(groupId, projectId);

    if (isSuccess) {
      setProjects();

      toast.dismiss();
      toast.success(isSuccess.message);
    }
  }

  return (
    <>
      <section className="project-content d-flex flex-column flex-fill py-2">
        {addGroupBtn}

        <section className="project-group-list flex-fill">
          {groups?.map((group) => (
            <article className="project-group mt-2" key={group._id}>
              <div className="group-title d-flex">
                <h4>{group.title}</h4>

                {selectedProject[0].owner.includes(userDetails?._id) ? (
                  <>
                    <button className="btn ms-2 p-0" data-bs-toggle="dropdown">
                      <img src="/more.svg" />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="btn dropdown-item"
                          data-bs-target="#editGroupTitlePrompt"
                          data-bs-toggle="modal"
                          onClick={() =>
                            handleShowGroupEdit(group.title, group._id)
                          }
                        >
                          Edit Group Title
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn dropdown-item"
                          data-bs-target="#confirmDeleteGroupPrompt"
                          data-bs-toggle="modal"
                          onClick={() =>
                            handleShowRemoveGroup(group.title, group._id)
                          }
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
          ))}
        </section>
      </section>

      <GroupsModal
        id="addGroupPrompt"
        title="Add New Group"
        inputId="group-new-title"
        inputTitleRef={groupTitleNewInput}
        closeBtnRef={closeNewBtn}
        submitFunction={async () => await handleAddGroup()}
        submitBtnLabel="Add"
      />

      <GroupsModal
        id="editGroupTitlePrompt"
        title="Edit Group Title"
        inputId="group-edit-title"
        inputTitleRef={groupTitleEditInput}
        closeBtnRef={closeEditBtn}
        submitFunction={async () => await handleSubmitEditGroup()}
        submitBtnLabel="Update"
      />

      <ConfirmModal
        id="confirmDeleteGroupPrompt"
        title={`Are you sure you want to delete '${groupName}' group?`}
        body="This action cannot be undone."
        submitFunction={async () => await handleRemoveGroup()}
      />
    </>
  );
};

export default Group;
