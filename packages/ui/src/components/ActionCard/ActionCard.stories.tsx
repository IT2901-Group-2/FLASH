import { Meta, StoryObj } from "@storybook/react";
import ActionCard from "./ActionCard";
import { Camera, RotateCcw, Upload, X, Save, ArrowRight, QrCode, Edit } from "lucide-react";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", flexWrap: "wrap" }}>
      <ActionCard {...UploadToSelectedAlbum.args} />
      <ActionCard {...Loading.args} />
      <ActionCard {...SuccessfulUpload.args} />
    </div>
  ),
};

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
};

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
};

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
};

export const EditEvent : Story = {
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
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", flexWrap: "wrap" }}>
      <ActionCard {...UploadImage.args} />
      <ActionCard {...TakePhoto.args} />
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