import React, { useState } from "react";
import { Chips } from "./Chips";
import styles from "./Showcase.module.css";
import { Canvas, Source } from "@storybook/addon-docs/blocks";
import { ModuleExport } from "storybook/internal/types";

export interface ShowcaseProps {
  of: ModuleExport;
}

export const Showcase: React.FC<ShowcaseProps> = ({ of }) => {
  const [active, setActive] = useState<string>(Object.keys(of)[0] || "");
  const data = Object.entries(of)
    .filter(key => key[0] !== "default" && !key[0].startsWith("_"))
    .map(([name, story]) => ({
      name,
      story,
      description: (story as any).parameters?.docs?.description?.story || "",
    }));
  const activeItem = data.find(item => item.name === active);

  return (
    <>
      <div className={styles.storySelect}>
        {data.map(item => (
          <Chips key={item.name} onClick={() => setActive(item.name)} active={active === item.name}>
            {item.name.replaceAll("_", " ")}
          </Chips>
        ))}
      </div>

      {activeItem && (
        <>
          <p>{activeItem.description}</p>
          <Canvas
            of={activeItem.story}
            sourceState="none"
            layout="centered"
            withToolbar
            className={styles.canvas}
          />
          <Source of={activeItem.story} />
        </>
      )}
    </>
  );
};

export default Showcase;
