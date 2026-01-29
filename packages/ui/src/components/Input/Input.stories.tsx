import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { fn } from "storybook/test";
import { Search, User, Mail, Check, X } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "Byggeklosser/Komponenter/Input",
  component: Input,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description:
        "Changes design and interaction-visuals. As of now only the primary variant has been designed",
    },
    "data-color": {
      control: "select",
      options: ["accent", "neutral", "brand-purple"],
      description: "Overrides inherited color scheme",
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Icon position in input",
    },
    disabled: {
      control: "boolean",
      description: "Prevent user interaction",
    },
    loading: {
      control: "boolean",
      description: "Shows loader inside input",
    },
    success: {
      control: "boolean",
      description: "Shows success state styling",
    },
    required: {
      control: "boolean",
      description: "Marks the input as required (adds asterisk to label)",
    },
  },
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  decorators: [
    Story => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const With_Labels: Story = {
  render: () => (
    <>
      <Input label="Email Address" placeholder="you@example.com" icon={<Mail />} />
      <Input label="Username" placeholder="Enter your username" icon={<User />} />
      <Input label="Search" placeholder="Search..." icon={<Search />} />
    </>
  ),
};

export const Required_Fields: Story = {
  render: () => (
    <>
      <Input
        label="Email Address"
        placeholder="you@example.com"
        icon={<Mail />}
        required
      />
      <Input label="Full Name" placeholder="John Doe" icon={<User />} required />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
      />
    </>
  ),
};

export const Labels_With_States: Story = {
  render: () => (
    <>
      <Input
        label="Email Address"
        placeholder="you@example.com"
        icon={<Mail />}
        helperText="We'll never share your email with anyone else."
      />
      <Input
        label="Username"
        placeholder="johndoe"
        icon={<Check />}
        iconPosition="right"
        success
        helperText="This username is available!"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error="Password must be at least 8 characters"
        required
      />
      <Input label="Company Name" placeholder="Acme Inc." disabled />
    </>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <>
      <Input placeholder="Search..." icon={<Search />} />
      <Input placeholder="Enter your name" icon={<User />} />
      <Input placeholder="Enter your email" icon={<Mail />} />
    </>
  ),
};

export const Icon_Position: Story = {
  render: () => (
    <>
      <Input placeholder="Icon on left" icon={<Search />} iconPosition="left" />
      <Input placeholder="Icon on right" icon={<Check />} iconPosition="right" />
    </>
  ),
};

export const Colors: Story = {
  render: () => (
    <>
      <Input data-color="brand-purple" placeholder="Brand purple" icon={<Search />} />
      <Input data-color="accent" placeholder="Accent color" icon={<Search />} />
      <Input data-color="neutral" placeholder="Neutral color" icon={<Search />} />
    </>
  ),
};

export const States: Story = {
  render: () => (
    <>
      <Input placeholder="Normal state" icon={<Search />} />
      <Input placeholder="Disabled state" icon={<Search />} disabled />
      <Input placeholder="Loading state" icon={<Search />} loading />
      <Input placeholder="Success state" icon={<Check />} iconPosition="right" success />
      <Input placeholder="Error state" icon={<X />} error="Error message" />
    </>
  ),
};

export const With_Helper_Text: Story = {
  render: () => (
    <>
      <Input
        placeholder="Enter your username"
        helperText="Username must be at least 3 characters"
      />
      <Input placeholder="Enter your email" error="This email is already taken" />
    </>
  ),
};

export const Different_Types: Story = {
  render: () => (
    <>
      <Input type="text" placeholder="Text input" icon={<User />} />
      <Input type="email" placeholder="Email input" icon={<Mail />} />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="date" />
    </>
  ),
};

export const Complex_Example: Story = {
  render: () => (
    <>
      <div>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail />}
          helperText="We'll never share your email with anyone else."
        />
      </div>
      <div>
        <Input
          label="Search"
          type="search"
          placeholder="Search for anything..."
          icon={<Search />}
          loading
        />
      </div>
      <div>
        <Input
          label="Username"
          placeholder="johndoe"
          icon={<Check />}
          iconPosition="right"
          success
          helperText="This username is available!"
        />
      </div>
    </>
  ),
};
