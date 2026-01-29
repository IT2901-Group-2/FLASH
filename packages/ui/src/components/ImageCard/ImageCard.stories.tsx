import type { Meta, StoryObj } from "@storybook/react";
import { ImageCard } from "./ImageCard";
import { fn } from "storybook/test";
import { Check, Star, X } from "lucide-react";

// Example icons (you can replace these with your actual icon components)

const meta: Meta<typeof ImageCard> = {
  title: "Byggeklosser/Komponenter/ImageCard",
  component: ImageCard,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    loading: {
      control: "boolean",
    },
    rejected: {
      control: "boolean",
    },
    approved: {
      control: "boolean",
    },
    selected: {
      control: "boolean",
    },
    "data-color": {
      control: "select",
      options: ["brand-purple", "brand-blue", "brand-green"],
    },
  },
  args: {
    onClick: fn(),
    src: "https://picsum.photos/300/450",
    alt: "Mountain landscape",
    title: "Beautiful Mountain",
  },
  decorators: [
    Story => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageCard>;

export default meta;
type Story = StoryObj<typeof ImageCard>;

export const Standard_Purple: Story = {
  args: {
    src: "https://picsum.photos/300/450",
    alt: "Mountain landscape",
    title: "Beautiful Mountain",
    "data-color": "brand-purple",
  },
};

export const AllSizes: Story = {
  render: () => (
    <>
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Small Size"
        size="small"
      />
      <ImageCard
        src="https://picsum.photos/300/450"
        alt="Mountain landscape"
        title="Medium Size"
        size="medium"
      />
      <ImageCard
        src="https://picsum.photos/400/600"
        alt="Mountain landscape"
        title="Large Size"
        size="large"
      />
    </>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <>
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Primary Variant"
        variant="primary"
      />
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Secondary Variant"
        variant="secondary"
      />
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Tertiary Variant"
        variant="tertiary"
      />
    </>
  ),
};

export const WithStates: Story = {
  render: () => (
    <>
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Approved Image"
        approved={true}
        icon={<Check />}
      />
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Rejected Image"
        rejected={true}
        icon={<X />}
      />
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Selected Image"
        selected={true}
        icon={<Star />}
      />
    </>
  ),
};

export const Loading: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    alt: "Mountain landscape",
    title: "Loading Image",
    loading: true,
  },
};

export const WithIcon: Story = {
  render: () => (
    <>
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Image with Check Icon"
        icon={<Check />}
      />
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Image with X Icon"
        icon={<X />}
      />
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Mountain landscape"
        title="Image with Star Icon"
        icon={<Star />}
      />
    </>
  ),
};

export const Interactive: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    alt: "Mountain landscape",
    title: "Click me!",
    style: { cursor: "pointer" },
  },
};

export const Playground: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    alt: "Mountain landscape",
    title: "Customize Me",
    size: "medium",
    variant: "primary",
    loading: false,
    approved: false,
    rejected: false,
    selected: false,
  },
};
