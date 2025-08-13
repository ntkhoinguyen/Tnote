import { CREATE_TABLE_SQLS, getDatabase, regex } from "./setting";

export const resetDatabase = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      for (const table of Object.keys(
        CREATE_TABLE_SQLS
      ) as (keyof typeof CREATE_TABLE_SQLS)[]) {
        const sql = CREATE_TABLE_SQLS[table];
        if (regex.test(table) && sql) {
          await db.runAsync(`DROP TABLE IF EXISTS ${table}`);
        }
      }
      resolve(true);
    } catch (error) {
      console.log("[resetDatabase] ------", error);
      reject(false);
    }
  });
};

export const deleteTable = async (tableName: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        const sql = `DROP TABLE IF EXISTS ${tableName}`;
        await db.runAsync(sql);
        return resolve(true);
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[deleteTable][database][ERROR] ------", error);
      return reject(false);
    }
  });
};

export const deleteRecord = async (
  tableName: string,
  id: number
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        const sql = `DELETE FROM ${tableName} WHERE id = ?`;
        const row = await db.runAsync(sql, [id]);
        if (row && row.changes > 0) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[deleteRecord][database][ERROR] ------", error);
      return reject(false);
    }
  });
};

export const deleteRecordsByCondition = async (
  tableName: string,
  condition: string,
  params: any[] = []
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        const rows = await db.runAsync(
          `DELETE FROM ${tableName} WHERE ${condition}`,
          params
        );
        if (rows && rows.changes > 0) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[selectRecordsByCondition][database][ERROR] ------", error);
      reject([]);
    }
  });
};
