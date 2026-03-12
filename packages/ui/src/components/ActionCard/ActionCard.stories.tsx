import { Meta, StoryObj } from "@storybook/react-vite";
import ActionCard from "./ActionCard";
import {
  RotateCcw,
  Upload,
  X,
  Save,
  ArrowRight,
  QrCode,
  Edit,
} from "lucide-react";
import { expect, within } from "storybook/test";

const meta: Meta<typeof ActionCard> = {
  title: "Building Blocks/Components/ActionCard",
  component: ActionCard,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [],
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof ActionCard>;

/* Upload image variant with primary button only */
export const UploadImage: Story = {
  args: {
    description: "You have 10 uploads remaining",
    primaryButton: {
      text: "Upload Image",
      icon: <Upload size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("You have 10 uploads remaining")).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Upload Image" })
    ).toBeInTheDocument();
  },
};

/* Successful upload variant with description and both buttons */
export const SuccessfulUpload: Story = {
  args: {
    description: "Upload successful! You have 9 uploads remaining.",
    descriptionColor: "success",
    secondaryButton: {
      text: "Cancel",
      icon: <X size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Upload Image",
      icon: <Upload size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
      disabled: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Upload successful! You have 9 uploads remaining.")
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Upload Image" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  },
};

/* Failed upload variant with description and both buttons */
export const FailedUpload: Story = {
  args: {
    description: "Upload failed. Please try again.",
    descriptionColor: "warning",
    secondaryButton: {
      text: "Cancel",
      icon: <X size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Try Again",
      icon: <RotateCcw size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Upload failed. Please try again.")
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  },
};

/* Upload to selected album variant with description and both buttons */
export const UploadToSelectedAlbum: Story = {
  args: {
    description: "You have 10 uploads remaining",
    secondaryButton: {
      text: "Cancel",
      icon: <X size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Upload to selected album",
      icon: <Upload size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("You have 10 uploads remaining")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Upload to selected album" })
    ).toBeInTheDocument();
  },
};

/* Loading variant with description and both buttons */
export const Loading: Story = {
  args: {
    description: "Uploading...",
    secondaryButton: {
      text: "Cancel",
      disabled: true,
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "",
      loading: true,
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Uploading...")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeDisabled();
  },
};

/* Story showcasing upload states */
export const UploadStates: Story = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "2rem", flexWrap: "wrap" }}
    >
      <ActionCard {...UploadToSelectedAlbum.args} />
      <ActionCard {...Loading.args} />
      <ActionCard {...SuccessfulUpload.args} />
    </div>
  ),
};

/* Save changes variant with both buttons */
export const SaveChanges: Story = {
  args: {
    secondaryButton: {
      text: "Cancel",
      icon: <X size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Save Changes",
      icon: <Save size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument();
  },
};

/* Variant with Next button */
export const Next: Story = {
  args: {
    secondaryButton: {
      text: "Cancel",
      icon: <X size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Next",
      icon: <ArrowRight size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Next" })).toBeInTheDocument();
  },
};

/* Variant with Download QR Code button */
export const DownloadQrCode: Story = {
  args: {
    secondaryButton: {
      text: "Download QR Code",
      icon: <QrCode size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Done",
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Download QR Code" })
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Done" })).toBeInTheDocument();
  },
};

/* Variant with Edit Event button */
export const EditEvent: Story = {
  args: {
    secondaryButton: {
      text: "Edit Event",
      icon: <Edit size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Go to Event",
      icon: <ArrowRight size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Edit Event" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Go to Event" })).toBeInTheDocument();
  },
};

/* All variants showcased together */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "2rem", flexWrap: "wrap" }}
    >
      <ActionCard {...UploadImage.args} />
      <ActionCard {...SuccessfulUpload.args} />
      <ActionCard {...FailedUpload.args} />
      <ActionCard {...UploadToSelectedAlbum.args} />
      <ActionCard {...Loading.args} />
      <ActionCard {...SaveChanges.args} />
      <ActionCard {...Next.args} />
      <ActionCard {...DownloadQrCode.args} />
      <ActionCard {...EditEvent.args} />
    </div>
  ),
};
