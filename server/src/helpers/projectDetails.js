const User = require("../schema/UserSchema");
const Group = require("../schema/GroupSchema");
const Task = require("../schema/TaskSchema");
const Chat = require("../schema/ChatSchema");

async function projectDetails(projects) {
  const details = await Promise.all(
    projects.map(async (project) => {
      const ownerList = await Promise.all(
        project.owner.map(
          async (owner) => await User.findById(owner).select("fullName").exec()
        )
      );

      const membersList = await Promise.all(
        project.members.map(
          async (member) =>
            await User.findById(member).select("fullName").exec()
        )
      );

      const groups = await Promise.all(
        project.groups.map(
          async (group) => await Group.findById(group).lean().exec()
        )
      );

      const groupDetails = await Promise.all(
        groups.map(async (group) => {
          const tasks = await Promise.all(
            group.tasks.map(
              async (task) => await Task.findById(task).lean().exec()
            )
          );

          const taskDetails = await Promise.all(
            tasks.map(async (task) => {
              const assigneeList = await Promise.all(
                task.assignee.map(
                  async (assignee) =>
                    await User.findById(assignee).select("fullName").exec()
                )
              );

              const assigneeName = assigneeList.map(
                (assignee) => assignee.fullName
              );

              return {
                ...task,
                assigneeName,
              };
            })
          );

          return { ...group, taskDetails };
        })
      );

      const chatHistoryDetails = await Chat.findById(
        project.chatHistory
      ).exec();

      const ownerName = ownerList.map((owner) => owner.fullName);
      const membersName = membersList.map((member) => member.fullName);

      return {
        ...project,
        ownerName,
        membersName,
        groupDetails,
        chatHistoryDetails,
      };
    })
  );

  return details;
}

module.exports = projectDetails;
