import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @POST request
 * http://serverurl/api/task
 */
export async function addNewTask(title, dueDate, note, groupId) {
  try {
    const tasks = await axios.post("/api/task", {
      title,
      dueDate,
      note,
    });

    await axios.patch("api/group/tasks/add", {
      tasks: tasks.data,
      groupId,
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
export async function updateTask(title, dueDate, note, taskId) {
  try {
    await axios.patch(`api/task/${taskId}`, {
      title,
      dueDate,
      note,
    });

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
