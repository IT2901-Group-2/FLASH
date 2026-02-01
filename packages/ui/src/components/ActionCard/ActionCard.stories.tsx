import { Meta, StoryObj } from "@storybook/react";
import ActionCard from "./ActionCard";
import { Camera, RotateCcw, Upload, X, CheckCircle2 } from "lucide-react";

const meta: Meta<typeof ActionCard> = {
  title: "Byggeklosser/Komponenter/ActionCard",
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
};

/* TakePhoto variant with secondary and primary buttons */
export const TakePhoto: Story = {
  args: {
    secondaryButton: {
      text: "Take Photo",
      icon: <Camera size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
    primaryButton: {
      text: "Upload Image",
      icon: <Upload size={18} />,
      iconPosition: "right",
      "data-color": "brand-purple",
    },
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
};

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
    }
  },
};

export const UploadStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <ActionCard
        description="Upload an image to the selected album."
        descriptionColor="brand-purple"
        primaryButton={{
          text: "Upload Image",
          icon: <Upload size={18} />,
          iconPosition: "right",
          "data-color": "brand-purple",
        }}
        secondaryButton={{
          text: "Cancel",
          icon: <Camera size={18} />,
          iconPosition: "right",
          variant: "secondary",
          "data-color": "brand-purple",
        }}
      />
      <ActionCard
        description="Uploading image..."
        descriptionColor="brand-purple"
        primaryButton={{
          text: "Uploading...",
          loading: true,
          icon: <Upload size={18} />,
          iconPosition: "right",
          "data-color": "brand-purple",
        }}
        secondaryButton={{
          text: "Cancel",
          icon: <Camera size={18} />,
          iconPosition: "right",
          variant: "secondary",
          "data-color": "brand-purple",
        }}
      />
      <ActionCard
        description="Upload successful!"
        descriptionColor="success"
        primaryButton={{
          text: "Done",
          icon: <CheckCircle2 size={18} />,
          iconPosition: "right",
          "data-color": "brand-purple",
        }}
        secondaryButton={{
          text: "Upload Another",
          icon: <Upload size={18} />,
          iconPosition: "right",
          variant: "secondary",
          "data-color": "brand-purple",
        }}
      />
    </div>
  ),
};
