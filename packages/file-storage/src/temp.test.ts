import { test } from "@jest/globals";
import { FSStorage } from "./fsStorage";
import pathlib from "path";

test("temporary test case", async () => {
  const fsStorage = new FSStorage("/tmp/images");
  const dir = "437c22fe-9cdd-4d5f-8e9d-22500663a099";
  const files = await fsStorage.list(dir).expect("Directory should exist");
  for (const file of files) {
    const data = await fsStorage
      .read(pathlib.join(dir, file))
      .expect("File should exist");
    console.log(file, data.size);
  }
});
