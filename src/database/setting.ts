import * as SQLite from "expo-sqlite";
export const TABLES = ["GROUPS", "TAGS", "TASKS", "SEQUENCE_TASKS", "TBTEST"];
export const databaseName = "TasksNoteDatabase.db";

export const regex = /^[a-zA-Z0-9_]+$/;

export const SQL_CREATE_TABLE_GROUPS = `CREATE TABLE IF NOT EXISTS GROUPS (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority INTEGER NOT NULL,
    color TEXT NOT NULL
);`;

export const SQL_CREATE_TABLE_TAGS = `CREATE TABLE IF NOT EXISTS TAGS (
  id INTEGER PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  groupId INTEGER,
  color TEXT NOT NULL
);`;

export const SQL_CREATE_TABLE_TASKS = `CREATE TABLE IF NOT EXISTS TASKS (
  id INTEGER PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  hasNotification INTEGER NOT NULL,
  hasShake INTEGER NOT NULL,
  groupId INTEGER NOT NULL,
  createDate TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  time TEXT NOT NULL,
  isAlways INTEGER NOT NULL,
  sequence INTEGER NOT NULL,
  tagsId TEXT NOT NULL,
  attachments TEXT NOT NULL,
  content TEXT NOT NULL
);`;

export const SQL_CREATE_TABLE_SEQUENCE_TASKS = `CREATE TABLE IF NOT EXISTS SEQUENCE_TASKS (
  id INTEGER PRIMARY KEY NOT NULL,
  groupId INTEGER,
  sequence TEXT NOT NULL
);`;

export const SQL_CREATE_TABLE_TBTEST = `CREATE TABLE IF NOT EXISTS TBTEST (
  id INTEGER PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);`;

export const CREATE_TABLE_SQLS = {
  GROUPS: SQL_CREATE_TABLE_GROUPS,
  TAGS: SQL_CREATE_TABLE_TAGS,
  TASKS: SQL_CREATE_TABLE_TASKS,
  SEQUENCE_TASKS: SQL_CREATE_TABLE_SEQUENCE_TASKS,
  TBTEST: SQL_CREATE_TABLE_TBTEST,
};

let database: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await SQLite.openDatabaseAsync(databaseName);
      database = db; // Store the database instance for reuse
      return resolve(db);
    } catch (error) {
      console.log("[initDatabase][ERROR] ------", error);
      return reject(false);
    }
  });
};

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (!database) {
      database = await initDatabase();
    }
    return database;
  } catch (error) {
    console.error("[getDatabase][ERROR] ------", error);
    throw new Error("Failed to open database");
  }
};
