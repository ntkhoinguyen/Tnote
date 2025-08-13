import { checkTableExit } from "@/src/database/create";
import {
  selectOneRecordById,
  selectAllRecords,
  selectLastRecord,
} from "@/src/database/select";
import { insertRecord } from "@/src/database/insert";
import { updateRecord } from "@/src/database/update";
import { deleteRecord } from "@/src/database/delete";
import { GroupType, TagCustomType, TagType } from "@/src/utils/types";
import { encryptedData, decryptedData } from "@/src/utils/utils";

export const createTagsTable = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await checkTableExit("TAGS");
      resolve(result);
    } catch (error) {
      console.log("[createTagsTable][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const insertTag = async (tag: TagType): Promise<boolean | number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newTag = { ...tag };
      newTag.content = await encryptedData(newTag.content);
      const result = await insertRecord("TAGS", newTag);
      if (result) {
        const tagInfo: Record<string, any> | false = await selectLastRecord(
          "TAGS"
        );
        if (tagInfo && tagInfo.id) {
          return resolve(tagInfo.id);
        }
      }
      return resolve(result);
    } catch (error) {
      console.log("[insertTag][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const updateTag = async (tag: TagType): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newTag = { ...tag };
      newTag.content = await encryptedData(newTag.content);
      const result = await updateRecord("TAGS", newTag);
      return resolve(result);
    } catch (error) {
      console.log("[updateTag][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const removeTag = async (id: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await deleteRecord("TAGS", id);
      return resolve(result);
    } catch (error) {
      console.log("[removeTag][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const getTagById = async (id: number): Promise<false | TagType> => {
  return new Promise(async (resolve, reject) => {
    try {
      const tag = await selectOneRecordById("TAGS", id);
      if (tag && tag.content) {
        tag.content = await decryptedData(tag.content);
        return resolve(tag as TagType);
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[getTagById][Business][ERROR] ----- ", error);
      reject(false);
    }
  });
};

export const getAllTags = async (): Promise<TagType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const tags = await selectAllRecords("TAGS");
      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          tags[i].content = await decryptedData(tags[i].content);
        }
        return resolve(tags);
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[getAllTags][Business][ERROR] ----- ", error);
      reject([]);
    }
  });
};

export const getTagsCustom = (
  tags: TagType[],
  groups: GroupType[]
): TagCustomType[] => {
  try {
    let objectGroups: Record<string, GroupType> = {};
    for (let i = 0; i < groups.length; i++) {
      objectGroups = { ...objectGroups, [groups[i].id]: groups[i] };
    }
    let tagsCustom: TagCustomType[] = [];

    for (let i = 0; i < tags.length; i++) {
      tagsCustom.push({
        ...tags[i],
        groupInfo: objectGroups[tags[i].groupId.toString()] ?? null,
      });
    }
    return tagsCustom;
  } catch (error) {
    console.log("[TagScreen][getTagsCustom][ERROR] ----- ", error);
    return [];
  }
};

export const getTagsGroupByGroup = (tags: TagCustomType[]) => {
  try {
    tags.sort((a: TagCustomType, b: TagCustomType) =>
      a.groupId < b.groupId ? 1 : -1
    );

    let groupNames = [];
    let rows = [];
    if (tags.length > 0) {
      const firstGroup: TagCustomType = {
        id: "G" + tags.length + groupNames.length,
        title: tags[0]?.groupInfo?.title ?? "",
        type: "title",
        content: "",
        groupId: 0,
        groupInfo: null,
        color: "",
      };
      rows.push(firstGroup);
      rows.push(tags[0]);
      groupNames.push(firstGroup.title ?? "");
    }

    for (let i = 0; i < tags.length - 1; i++) {
      if (i !== 0) rows.push(tags[i]);
      if (tags[i + 1] && tags[i].groupId !== tags[i + 1].groupId) {
        const newGroup: TagCustomType = {
          id: "G" + tags.length + groupNames.length,
          title: tags[i + 1]?.groupInfo?.title ?? "",
          type: "title",
          content: "",
          groupId: 0,
          groupInfo: null,
          color: "",
        };
        groupNames.push(newGroup.title ?? "");
        rows.push(newGroup);
      }
      if (i === tags.length - 2) {
        rows.push(tags[tags.length - 1]);
      }
    }
    return { rows, groupNames };
  } catch (error) {
    console.log("[TagScreen][getTagsGroupByGroup][ERROR] ----- ", error);
    return { rows: tags, groupNames: [] };
  }
};
