import { Title, Subtitle, Description, ArgTypes } from "@storybook/addon-docs/blocks";
import Showcase from "@docs-components/Showcase";

export const DocsTemplate = () => {
  return (
    <>
      <Title />
      <Subtitle />

      <div style={{ marginBottom: "2rem" }}>
        <Description />
      </div>

      <h2>Usage</h2>
      <Showcase />

      <h2>Props</h2>
      <ArgTypes />
    </>
  );
};

export default DocsTemplate;
