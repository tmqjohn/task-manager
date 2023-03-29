import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @GET request
 * http://serverurl/api/projects/:id
 */
export async function getUserProjects(id) {
  try {
    if (id) {
      const response = await axios.get(`api/project/user/${id}`);

      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * @POST request
 * http://serverurl/api/projects/
 */
export async function createProject(title, desc, owner, googleFolderId) {
  try {
    const chatId = await axios.post("api/chat");
    const response = await axios.post("api/project/", {
      title,
      desc,
      owner,
      chatId: chatId.data._id,
      googleFolderId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @PATCH request
 * http://serverurl/api/projects/:projectId
 */

export async function updateProject(id, title, desc, owner) {
  try {
    await axios.patch(`api/project/${id}`, {
      title,
      desc,
      owner,
    });

    const response = await getUserProjects(owner[0]);

    return response;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @PATCH request
 * http://serverurl/api/projects/:projectId
 */

export async function updateMemberList(id, members) {
  try {
    const response = await axios.patch(`api/project/${id}/members/update/`, {
      members,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @PATCH request
 * http://serverurl/api/projects/:projectId
 */
export async function addFileId(id, pendingFile) {
  try {
    await axios.patch(`api/project/${id}/file/add`, {
      pendingFile,
    });

    return true;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @DELETE request
 * http://serverurl/api/projects/:projectId
 */
export async function deleteProject(id, owner, groupIds, taskIds, chatId) {
  try {
    await axios.put("api/task/group", {
      taskIds,
    });
    await axios.put("api/group/project", {
      groupIds,
    });
    await axios.delete(`api/chat/${chatId}`);
    await axios.delete(`api/project/${id}`);

    const response = await getUserProjects(owner);

    return response;
  } catch (error) {
    console.log(error);
  }
}
