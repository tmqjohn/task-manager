import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @POST request
 * http://serverurl/api/group
 */
export async function addNewGroup(projectId, title) {
  try {
    const groups = await axios.post("/api/group", {
      title: title,
    });

    await axios.patch("/api/project/groups/add", {
      groups: groups.data,
      projectId,
    });

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @PUT request
 * http://serverurl/api/group/:groupId
 */
export async function updateGroup(title, groupId) {
  try {
    await axios.put(`api/group/${groupId}`, {
      title,
    });

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @DELETE request
 * http://serverurl/api/group/:groupId
 */
export async function deleteGroup(groupId, projectId, taskIds, members) {
  try {
    await axios.patch(`api/project/${projectId}/members/update/`, {
      members,
    });

    await axios.delete(`api/group/${groupId}`);
    await axios.put("api/task/group", {
      taskIds,
    });

    const response = await axios.patch(
      `/api/project/groups/delete/${projectId}`,
      {
        groupId,
      }
    );

    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}
