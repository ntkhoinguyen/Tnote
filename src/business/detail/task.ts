import { checkTableExit } from "@/src/database/create";
import {
  selectOneRecordById,
  selectAllRecords,
  selectRecordsByCondition,
  selectLastRecord,
  countRecords,
} from "@/src/database/select";
import { insertRecord } from "@/src/database/insert";
import { updateRecord } from "@/src/database/update";
import { deleteRecord } from "@/src/database/delete";
import {
  GroupType,
  TagType,
  TaskDetailType,
  TaskType,
} from "@/src/utils/types";
import {
  encryptedData,
  decryptedData,
  movePhotoToAttachments,
  deleteAttachments,
} from "@/src/utils/utils";

export const createTasksTable = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await checkTableExit("TASKS");
      resolve(result);
    } catch (error) {
      console.log("[createTasksTable][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const insertTask = async (task: TaskType): Promise<boolean | number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newTask: any = { ...task };
      newTask.content = await encryptedData(newTask.content);
      newTask.tagsId = JSON.stringify(newTask.tagsId);
      const uri = await movePhotoToAttachments(newTask.image, false);
      newTask.image = uri;
      let attachments: string[] = [];
      for (let i = 0; i < newTask.attachments.length; i++) {
        const u = await movePhotoToAttachments(newTask.attachments[i], false);
        attachments.push(u);
      }
      newTask.attachments = JSON.stringify(attachments);
      const result = await insertRecord("TASKS", newTask);
      if (result) {
        const taskInfo: Record<string, any> | false = await selectLastRecord(
          "TASKS"
        );
        if (taskInfo && taskInfo.id) {
          const sequence_task = await selectRecordsByCondition(
            "SEQUENCE_TASKS",
            "groupId = ?",
            [newTask.groupId]
          );

          if (sequence_task && sequence_task.length === 0) {
            const data = {
              groupId: newTask.groupId,
              sequence: JSON.stringify([taskInfo.id]),
            };
            const insert = await insertRecord("SEQUENCE_TASKS", data);
            if (insert) return resolve(taskInfo.id);
          } else {
            const newSequence = [
              taskInfo.id,
              ...JSON.parse(sequence_task[0].sequence),
            ];
            const update = await updateRecord("SEQUENCE_TASKS", {
              ...sequence_task[0],
              sequence: JSON.stringify(newSequence),
            });
            if (update) return resolve(taskInfo.id);
          }
          return resolve(taskInfo.id);
        }
      }
      return resolve(result);
    } catch (error) {
      console.log("[insertTask][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const updateTask = async (
  task: TaskType,
  currentGroupId: number = 0,
  nextGroupId: number = 0,
  isUpdateImage?: boolean
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newTask: any = { ...task };
      newTask.content = await encryptedData(newTask.content);
      newTask.tagsId = JSON.stringify(newTask.tagsId);
      if (isUpdateImage) {
        const uri = await movePhotoToAttachments(newTask.image, false);
        newTask.image = uri;
      }
      let attachments: string[] = [];
      for (let i = 0; i < newTask.attachments.length; i++) {
        if (newTask.attachments[i].includes("TaskNote/files/attachments")) {
          attachments.push(newTask.attachments[i]);
        } else {
          const u = await movePhotoToAttachments(newTask.attachments[i], false);
          attachments.push(u);
        }
      }
      newTask.attachments = JSON.stringify(attachments);
      const result = await updateRecord("TASKS", newTask);
      if (result) {
        if (currentGroupId !== nextGroupId) {
          const current_sequence_task = await selectRecordsByCondition(
            "SEQUENCE_TASKS",
            "groupId = ?",
            [currentGroupId]
          );

          const next_sequence_task = await selectRecordsByCondition(
            "SEQUENCE_TASKS",
            "groupId = ?",
            [nextGroupId]
          );

          if (current_sequence_task && current_sequence_task.length > 0) {
            const newSequence = JSON.parse(
              current_sequence_task[0].sequence
            ).filter((item: number) => item !== newTask.id);
            await updateRecord("SEQUENCE_TASKS", {
              ...current_sequence_task[0],
              sequence: JSON.stringify(newSequence),
            });
          }

          if (next_sequence_task) {
            if (next_sequence_task && next_sequence_task.length === 0) {
              const data = {
                groupId: newTask.groupId,
                sequence: JSON.stringify([newTask.id]),
              };
              await insertRecord("SEQUENCE_TASKS", data);
            } else {
              const newSequence = [
                newTask.id,
                ...JSON.parse(next_sequence_task[0].sequence),
              ];
              await updateRecord("SEQUENCE_TASKS", {
                ...next_sequence_task[0],
                sequence: JSON.stringify(newSequence),
              });
            }
          }
          return resolve(result);
        }
      }
      return resolve(result);
    } catch (error) {
      console.log("[updateTask][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const removeTask = async (
  id: number,
  groupId: number
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await selectOneRecordById("TASKS", id);
      if (task) {
        const result = await deleteRecord("TASKS", id);
        const sequence_task = await selectRecordsByCondition(
          "SEQUENCE_TASKS",
          "groupId = ?",
          [groupId]
        );
        if (result && sequence_task && sequence_task.length > 0) {
          const newSequence = JSON.parse(sequence_task[0].sequence).filter(
            (item: number) => item !== id
          );
          await updateRecord("SEQUENCE_TASKS", {
            ...sequence_task[0],
            sequence: JSON.stringify(newSequence),
          });
          if (task.image) {
            await deleteAttachments([task.image]);
          }
        }
        return resolve(result);
      }
      return resolve(false);
    } catch (error) {
      console.log("[removeTask][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const getTaskById = async (id: number): Promise<false | TaskType> => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await selectOneRecordById("TASKS", id);
      if (task && task.content) {
        task.content = await decryptedData(task.content);
        task.tagsId = JSON.parse(task.tagsId);
        task.attachments = JSON.parse(task.attachments);
        return resolve(task as TaskType);
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[getTaskById][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const getAllTasks = async (): Promise<TaskType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const tags = await selectAllRecords("TASKS");
      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          tags[i].content = await decryptedData(tags[i].content);
        }
        return resolve(tags);
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[getAllTasks][Business][ERROR] ----- ", error);
      reject([]);
    }
  });
};

export const getTaskByGroupId = async (
  groupId: number,
  limit: number,
  searchText: string
): Promise<TaskType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const tasks = await selectRecordsByCondition(
        "TASKS",
        `groupId = ? AND title LIKE ? LIMIT ?`,
        [groupId, `%${searchText}%`, limit]
      );
      if (tasks) {
        for (let i = 0; i < tasks.length; i++) {
          tasks[i].content = await decryptedData(tasks[i].content);
        }
        return resolve(tasks);
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[getTaskByGroupId][Business][ERROR] ----- ", error);
      reject([]);
    }
  });
};

export const getTasksCustom = async (
  tasks: TaskType[],
  group: GroupType,
  tags: TagType[],
  sequences: number[] = []
): Promise<TaskDetailType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newTask: TaskDetailType[] = [];
      for (let i = 0; i < tasks.length; i++) {
        newTask[i] = { ...tasks[i], group: group, tags: tags };
        newTask[i].tags = tags.filter((tag: TagType) =>
          newTask[i].tagsId.includes(tag.id)
        );
      }

      const sortedTasks = newTask.sort((a, b) => {
        return sequences.indexOf(a.id) - sequences.indexOf(b.id);
      });

      return resolve(sortedTasks);
    } catch (error) {
      console.log("[getTasksCustom][Business][ERROR] ----- ", error);
      reject([]);
    }
  });
};

export const getSequencesByGroupId = async (
  groupId: number
): Promise<number[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sequence_task = await selectRecordsByCondition(
        "SEQUENCE_TASKS",
        "groupId = ?",
        [groupId]
      );
      if (sequence_task && sequence_task.length > 0) {
        return resolve(JSON.parse(sequence_task[0].sequence));
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[getSequencesByGroupId][Business][ERROR] ----- ", error);
      reject([]);
    }
  });
};

export const getTaskCount = async (
  groupId: number,
  searchText: string
): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await countRecords(
        "TASKS",
        "groupId = ? AND title LIKE ?",
        [groupId, `%${searchText}%`]
      );
      return resolve(count);
    } catch (error) {
      console.log("[getTaskCount][Business][ERROR] ----- ", error);
      reject(0);
    }
  });
};

export const kanbanUpdateTaskGroup = async (
  taskId: number,
  nextGroupId: number
): Promise<false | TaskType> => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await getTaskById(taskId);
      if (!task) return resolve(false);
      const newTask = { ...task, groupId: nextGroupId };
      if (!task) return resolve(false);
      const result = await updateTask(newTask, task.groupId, nextGroupId);
      return resolve(result ? task : false);
    } catch (error) {
      console.log("[kanbanUpdateTaskGroup][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const updateKanbanItemInfo = async (
  taskId: number,
  value: object
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const task = await getTaskById(taskId);
      if (task === false) return resolve(false);
      const result = await updateTask(
        { ...task, ...value },
        task.groupId,
        task.groupId
      );
      return resolve(result);
    } catch (error) {
      console.log("[updateKanbanItemInfo][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const kanbanSortSequence = async (
  groupId: number,
  sequence: number[]
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sequenceTask = await selectRecordsByCondition(
        "SEQUENCE_TASKS",
        "groupId = ?",
        [groupId]
      );
      const sequence_task = sequenceTask[0].sequence
        ? JSON.parse(sequenceTask[0].sequence)
        : [];
      const newSequence = [...new Set([...sequence, ...sequence_task])];

      const result = await updateRecord("SEQUENCE_TASKS", {
        ...sequenceTask[0],
        sequence: JSON.stringify(newSequence),
      });
      return resolve(result);
    } catch (error) {
      console.log("[kanbanSortSequence][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const deleteUriAttachments = async (uris: string[]): Promise<void> => {
  try {
    await deleteAttachments(uris);
  } catch (error) {
    console.warn(`Failed to delete files:`, error);
  }
};
