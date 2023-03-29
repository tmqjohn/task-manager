import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @POST request
 * http://serverurl/api/task
 */
export async function addNewTask(
  title,
  dueDate,
  note,
  assignee,
  members,
  groupId,
  projectId
) {
  try {
    const tasks = await axios.post("/api/task", {
      title,
      dueDate,
      note,
      assignee,
    });

    await axios.patch("api/group/tasks/add", {
      tasks: tasks.data,
      groupId,
    });

    await axios.patch(`api/project/${projectId}/members/update`, {
      members,
    });

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @PATCH request
 * http://serverurl/api/task/:taskId
 */
export async function updateTask(
  title,
  taskId,
  dueDate,
  note,
  assignee,
  status = true
) {
  try {
    if (status) {
      let statusText = title;

      await axios.patch(`api/task/${taskId}`, {
        status: statusText,
      });
    } else {
      await axios.patch(`api/task/${taskId}`, {
        title,
        dueDate,
        note,
        assignee,
      });
    }

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @DELETE request
 * http://serverurl/api/task/:taskId
 */
export async function deleteTask(groupId, taskId) {
  try {
    await axios.delete(`api/task/${taskId}`);

    const response = await axios.patch(`/api/group/tasks/delete/${groupId}`, {
      taskId,
    });

    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}
