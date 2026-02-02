import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar";
import { fn } from "storybook/test";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button";

const meta: Meta<typeof ProgressBar> = {
  title: "Byggeklosser/Komponenter/ProgressBar",
  tags: ["autodocs"],
  component: ProgressBar,
  argTypes: {},
  args: { onClick: fn() },
  decorators: [
    Story => (
      <div
        style={{ width: "20rem", display: "flex", flexDirection: "column", gap: ".5rem" }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Loading: Story = {
  render: () => {
    const [value, setValue] = useState(3);

    // This useEffect is used to simulate loading
    useEffect(() => {
      const setRandomInterval = (callback: () => void) => {
        const interval = Math.random() * 4000 + 500;
        return setTimeout(() => {
          callback();
          setRandomInterval(callback);
        }, interval);
      };
      const intervalId = setRandomInterval(() => {
        setValue(oldValue => {
          if (oldValue === 100) return 3;
          const increment = Math.random() * 25 + 5;
          return oldValue + increment > 100 ? 100 : oldValue + increment;
        });
      });
      return () => clearInterval(intervalId);
    }, []);

    return (
      <>
        <p>Laster innhold</p>
        <ProgressBar value={value} />
      </>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <>
      <p>Fremdrift (liten versjon)</p>
      <ProgressBar value={10} size="small" />
      <p>Fremdrift (medium versjon)</p>
      <ProgressBar value={50} size="medium" />
      <p>Fremdrift (stor versjon)</p>
      <ProgressBar value={70} size="large" />
    </>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    const max = 10;

    return (
      <>
        <p>Interaktiv fremdriftslinje</p>
        <ProgressBar value={value} maxValue={max} />
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            onClick={() => setValue(old => old - 1)}
            icon={<ArrowLeft />}
            iconPosition="left"
            disabled={value <= 0}
          >
            Reduser
          </Button>
          <Button
            onClick={() => setValue(old => old + 1)}
            icon={<ArrowRight />}
            iconPosition="right"
            disabled={value >= max}
          >
            Øk
          </Button>
        </div>
      </>
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [isIndeterminate, setIsIndeterminate] = useState(false);
    return (
      <>
        <p>Ubestemt fremdriftslinje</p>
        <ProgressBar
          simulated={{
            seconds: 6,
            onTimeout: () => {
              console.info("Ferdig");
              setIsIndeterminate(true);
            },
          }}
        />
        {isIndeterminate && <p>Dette tok lenger tid enn forventet.</p>}
      </>
    );
  },
};
