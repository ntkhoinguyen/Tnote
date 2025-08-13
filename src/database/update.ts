import {getDatabase, regex } from "./setting";

export const updateRecord = async (
  tableName: string,
  data: Record<string, any>
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDatabase();
      if (regex.test(tableName)) {
        // Tạo câu SQL UPDATE
        const { id, ...fields } = data;
        const keys = Object.keys(fields);
        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const values = [...Object.values(fields), id]; // Append id for WHERE clause
        const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
        await db.runAsync(sql, values);
        return resolve(true);
      } else {
        return resolve(false);
      }
    } catch (error) {
      console.log("[updateRecord][database][ERROR] ------", error);
      reject(false);
    }
  });
};
