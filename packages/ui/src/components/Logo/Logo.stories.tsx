import { Meta, StoryObj } from "@storybook/react-vite";
import Logo from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Building Blocks/Components/Logo",
  tags: ["autodocs"],
  component: Logo,
  args: {},
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    animationOnHover: true,
  },
};

export const Loader: Story = {
  args: {
    isLoader: true,
  },
};

export const LoaderStar: Story = {
  args: {
    isLoader: true,
    starOnly: true,
  },
};
