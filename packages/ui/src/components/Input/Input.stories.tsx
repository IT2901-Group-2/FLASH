import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { expect, fn, userEvent, within } from "storybook/test";
import { Search, User, Mail, Check, X } from "lucide-react";
import { colorNames } from "@/styles/colorType";

const meta: Meta<typeof Input> = {
  title: "Byggeklosser/Komponenter/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description:
        "Changes design and interaction-visuals. As of now only the primary variant has been designed",
    },
    "data-color": {
      control: "select",
      options: colorNames,
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
    loading: false,
    disabled: false,
    success: false,
    required: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

// Variants Story
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Input variant="primary" placeholder="Primary variant" aria-label="primary" />
      <Input variant="secondary" placeholder="Secondary variant" aria-label="secondary" />
      <Input variant="tertiary" placeholder="Tertiary variant" aria-label="tertiary" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("textbox");

    await expect(inputs).toHaveLength(3);
    const primaryWrapper = inputs[0].closest("[data-variant]");
    const secondaryWrapper = inputs[1].closest("[data-variant]");
    const tertiaryWrapper = inputs[2].closest("[data-variant]");

    await expect(primaryWrapper).toHaveAttribute("data-variant", "primary");
    await expect(secondaryWrapper).toHaveAttribute("data-variant", "secondary");
    await expect(tertiaryWrapper).toHaveAttribute("data-variant", "tertiary");
  },
};

// Comprehensive Interaction Tests
export const Interactions: Story = {
  args: {
    placeholder: "Interactive Input",
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const input = canvas.getByRole("textbox");

    await step("Input renders correctly", async () => {
      await expect(input).toBeInTheDocument();
    });

    await step("Input responds to typing", async () => {
      await user.type(input, "Hello");
      await expect(args.onChange).toHaveBeenCalled();
      await expect(input).toHaveValue("Hello");
    });

    await step("Input responds to focus", async () => {
      await user.click(input);
      await expect(args.onFocus).toHaveBeenCalled();
      await expect(input).toHaveFocus();
    });

    await step("Input responds to blur", async () => {
      await user.tab();
      await expect(args.onBlur).toHaveBeenCalled();
    });

    await step("Input can be cleared", async () => {
      await user.clear(input);
      await expect(input).toHaveValue("");
    });
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    placeholder: "Disabled Input",
    disabled: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Input is disabled", async () => {
      await expect(input).toBeDisabled();
    });

    await step("Disabled input does not respond to typing", async () => {
      await userEvent.type(input, "Test");
      await expect(args.onChange).not.toHaveBeenCalled();
      await expect(input).toHaveValue("");
    });

    await step("Disabled input cannot be focused", async () => {
      input.focus();
      await expect(input).not.toHaveFocus();
    });
  },
};

// Loading State
export const Loading: Story = {
  args: {
    placeholder: "Loading Input",
    loading: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Input shows loading state", async () => {
      await expect(input).toBeDisabled();
    });

    await step("Loading input does not respond to typing", async () => {
      await userEvent.type(input, "Test");
      await expect(args.onChange).not.toHaveBeenCalled();
    });
  },
};

// Icon Tests
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Input
        placeholder="Icon on left"
        icon={<Search data-testid="search-icon" />}
        iconPosition="left"
        aria-label="left"
      />
      <Input
        aria-label="right"
        placeholder="Icon on right"
        icon={<Check data-testid="check-icon" />}
        iconPosition="right"
      />
      <Input placeholder="No icon" aria-label="noIcon" />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Inputs render with icons", async () => {
      const searchIcon = canvas.getByTestId("search-icon");
      const checkIcon = canvas.getByTestId("check-icon");

      await expect(searchIcon).toBeInTheDocument();
      await expect(checkIcon).toBeInTheDocument();
    });
  },
};

// Label and Required Tests
export const WithLabel: Story = {
  args: {
    label: "Email Address",
    placeholder: "you@example.com",
    required: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Input has associated label", async () => {
      const input = canvas.getByRole("textbox");
      const label = canvas.getByText("Email Address");

      await expect(label).toBeInTheDocument();
      await expect(input).toHaveAccessibleName("Email Address");
    });
  },
};

export const RequiredField: Story = {
  args: {
    label: "Required Field",
    placeholder: "This field is required",
    required: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Input shows required indicator", async () => {
      const label = canvas.getByText(/Required Field/);
      const asterisk = canvas.getByText("*");

      await expect(label).toBeInTheDocument();
      await expect(asterisk).toBeInTheDocument();
    });

    await step("Input has required attribute", async () => {
      const input = canvas.getByRole("textbox");
      await expect(input).toBeRequired();
    });
  },
};

// Error and Helper Text
export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    error: "Please enter a valid email address",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Error message is displayed", async () => {
      const errorMessage = canvas.getByText("Please enter a valid email address");
      await expect(errorMessage).toBeInTheDocument();
    });
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Username",
    placeholder: "Enter your username",
    helperText: "Username must be at least 3 characters",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Helper text is displayed", async () => {
      const helperText = canvas.getByText("Username must be at least 3 characters");
      await expect(helperText).toBeInTheDocument();
    });
  },
};

// Success State
export const SuccessState: Story = {
  args: {
    label: "Username",
    placeholder: "johndoe",
    icon: <Check data-testid="success-icon" />,
    iconPosition: "right",
    success: true,
    helperText: "This username is available!",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Success state is visible", async () => {
      const icon = canvas.getByTestId("success-icon");
      const helperText = canvas.getByText("This username is available!");

      await expect(icon).toBeInTheDocument();
      await expect(helperText).toBeInTheDocument();
    });
  },
};

// Accessibility Tests
export const Accessibility: Story = {
  args: {
    label: "Accessible Input",
    "aria-label": "Custom accessible label",
    placeholder: "Type here",
    required: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Input has correct ARIA attributes", async () => {
      await expect(input).toHaveAccessibleName("Custom accessible label");
    });

    await step("Input is keyboard accessible", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
    });

    await step("Input has required attribute", async () => {
      await expect(input).toBeRequired();
    });
  },
};

// Different Input Types
export const InputTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Input aria-label="text" type="text" placeholder="Text input" label="Text" />
      <Input
        aria-label="email"
        type="email"
        placeholder="email@example.com"
        label="Email"
      />
      <Input
        aria-label="password"
        type="password"
        placeholder="••••••••"
        label="Password"
      />
      <Input aria-label="number" type="number" placeholder="123" label="Number" />
      <Input
        aria-label="telephone"
        type="tel"
        placeholder="123-456-7890"
        label="Telephone"
      />
      <Input aria-label="url" type="url" placeholder="https://example.com" label="URL" />
      <Input aria-label="search" type="search" placeholder="Search..." label="Search" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("textbox");

    await expect(inputs.length).toBeGreaterThan(0);
  },
};

// Data Attributes
export const DataAttributes: Story = {
  args: {
    placeholder: "Custom Color Input",
    "data-color": "accent",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    // Check parent wrapper has data-color attribute
    const wrapper = input.closest("[data-color]");
    await expect(wrapper).toHaveAttribute("data-color", "accent");
  },
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Input aria-label="default" placeholder="Default state" icon={<Search />} />
      <Input
        aria-label="disabled"
        placeholder="Disabled state"
        icon={<Search />}
        disabled
      />
      <Input aria-label="loading" placeholder="Loading state" icon={<Search />} loading />
      <Input
        aria-label="success"
        placeholder="Success state"
        icon={<Check />}
        iconPosition="right"
        success
        helperText="Success!"
      />
      <Input
        aria-label="error"
        placeholder="Error state"
        icon={<X />}
        error="Error message"
      />
      <Input
        aria-label="labeled"
        label="With label"
        placeholder="Labeled input"
        helperText="Helper text"
      />
      <Input
        aria-label="required"
        label="Required field"
        placeholder="Required input"
        required
        icon={<Mail />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("textbox");

    await expect(inputs).toHaveLength(7);
  },
};

// Form Validation Example
export const FormValidation: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const input = canvas.getByRole("textbox");

    await step("User types invalid email", async () => {
      await user.type(input, "invalid-email");
      await expect(input).toHaveValue("invalid-email");
    });

    await step("User corrects to valid email", async () => {
      await user.clear(input);
      await user.type(input, "valid@example.com");
      await expect(input).toHaveValue("valid@example.com");
    });

    await step("onChange was called", async () => {
      await expect(args.onChange).toHaveBeenCalled();
    });
  },
};
