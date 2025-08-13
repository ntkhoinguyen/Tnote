import { getDatabase, regex } from "./setting";

export const insertRecord = async (
  tableName: string,
  data: Record<string, any>
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        const { id, ...fields } = data;
        const columns = Object.keys(fields).join(", ");
        const placeholders = Object.keys(fields)
          .map(() => "?")
          .join(", ");
        const values = Object.values(fields);
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        await db.runAsync(sql, values);
        return resolve(true);
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[insertRecord][database][ERROR] ------", error);
      reject(false);
    }
  });
};
