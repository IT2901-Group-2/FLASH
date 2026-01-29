import { Canvas, Source, useOf } from "@storybook/addon-docs/blocks";
import { useState } from "react";
import Chips from "./Chips";
import styles from "./Showcase.module.css";
import type { StoryObj, Meta } from "@storybook/react";

interface ShowcaseProps {
  of?: Meta | Record<string, StoryObj>;
}

export const Showcase: React.FC<ShowcaseProps> = ({ of = "meta" }) => {
  const resolvedOf = useOf(of, ["meta"]);

  const csfFile = resolvedOf.type === "meta" ? resolvedOf.csfFile : null;
  const stories = csfFile ? Object.entries(csfFile.stories) : [];

  const data = stories
    .filter(([, story]) => !story.name.startsWith("_"))
    .map(([id, story]) => ({
      name: story.name,
      id: id,
      story: story,
      description: story.parameters?.docs?.description?.story || "",
    }));

  const [active, setActive] = useState<string>(data[0]?.id || "");
  const activeItem = data.find(item => item.id === active);

  return (
    <>
      <div className={styles.storySelect}>
        {data.map(item => (
          <Chips
            key={item.id}
            onClick={() => setActive(item.id)}
            active={active === item.id}
          >
            {item.name.replaceAll("_", " ")}
          </Chips>
        ))}
      </div>
      {activeItem && (
        <>
          <p>{activeItem.description}</p>
          <Canvas
            of={activeItem.story.moduleExport}
            sourceState="none"
            layout="centered"
            withToolbar
            className={styles.canvas}
          />
          <Source of={activeItem.story.moduleExport} />
        </>
      )}
    </>
  );
};
export default Showcase;
