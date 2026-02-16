import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Page from "./page";
import { NextIntlClientProvider } from "next-intl";

// Mock translations
const messages = {
  admin: {
    login: {
      title: "PhotoEvent Admin",
      description: "Manage your photo events with ease",
      undertext: "Self-hosted Photo Event Management System",
      signIn: {
        title: "Sign in",
        titleDescription: "Enter your credentials to access the admin panel",
        buttonTitle: "Sign in",
        inputLabel: "Password",
      },
    },
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

afterEach(() => {
  cleanup();
});

describe("AdminLogin Page", () => {
  it("renders all components together", () => {
    const { container } = renderWithIntl(<Page />);
    const pageWrapper = container.querySelector('[class*="pageWrapper"]');

    expect(pageWrapper).not.toBeNull();
    expect(pageWrapper).toBeTruthy();
  });

  it("displays translated content", () => {
    renderWithIntl(<Page />);

    expect(screen.getByText("PhotoEvent Admin")).toBeTruthy();
    expect(screen.getByText("Manage your photo events with ease")).toBeTruthy();
  });

  it("renders all required components", () => {
    const { container } = renderWithIntl(<Page />);

    const cameraIcon = container.querySelector('[class*="cameraWrapper"]');
    expect(cameraIcon).toBeTruthy();
    expect(screen.getByTestId("title")).toBeTruthy();
    const signInCard = container.querySelector('[class*="card"]');
    expect(signInCard).toBeTruthy();
  });

  it("passes correct props to Title component", () => {
    renderWithIntl(<Page />);
    const h1 = screen.getByTestId("title");

    expect(h1.getAttribute("data-color")).toBe("brand-purple");
    expect(h1.getAttribute("data-align")).toBe("center");
    expect(h1.tagName).toBe("H1");
  });
});
