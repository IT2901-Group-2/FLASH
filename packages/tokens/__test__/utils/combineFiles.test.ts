import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:fs", () => ({
  default: {
    writeFileSync: vi.fn(),
    unlinkSync: vi.fn(),
  },
}));

vi.mock("lightningcss", () => ({
  bundle: vi.fn(),
}));

import fs from "node:fs";
import { bundle } from "lightningcss";
import { combineFiles } from "../../src/utils/combineFiles";

const mockBundle = vi.mocked(bundle);
const mockWriteFileSync = vi.mocked(fs.writeFileSync);
const mockUnlinkSync = vi.mocked(fs.unlinkSync);

beforeEach(() => {
  vi.clearAllMocks();
  mockBundle.mockReturnValue({
    code: Buffer.from("bundled-css {}"),
  } as unknown as ReturnType<typeof bundle>);
});

describe("combineFiles", () => {
  it("writes an import file from the provided file list", () => {
    combineFiles(["a.css", "b.css"], "out.css");

    expect(mockWriteFileSync).toHaveBeenNthCalledWith(
      1,
      "out.css",
      '@import "./a.css";\n@import "./b.css";'
    );
  });

  it("bundles the import file and writes the result", () => {
    combineFiles(["a.css"], "out.css");

    expect(mockBundle).toHaveBeenCalledWith({ filename: "out.css", minify: false });
    expect(mockWriteFileSync).toHaveBeenNthCalledWith(
      2,
      "out.css",
      Buffer.from("bundled-css {}")
    );
  });

  it("deletes each source file after bundling", () => {
    combineFiles(["a.css", "b.css"], "out.css");

    expect(mockUnlinkSync).toHaveBeenCalledWith("./a.css");
    expect(mockUnlinkSync).toHaveBeenCalledWith("./b.css");
    expect(mockUnlinkSync).toHaveBeenCalledTimes(2);
  });

  it("uses the provided path prefix for output and source files", () => {
    combineFiles(["a.css", "b.css"], "out.css", "src/styles/");

    expect(mockWriteFileSync).toHaveBeenNthCalledWith(
      1,
      "src/styles/out.css",
      '@import "./a.css";\n@import "./b.css";'
    );
    expect(mockBundle).toHaveBeenCalledWith({
      filename: "src/styles/out.css",
      minify: false,
    });
    expect(mockUnlinkSync).toHaveBeenCalledWith("src/styles/a.css");
    expect(mockUnlinkSync).toHaveBeenCalledWith("src/styles/b.css");
  });

  it("handles a single file", () => {
    combineFiles(["only.css"], "out.css");

    expect(mockWriteFileSync).toHaveBeenNthCalledWith(
      1,
      "out.css",
      '@import "./only.css";'
    );
    expect(mockUnlinkSync).toHaveBeenCalledTimes(1);
  });
});
