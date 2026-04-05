import { flashUiMock } from "../../../../__mocks__"; // TODO - Change import path in test refactor branch
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OptionsStep from "./OptionsStep";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// vi.hoisted ensures these are available inside the hoisted vi.mock() factories
const { mockRegister, mockSetValue, mockWatch, mockUseFormState } = vi.hoisted(() => ({
  mockRegister: vi.fn(() => ({
    name: "uploadLimit",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  })),
  mockSetValue: vi.fn(),
  mockWatch: vi.fn(),
  mockUseFormState: vi.fn(() => ({ errors: {} })),
}));

vi.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: mockRegister,
    control: {},
    watch: mockWatch,
    setValue: mockSetValue,
  }),
  useFormState: mockUseFormState,
}));

// React is imported above so JSX inside this factory has createElement in scope
vi.mock("@flash/ui", () => flashUiMock());

vi.mock("./Steps.module.css", () => ({
  default: { maxImageContainer: "maxImageContainer" },
}));

const renderComponent = () => render(<OptionsStep />);

describe("OptionsStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWatch.mockReturnValue(undefined); // uploadLimit undefined ("unlimited") by default
    mockUseFormState.mockReturnValue({ errors: {} });
  });

  describe("initial render", () => {
    it("renders the title and description", () => {
      renderComponent();
      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByText("description")).toBeInTheDocument();
    });

    it("renders the DropdownControl in unlimited mode by default when uploadLimit is undefined", () => {
      renderComponent();
      expect(screen.getByTestId("dropdown-control")).toHaveAttribute(
        "data-value",
        "unlimited"
      );
    });

    it("renders the DropdownControl in limited mode when uploadLimit has a value", () => {
      mockWatch.mockReturnValue(10);

      renderComponent();
      expect(screen.getByTestId("dropdown-control")).toHaveAttribute(
        "data-value",
        "limited"
      );
    });

    it("renders two Switch components", () => {
      renderComponent();
      const switches = screen.getAllByTestId("switch");
      expect(switches).toHaveLength(2);
    });

    it("renders Switch components with position='right'", () => {
      renderComponent();
      const switches = screen.getAllByTestId("switch");
      switches.forEach(s => expect(s).toHaveAttribute("data-position", "right"));
    });

    it("renders the autoApprovePhotos label", () => {
      renderComponent();
      expect(screen.getByText("fields.autoApprovePhotos")).toBeInTheDocument();
    });

    it("renders the guestCanViewAll label", () => {
      renderComponent();
      expect(screen.getByText("fields.guestCanViewAll")).toBeInTheDocument();
    });
  });

  describe("uploadLimit field registration", () => {
    it("registers the uploadLimit field with valueAsNumber and min validation", () => {
      renderComponent();

      expect(mockRegister).toHaveBeenCalledWith(
        "uploadLimit",
        expect.objectContaining({
          valueAsNumber: true,
          min: expect.objectContaining({ value: 1 }),
        })
      );
    });

    it("renders the number TextField with the correct aria-label", () => {
      renderComponent();

      expect(screen.getByTestId("text-field")).toHaveAttribute("aria-label", "maxImages");
      expect(screen.getByTestId("text-field")).toHaveAttribute("type", "number");
    });
  });

  describe("limitMode toggling", () => {
    it("calls setValue with undefined when switching to unlimited", async () => {
      mockWatch.mockReturnValue(5); // start in limited mode
      renderComponent();

      fireEvent.click(screen.getByTestId("dropdown-toggle"));

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("uploadLimit", undefined);
      });
    });

    it("does call setValue when switching to limited", async () => {
      mockWatch.mockReturnValue(undefined); // start in unlimited mode
      renderComponent();

      fireEvent.click(screen.getByTestId("dropdown-toggle"));

      await waitFor(() => expect(mockSetValue).toHaveBeenCalled());
    });

    it("makes the TextField required when in limited mode", () => {
      mockWatch.mockReturnValue(10);
      renderComponent();

      expect(screen.getByTestId("text-field")).toBeRequired();
    });

    it("makes the TextField not required when in unlimited mode", () => {
      mockWatch.mockReturnValue(undefined);
      renderComponent();

      expect(screen.getByTestId("text-field")).not.toBeRequired();
    });
  });

  describe("error display", () => {
    it("shows a validation error message on the TextField when present", () => {
      mockUseFormState.mockReturnValueOnce({
        errors: { uploadLimit: { message: "This has to be at least 1" } },
      });

      renderComponent();

      expect(screen.getByRole("alert")).toHaveTextContent("This has to be at least 1");
    });

    it("renders no error alert when there are no errors", () => {
      renderComponent();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
