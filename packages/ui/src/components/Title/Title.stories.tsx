import type { Meta, StoryObj } from "@storybook/react-vite";
import { Title } from "./Title";
import { expect, within } from "storybook/test";

const meta: Meta<typeof Title> = {
  title: "Building Blocks/Components/Title",
  tags: ["autodocs"],
  component: Title,
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3"],
    },
    size: {
      control: "select",
      options: ["xlarge", "large", "medium", "small"],
    },
    weight: {
      control: "select",
      options: ["bold", "semibold", "medium"],
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
    "data-color": {
      control: "select",
      options: [],
    },
    children: { control: { type: "text" } },
  },
  args: {
    children: "Title Text",
  },
  parameters: {
    layout: "left",
    chromatic: { disable: true },
    docs: {
      source: {
        type: "dynamic",
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof Title>;

// Semantic HTML Levels
export const HeadingTypes: Story = {
  render: () => (
    <>
      <Title as="h1">This is an H1 title</Title>
      <Title as="h2">This is an H2 title</Title>
      <Title as="h3">This is an H3 title</Title>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All heading levels render correctly", async () => {
      const h1 = canvas.getByRole("heading", { level: 1 });
      const h2 = canvas.getByRole("heading", { level: 2 });
      const h3 = canvas.getByRole("heading", { level: 3 });

      await expect(h1).toBeInTheDocument();
      await expect(h1).toHaveTextContent("This is an H1 title");
      await expect(h2).toBeInTheDocument();
      await expect(h2).toHaveTextContent("This is an H2 title");
      await expect(h3).toBeInTheDocument();
      await expect(h3).toHaveTextContent("This is an H3 title");
    });
  },
};

// Sizes Story
export const Sizes: Story = {
  render: () => (
    <>
      <Title size="2xlarge">This is a title with 2xlarge</Title>
      <Title size="xlarge">This is a title with xlarge</Title>
      <Title size="large">This is a title with large</Title>
      <Title size="medium">This is a title with medium</Title>
      <Title size="small">This is a title with small</Title>
      <Title size="xsmall">This is a title with xsmall</Title>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All sizes render with correct data attributes", async () => {
      const xxlargeTitle = canvas.getByText(/with 2xlarge/i).closest("[data-size]");
      const xlargeTitle = canvas.getByText(/with xlarge/i).closest("[data-size]");
      const largeTitle = canvas.getByText(/with large/i).closest("[data-size]");
      const mediumTitle = canvas.getByText(/with medium/i).closest("[data-size]");
      const smallTitle = canvas.getByText(/with small/i).closest("[data-size]");
      const xsmallTitle = canvas.getByText(/with xsmall/i).closest("[data-size]");

      await expect(xxlargeTitle).toHaveAttribute("data-size", "2xlarge");
      await expect(xlargeTitle).toHaveAttribute("data-size", "xlarge");
      await expect(largeTitle).toHaveAttribute("data-size", "large");
      await expect(mediumTitle).toHaveAttribute("data-size", "medium");
      await expect(smallTitle).toHaveAttribute("data-size", "small");
      await expect(xsmallTitle).toHaveAttribute("data-size", "xsmall");
    });
  },
};

// Weights Story
export const Weights: Story = {
  render: () => (
    <>
      <Title weight="bold">Bold Weight</Title>
      <Title weight="regular">Regular Weight</Title>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All weights render with correct data attributes", async () => {
      const boldTitle = canvas.getByText("Bold Weight").closest("[data-weight]");
      const regularTitle = canvas.getByText("Regular Weight").closest("[data-weight]");

      await expect(boldTitle).toHaveAttribute("data-weight", "bold");
      await expect(regularTitle).toHaveAttribute("data-weight", "regular");
    });
  },
};

// Alignment Story
export const Alignment: Story = {
  render: () => (
    <>
      <Title align="left">Left Aligned Title</Title>
      <Title align="center">Center Aligned Title</Title>
      <Title align="right">Right Aligned Title</Title>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All alignments render with correct data attributes", async () => {
      const leftTitle = canvas.getByText("Left Aligned Title").closest("[data-align]");
      const centerTitle = canvas
        .getByText("Center Aligned Title")
        .closest("[data-align]");
      const rightTitle = canvas.getByText("Right Aligned Title").closest("[data-align]");

      await expect(leftTitle).toHaveAttribute("data-align", "left");
      await expect(centerTitle).toHaveAttribute("data-align", "center");
      await expect(rightTitle).toHaveAttribute("data-align", "right");
    });
  },
};

// Colors Story
export const Colors: Story = {
  render: () => (
    <>
      <Title>Default</Title>
      <Title data-color="primary">Primary</Title>
      <Title data-color="accent">Accent</Title>
      <Title data-color="brand-purple">Brand Purple</Title>
      <Title data-color="success">Success</Title>
      <Title data-color="warning">Warning</Title>
      <Title data-color="danger">Danger</Title>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All colors render with correct data attributes", async () => {
      const primary = canvas.getByText("Primary").closest("[data-color]");
      const secondary = canvas.getByText("Secondary").closest("[data-color]");
      const accent = canvas.getByText("Accent").closest("[data-color]");
      const brandPurple = canvas.getByText("Brand Purple").closest("[data-color]");
      const success = canvas.getByText("Success").closest("[data-color]");
      const warning = canvas.getByText("Warning").closest("[data-color]");
      const danger = canvas.getByText("Danger").closest("[data-color]");

      await expect(primary).toHaveAttribute("data-color", "primary");
      await expect(secondary).toHaveAttribute("data-color", "secondary");
      await expect(accent).toHaveAttribute("data-color", "accent");
      await expect(brandPurple).toHaveAttribute("data-color", "brand-purple");
      await expect(success).toHaveAttribute("data-color", "success");
      await expect(warning).toHaveAttribute("data-color", "warning");
      await expect(danger).toHaveAttribute("data-color", "danger");
    });
  },
};

// Semantic vs Visual
/**
 * This demonstrates how semantic level (as) can be independent from visual size
 */
export const SemanticVsVisual: Story = {
  render: () => (
    <>
      <Title as="h1" size="small">
        H1 but visually small
      </Title>
      <Title as="h2" size="xlarge">
        H2 but visually extra large
      </Title>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Semantic level is independent from visual size", async () => {
      const h1Title = canvas.getByRole("heading", { level: 1 });
      const h2Title = canvas.getByRole("heading", { level: 2 });

      await expect(h1Title).toHaveTextContent("H1 but visually small");
      await expect(h1Title).toHaveAttribute("data-size", "small");

      await expect(h2Title).toHaveTextContent("H2 but visually extra large");
      await expect(h2Title).toHaveAttribute("data-size", "xlarge");
    });
  },
};

// Combined Props
export const Combined: Story = {
  render: () => (
    <>
      <Title as="h1" size="xlarge" weight="bold" align="center" data-color="accent">
        Feature Title with All Props
      </Title>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All props combine correctly", async () => {
      const title = canvas.getByRole("heading", { level: 1 });

      await expect(title).toHaveTextContent("Feature Title with All Props");
      await expect(title).toHaveAttribute("data-size", "xlarge");
      await expect(title).toHaveAttribute("data-weight", "bold");
      await expect(title).toHaveAttribute("data-align", "center");
      await expect(title).toHaveAttribute("data-color", "accent");
    });
  },
};

// Accessibility
export const Accessibility: Story = {
  args: {
    as: "h1",
    children: "Accessible Title",
    id: "main-title",
    className: "custom-class",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Title has correct accessibility attributes", async () => {
      const title = canvas.getByRole("heading", { level: 1 });

      await expect(title).toHaveTextContent("Accessible Title");
      await expect(title).toHaveAttribute("id", "main-title");
      await expect(title).toHaveClass("custom-class");
    });
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <>
      <Title as="h1">Default H1</Title>
      <Title as="h2" size="large">
        Large H2
      </Title>
      <Title as="h3" size="medium" weight="bold">
        Bold H3
      </Title>
      <Title size="small" align="center">
        Small Centered
      </Title>
      <Title data-color="accent" weight="bold">
        Accent Bold
      </Title>
      <Title as="h2" size="xlarge" weight="bold" align="right" data-color="brand-purple">
        All Props Combined
      </Title>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole("heading");

    await expect(headings).toHaveLength(6);
  },
};

// Description
export const Description: Story = {
  render: () => (
    <Title description="This is a short description below the title">
      Title With Description
    </Title>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Description is rendered below the title", async () => {
      const title = canvas.getByRole("heading", { level: 2 });
      const description = canvas.getByText("This is a short description below the title");

      await expect(title).toBeInTheDocument();
      await expect(title).toHaveTextContent("Title With Description");

      await expect(description).toBeInTheDocument();
    });
  },
};
