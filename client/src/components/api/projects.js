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

export async function createProject(title, desc, owner, members) {
  try {
    const response = await axios.post("api/project/", {
      title,
      desc,
      owner,
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

export async function updateProject(id, title, desc, owner, members) {
  try {
    await axios.patch(`api/project/${id}`, {
      title,
      desc,
      owner,
      members,
    });

    const response = await getUserProjects(owner[0]);

    return response;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @DELETE request
 * http://serverurl/api/projects/:projectId
 */
export async function deleteProject(id, owner, groupIds) {
  try {
    await axios.delete(`api/project/${id}`);
    await axios.put("api/group/project", {
      groupIds,
    });

    const response = await getUserProjects(owner);

    return response;
  } catch (error) {
    console.log(error);
  }
}
