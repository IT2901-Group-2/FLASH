import { Meta, StoryObj } from "@storybook/react";
import ActionCard from "./ActionCard";
import { Camera, Upload } from "lucide-react";

const meta: Meta<typeof ActionCard> = {
  title: "Byggeklosser/Komponenter/ActionCard",
  component: ActionCard,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [],
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof ActionCard>;

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