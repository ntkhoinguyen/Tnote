const mockRows = [
  { id: 1, title: "mock_sqlite", content: "test" },
  { id: 2, title: "mock_sqlite_2 ", content: "test_2" },
];
const dbInstance = {
  runAsync: jest.fn().mockResolvedValue({ changes: 1 }),
  getAllAsync: jest.fn().mockResolvedValue(mockRows),
  getFirstAsync: jest.fn().mockResolvedValue(mockRows[0]),
  execAsync: jest.fn().mockResolvedValue(true),
};

export const openDatabaseAsync = jest.fn(() => Promise.resolve(dbInstance));
