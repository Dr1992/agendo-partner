// Mocks de módulos nativos para o ambiente de teste (jest-expo).
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
