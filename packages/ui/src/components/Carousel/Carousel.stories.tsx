import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "./Carousel";
import { ImageCard } from "../ImageCard";
import { expect, userEvent, within } from "storybook/test";
import { ChevronRight, Folder } from "lucide-react";

const meta: Meta<typeof Carousel> = {
  title: "Byggeklosser/Komponenter/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "Carousel Content.",
      control: "text",
    },
    "data-color": {
      description: "Overrides inherited color.",
      options: ["brand-purple", "accent", "success", "warning", "neutral"],
      control: "select",
    },
    gap: {
      description: "Gap between items (in rem)",
      control: "number",
    },
    showIndicator: {
      description: "Show scroll indicator",
      control: "boolean",
    },
    indicatorText: {
      description: "Indicator text",
      control: "text",
    },
  },
  decorators: [
    Story => (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem" }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof Carousel>;

// Photo Card Component for demos
const PhotoCard = ({ image, onClick }: { image?: string; onClick?: () => void }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={e => e.key === "Enter" && onClick?.()}
    style={{
      width: "200px",
      height: "200px",
      borderRadius: "16px",
      overflow: "hidden",
      backgroundColor: image ? "transparent" : "#e0e0e0",
      backgroundImage: image ? `url(${image})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
);

export const AlbumGallery: Story = {
  args: {
    showIndicator: true,
    indicatorText: "Scroll to see more albums",
    gap: 1,
    onIndicatorClick: () => alert("Navigate to albums list"),
  },
  render: args => (
    <div style={{ maxWidth: "600px" }}>
      <button
        onClick={() => alert("Navigate to albums list")}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          marginBottom: "1rem",
          fontSize: "2.25rem",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--color-brand-purple-800)",
          fontFamily: "inherit",
          lineHeight: 1.2,
          transition: "transform 0.2s ease",
          transform: "translateY(0)",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-0.25rem)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        onMouseDown={e => (e.currentTarget.style.transform = "translateY(0)")}
        onMouseUp={e => (e.currentTarget.style.transform = "translateY(-0.25rem)")}
      >
        Albums
        <ChevronRight size={28} />
      </button>
      <Carousel {...args}>
        <ImageCard
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400"
          title="Main Gallery"
          alt="Main Image Gallery"
          icon={<Folder size={16} />}
          onClick={() => alert("Clicked: Main Gallery")}
        />
        <ImageCard
          src=""
          title="No thumbnail"
          alt="Missing thumbnail"
          icon={<Folder size={16} />}
          onClick={() => alert("Clicked: No thumbnail")}
        />
        <ImageCard
          src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400"
          title="Ceremony"
          alt="Ceremony Album"
          icon={<Folder size={16} />}
          onClick={() => alert("Clicked: Ceremony")}
        />
        <ImageCard
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400"
          title="Reception"
          alt="Reception Album"
          icon={<Folder size={16} />}
          onClick={() => alert("Clicked: Reception")}
        />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Scroll indicator is visible", async () => {
      const indicator = canvas.getByText(/Scroll to see more albums/i);
      await expect(indicator).toBeInTheDocument();
    });

    await step("All image cards are rendered", async () => {
      const cards = canvas.getAllByRole("button");
      // Should have 4 image cards plus the Albums button
      await expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    await step("Album button is interactive", async () => {
      const albumButton = Array.from(canvas.getAllByRole("button")).find(btn =>
        btn.textContent?.includes("Albums")
      );
      if (albumButton) {
        await expect(albumButton).toBeInTheDocument();
        await user.click(albumButton);
      }
    });

    await step("Image cards are clickable", async () => {
      const imageCards = canvas.getAllByRole("button").slice(1);
      if (imageCards.length > 0) {
        await user.click(imageCards[0]);
        await expect(imageCards[0]).toBeInTheDocument();
      }
    });
  },
};

export const PhotosWithNames: Story = {
  args: {
    showIndicator: true,
    indicatorText: "Scroll to see more photos",
    gap: 1,
    onIndicatorClick: () => alert("Navigate to photos list"),
  },
  render: args => (
    <div style={{ maxWidth: "600px" }}>
      <button
        onClick={() => alert("Navigate to photos")}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          marginBottom: "1rem",
          fontSize: "2.25rem",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--color-brand-purple-800)",
          fontFamily: "inherit",
          lineHeight: 1.2,
          transition: "transform 0.2s ease",
          transform: "translateY(0)",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-0.25rem)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        onMouseDown={e => (e.currentTarget.style.transform = "translateY(0)")}
        onMouseUp={e => (e.currentTarget.style.transform = "translateY(-0.25rem)")}
      >
        Photos
        <ChevronRight size={28} />
      </button>
      <Carousel {...args}>
        <ImageCard
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400"
          title="Sofia Lund"
          alt="Photo from Sofia Lund"
          onClick={() => alert("Clicked: Sofia Lund")}
        />
        <ImageCard
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400"
          title="Marius Berg"
          alt="Photo from Marius Berg"
          onClick={() => alert("Clicked: Marius Berg")}
        />
        <ImageCard
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400"
          title="Ida Nilsen"
          alt="Photo from Ida Nilsen"
          onClick={() => alert("Clicked: Ida Nilsen")}
        />
        <ImageCard
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400"
          title="Jonas Dahl"
          alt="Photo from Jonas Dahl"
          onClick={() => alert("Clicked: Jonas Dahl")}
        />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Scroll indicator is visible", async () => {
      const indicator = canvas.getByText(/Scroll to see more photos/i);
      await expect(indicator).toBeInTheDocument();
    });

    await step("Photo name cards are rendered", async () => {
      const cards = canvas.getAllByRole("button");
      await expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    await step("Photo cards are clickable", async () => {
      const imageCards = canvas.getAllByRole("button").slice(1);
      if (imageCards.length > 0) {
        await user.click(imageCards[0]);
        await expect(imageCards[0]).toBeInTheDocument();
      }
    });
  },
};
