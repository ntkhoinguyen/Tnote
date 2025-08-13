import { checkTableExit } from "@/src/database/create";
import {
  selectAllRecords,
  selectLastRecord,
  selectOneRecordById,
} from "@/src/database/select";
import { insertRecord } from "@/src/database/insert";
import { updateRecord } from "@/src/database/update";
import { deleteRecord, deleteRecordsByCondition } from "@/src/database/delete";
import { GroupType } from "@/src/utils/types";
import { encryptedData, decryptedData } from "@/src/utils/utils";

export const createGroupTable = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await checkTableExit("GROUPS");
      resolve(result);
    } catch (error) {
      console.log("[createGroupTable][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const getGroupById = async (id: number): Promise<false | GroupType> => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await selectOneRecordById("GROUPS", id);
      if (group && group.content) {
        group.content = await decryptedData(group.content);
        return resolve(group as GroupType);
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[getGroupById][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const getAllGroups = async (): Promise<GroupType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const groups = await selectAllRecords("GROUPS");
      if (groups && groups) {
        for (let i = 0; i < groups.length; i++) {
          groups[i].content = await decryptedData(groups[i].content);
        }
        return resolve(groups);
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[getGroupById][Business][ERROR] ----- ", error);
      reject([]);
    }
  });
};

export const insertGroup = async (
  group: GroupType
): Promise<boolean | number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newGroup = { ...group };
      newGroup.content = await encryptedData(newGroup.content);
      const result = await insertRecord("GROUPS", newGroup);
      if (result) {
        const insertSequenceTask = await insertRecord("SEQUENCE_TASKS", {
          groupId: group.id,
          sequence: "[]",
        });
        if (insertSequenceTask) {
          const groupInfo: Record<string, any> | false = await selectLastRecord(
            "GROUPS"
          );
          if (groupInfo && groupInfo.id) {
            return resolve(groupInfo.id);
          }
        }
      }
      return resolve(result);
    } catch (error) {
      console.log("[insertGroup][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const updateGroup = async (group: GroupType): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newGroup = { ...group };
      newGroup.content = await encryptedData(newGroup.content);
      const result = await updateRecord("GROUPS", newGroup);
      return resolve(result);
    } catch (error) {
      console.log("[createGroup][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const removeGroup = async (id: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await deleteRecord("GROUPS", id);
      if (result) {
        await deleteRecordsByCondition("SEQUENCE_TASKS", "groupId = ?", [id]);
      }
      return resolve(result);
    } catch (error) {
      console.log("[removeGroup][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};
