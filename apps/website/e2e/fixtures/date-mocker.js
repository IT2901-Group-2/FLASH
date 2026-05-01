import MockDate from "mockdate";

if (process.env.MOCK_DATE !== undefined) {
  MockDate.set(process.env.MOCK_DATE);
}
