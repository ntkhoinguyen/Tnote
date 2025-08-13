import { getDatabase, regex } from "./setting";

export const selectAllRecords = async (tableName: string): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        const rows = await db.getAllAsync(`SELECT * FROM ${tableName}`);
        return resolve(rows);
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[selectAllRecords][database][ERROR] ------", error);
      return reject([]);
    }
  });
};

export const selectOneRecordById = async (
  tableName: string,
  id: number
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        const row = await db.getFirstAsync(
          `SELECT * FROM ${tableName} WHERE id = ?`,
          [id]
        );
        if (row) {
          return resolve(row);
        } else {
          return resolve(false);
        }
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[selectOneRecordById][database][ERROR] ------", error);
      reject(false);
    }
  });
};

export const selectRecordsByCondition = async (
  tableName: string,
  condition: string,
  params: any[] = []
): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        const rows = await db.getAllAsync(
          `SELECT * FROM ${tableName} WHERE ${condition}`,
          params
        );
        return resolve(rows);
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[selectRecordsByCondition][database][ERROR] ------", error);
      reject([]);
    }
  });
};

export const selectLastRecord = async (
  tableName: string
): Promise<Record<string, any> | false> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        // Kiểm tra tên bảng hợp lệ
        const row = await db.getFirstAsync(
          `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1`
        );
        if (row) {
          return resolve(row);
        } else {
          return resolve(false);
        }
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[selectLastRecord][database][ERROR] ------", error);
      reject(false);
    }
  });
};

export const countRecords = async (
  tableName: string,
  condition: string,
  params: any[] = []
): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (regex.test(tableName)) {
        const db = await getDatabase();
        const row = await db.getFirstAsync<{ count: number }>(
          `SELECT COUNT(*) as count FROM ${tableName} WHERE ${condition}`,
          params
        );
        return resolve(row?.count ?? 0);
      } else {
        return resolve(0);
      }
    } catch (error) {
      console.log("[countRecords][database][ERROR] ------", error);
      return reject(0);
    }
  });
};
