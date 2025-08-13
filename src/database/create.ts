import { CREATE_TABLE_SQLS, regex, getDatabase } from "./setting";

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createDatabase = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      await sleep(1000); // Wait for the database to be ready
      for (const table of Object.keys(
        CREATE_TABLE_SQLS
      ) as (keyof typeof CREATE_TABLE_SQLS)[]) {
        const sql = CREATE_TABLE_SQLS[table];
        if (regex.test(table) && sql) {
          await db.execAsync(sql);
        }
      }
      resolve(true);
    } catch (error) {
      console.log("[createDatabase][database][ERROR] ------", error);
      reject(false);
    }
  });
};

export const checkTableExit = async (
  tableName: keyof typeof CREATE_TABLE_SQLS
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ name: string }>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
        [tableName]
      );

      if (row) {
        return resolve(true);
      } else {
        const sql = CREATE_TABLE_SQLS[tableName];
        if (regex.test(tableName) && sql) {
          await db.execAsync(sql);
          return resolve(true);
        } else {
          return resolve(false);
        }
      }
    } catch (error) {
      console.log("[checkTableExit][database][ERROR] ------", error);
      reject(false);
    }
  });
};
