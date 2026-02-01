import { Meta, StoryObj } from "@storybook/react";
import ActionCard from "./ActionCard";
import { Camera, Cross, Upload, X } from "lucide-react";

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

