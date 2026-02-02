import type { Meta, StoryObj } from "@storybook/react";
import { ImageCard } from "./ImageCard";
import { expect, fn, userEvent, within } from "storybook/test";
import { Heart, Star, Camera } from "lucide-react";
import { useState } from "react";

const TestIcon = <Star data-testid="test-icon" />;

// Sample image URLs for testing
const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400";
const SAMPLE_IMAGE_2 =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400";

const meta: Meta<typeof ImageCard> = {
  title: "Byggeklosser/Komponenter/ImageCard",
  component: ImageCard,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      description:
        "Changes design and styling. As of now there only exists styling for the primary variant",
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    state: {
      control: "select",
      options: ["loading", "rejected", "approved", "selected", "pending", "default"],
    },
    src: { control: { type: "text" } },
    alt: { control: { type: "text" } },
    title: { control: { type: "text" } },
  },
  decorators: [],
} satisfies Meta<typeof ImageCard>;

export default meta;
type Story = StoryObj<typeof ImageCard>;

// Basic Variant Tests
export const PrimaryVariant: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Sample landscape image",
    title: "Beautiful Landscape",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = canvas.getByRole("img");
    const title = canvas.getByText(/beautiful landscape/i);

    await expect(image).toBeInTheDocument();
    await expect(image).toHaveAttribute("alt", "Sample landscape image");
    await expect(title).toBeInTheDocument();
  },
};

// Size Tests
export const SmallSize: Story = {
  args: {
    variant: "primary",
    size: "small",
    src: SAMPLE_IMAGE,
    alt: "Small card",
    title: "Small Card",
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-size="small"]');

    await expect(card).toBeInTheDocument();
  },
};

export const MediumSize: Story = {
  args: {
    variant: "primary",
    size: "medium",
    src: SAMPLE_IMAGE,
    alt: "Medium card",
    title: "Medium Card",
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-size="medium"]');

    await expect(card).toBeInTheDocument();
  },
};

export const LargeSize: Story = {
  args: {
    variant: "primary",
    size: "large",
    src: SAMPLE_IMAGE,
    alt: "Large card",
    title: "Large Card",
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-size="large"]');

    await expect(card).toBeInTheDocument();
  },
};

// Click Interaction Tests
export const ClickInteraction: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Clickable card",
    title: "Click Me",
    onClick: () => alert("clicked"),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Card renders as clickable button", async () => {
      const card = canvas.getByRole("button");
      await expect(card).toBeInTheDocument();
    });

    await step("Card is clickable and fires onClick", async () => {
      const card = canvas.getByRole("button");
      await user.click(card);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step("Multiple clicks work correctly", async () => {
      const card = canvas.getByRole("button");
      await user.click(card);
      await user.click(card);
      await expect(args.onClick).toHaveBeenCalledTimes(3);
    });
  },
};

export const NonClickableCard: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Non-clickable card",
    title: "No Click Handler",
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-variant="primary"]');

    await expect(card).toBeInTheDocument();
    await expect(card).not.toHaveAttribute("role", "button");
    await expect(card).not.toHaveAttribute("tabIndex");
  },
};

// State Tests
export const LoadingState: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Loading image",
    title: "Image Title",
    state: "loading",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loadingText = canvas.getByText(/loading\.\.\./i);

    await expect(loadingText).toBeInTheDocument();
  },
};

export const RejectedState: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Rejected image",
    title: "Image Title",
    state: "rejected",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rejectedText = canvas.getByText(/rejected/i);

    await expect(rejectedText).toBeInTheDocument();
  },
};

export const ApprovedState: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Approved image",
    title: "Image Title",
    state: "approved",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const approvedText = canvas.getByText(/approved/i);

    await expect(approvedText).toBeInTheDocument();
  },
};

export const SelectedState: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Selected image",
    title: "Image Title",
    state: "selected",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectedText = canvas.getByText(/selected/i);

    await expect(selectedText).toBeInTheDocument();
  },
};

export const PendingState: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Pending image",
    title: "Image Title",
    state: "pending",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pendingText = canvas.getByText(/pending\.\.\./i);

    await expect(pendingText).toBeInTheDocument();
  },
};

// Icon Tests
export const CardWithIcon: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Card with icon",
    title: "Featured Image",
    icon: TestIcon,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByTestId("test-icon");
    const title = canvas.getByText(/featured image/i);

    await expect(icon).toBeInTheDocument();
    await expect(title).toBeInTheDocument();
  },
};

// Data Color Tests
export const CustomColorPurple: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Purple themed card",
    title: "Purple Theme",
    "data-color": "brand-purple",
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-color="brand-purple"]');
    await expect(card).toBeInTheDocument();
  },
};
// Keyboard Interaction Tests
export const KeyboardInteraction: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Keyboard test card",
    title: "Keyboard Test",
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Card can be focused with keyboard", async () => {
      const card = canvas.getByRole("button");
      await userEvent.tab();
      await expect(card).toHaveFocus();
    });

    await step("Card responds to Enter key", async () => {
      const card = canvas.getByRole("button");
      card.focus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onClick).toHaveBeenCalled();
    });

    await step("Card responds to Space key", async () => {
      const card = canvas.getByRole("button");
      card.focus();
      await userEvent.keyboard(" ");
      await expect(args.onClick!).toHaveBeenCalledTimes(2);
    });
  },
};

// Accessibility Tests
export const AccessibilityTest: Story = {
  args: {
    variant: "primary",
    src: SAMPLE_IMAGE,
    alt: "Accessible image description",
    title: "Accessible Card",
    onClick: fn(),
    "aria-label": "Custom card label",
    "aria-describedby": "card-description",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Card has correct ARIA attributes", async () => {
      const card = canvas.getByRole("button");
      await expect(card).toHaveAttribute("aria-label", "Custom card label");
      await expect(card).toHaveAttribute("aria-describedby", "card-description");
    });

    await step("Image has correct alt text", async () => {
      const image = canvas.getByRole("img");
      await expect(image).toHaveAttribute("alt", "Accessible image description");
    });

    await step("Card is keyboard accessible", async () => {
      const card = canvas.getByRole("button");
      await userEvent.tab();
      await expect(card).toHaveFocus();
    });
  },
};

// All States Comparison
export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      <ImageCard variant="primary" src={SAMPLE_IMAGE} alt="Normal state" title="Normal" />
      <ImageCard
        variant="primary"
        src={SAMPLE_IMAGE}
        alt="Loading state"
        title="Title"
        state="loading"
      />
      <ImageCard
        variant="primary"
        src={SAMPLE_IMAGE}
        alt="Pending state"
        title="Title"
        state="pending"
      />
      <ImageCard
        variant="primary"
        src={SAMPLE_IMAGE}
        alt="Approved state"
        title="Title"
        state="approved"
      />
      <ImageCard
        variant="primary"
        src={SAMPLE_IMAGE}
        alt="Selected state"
        title="Title"
        state="selected"
      />
      <ImageCard
        variant="primary"
        src={SAMPLE_IMAGE}
        alt="Rejected state"
        title="Title"
        state="rejected"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const images = canvas.getAllByRole("img");

    await expect(images).toHaveLength(6);
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <ImageCard
        variant="primary"
        size="small"
        src={SAMPLE_IMAGE}
        alt="Small size"
        title="Small"
      />
      <ImageCard
        variant="primary"
        size="medium"
        src={SAMPLE_IMAGE}
        alt="Medium size"
        title="Medium"
      />
      <ImageCard
        variant="primary"
        size="large"
        src={SAMPLE_IMAGE}
        alt="Large size"
        title="Large"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const images = canvas.getAllByRole("img");

    await expect(images).toHaveLength(3);
  },
};

// Interactive Gallery Example
export const InteractiveGallery: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {[1, 2, 3, 4].map(id => (
          <ImageCard
            key={id}
            variant="primary"
            src={id % 2 === 0 ? SAMPLE_IMAGE : SAMPLE_IMAGE_2}
            alt={`Gallery image ${id}`}
            title={`Image ${id}`}
            state={selectedId === `image-${id}` ? "selected" : "default"}
            onClick={() => setSelectedId(`image-${id}`)}
            icon={<Heart />}
          />
        ))}
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Gallery renders all cards", async () => {
      const cards = canvas.getAllByRole("button");
      await expect(cards).toHaveLength(4);
    });

    await step("Clicking a card selects it", async () => {
      const cards = canvas.getAllByRole("button");
      await user.click(cards[0]);
      // The selected state should be visible
      const selectedText = await canvas.findByText(/selected/i);
      await expect(selectedText).toBeInTheDocument();
    });
  },
};

// Complex State with Icon
export const ComplexCard: Story = {
  args: {
    variant: "primary",
    size: "large",
    src: SAMPLE_IMAGE,
    alt: "Complex card example",
    title: "Photography Contest Entry",
    icon: <Camera />,
    "data-color": "brand-purple",
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    const card = canvas.getByRole("button");
    const image = canvas.getByRole("img");

    await expect(card).toBeInTheDocument();
    await expect(image).toHaveAttribute("alt", "Complex card example");

    await user.click(card);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
