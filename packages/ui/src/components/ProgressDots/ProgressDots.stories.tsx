import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressDots } from "./ProgressDots";
import { colorNames } from "@/styles/colorType";
import { expect } from "storybook/test";
import styles from "./ProgressDots.module.css";

const meta: Meta<typeof ProgressDots> = {
  title: "Byggeklosser/Komponenter/ProgressDots",
  component: ProgressDots,
  tags: ["autodocs"],
  argTypes: {
    maxValue: { control: { type: "number" } },
    value: { control: { type: "number" } },
    "data-color": { control: "select", options: colorNames },
    lineThickness: { control: "select", options: ["thin", "medium", "thick"] },
  },
  decorators: [Story => <Story />],
} satisfies Meta<typeof ProgressDots>;

export default meta;
type Story = StoryObj<typeof ProgressDots>;

/**
 * Default story showing basic progress dots
 */
export const Default: Story = {
  args: {
    maxValue: 5,
    value: 3,
  },
  play: async ({ canvasElement, step, args }) => {
    const dots = canvasElement.querySelectorAll('[class*="progressDot_"]');

    await step("Verify number of dots", async () => {
      await expect(dots.length).toBe(5);

      const progressLine = canvasElement.querySelector('[class*="progressLine"]');
      await expect(progressLine).toBeInTheDocument();

      const dotLine = canvasElement.querySelector('[class*="dotLine"]');
      await expect(dotLine).toBeInTheDocument();
    });

    await step("Verify disabled dots are correct", async () => {
      dots.forEach((dot, index) => {
        const dotNumber = index + 1;
        const shouldBeDisabled = dotNumber > (args.value || 0);

        if (shouldBeDisabled) {
          expect(dot.classList.contains(styles.disabled)).toBeTruthy();
        }
      });
    });
  },
};

/**
 * Test progress line calculation
 */
export const ProgressLineCalculation: Story = {
  args: {
    maxValue: 5,
    value: 3,
  },
  play: async ({ canvasElement, args }) => {
    const progressLine = canvasElement.querySelector(
      '[class*="progressLine"]'
    ) as HTMLElement;
    await expect(progressLine).toBeInTheDocument();

    // Calculate expected progress
    const expectedProgress = (args.value! - 1) / (args.maxValue - 1);
    const styleProgress = progressLine?.style.getPropertyValue("--progress");

    if (styleProgress) {
      await expect(parseFloat(styleProgress)).toBeCloseTo(expectedProgress, 2);
    }
  },
};

/**
 * Test with no value provided (defaults to 0)
 */
export const NoValue: Story = {
  args: {
    maxValue: 5,
    value: undefined,
  },
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll('[class*="progressDot_"]');

    dots.forEach(dot => {
      expect(dot.classList.contains(styles.disabled)).toBeTruthy();
    });
  },
};

export const DifferentColors: Story = {
  args: {
    maxValue: 5,
    value: 3,
    "data-color": "warning",
  },
  play: async ({ canvasElement, args }) => {
    const progressDots = canvasElement.querySelector(
      '[class*="progressDots_"]'
    ) as HTMLElement;
    await expect(progressDots).toBeInTheDocument();
    const dataColor = progressDots.getAttribute("data-color");
    await expect(dataColor).toBe(args["data-color"]);
  },
};
