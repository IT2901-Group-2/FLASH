import type { Preview } from "@storybook/react-vite";
import "../src/styles/global.css";
import "../src/docs/styles/docs.css";
import FontDecorator from "./decorators/TypeDecorator";
import { themes } from "storybook/theming";

export const fonts = ["Open Sans"];

export default {
  parameters: {
    layout: "centered",
    options: {
      panelPosition: "right",
      showPanel: true,
      storySort: {
        method: "alphabetical",
        order: [
          "Grunnleggende",
          "Byggeklosser",
          ["Ikoner", "Komponenter", ["Oversikt"]],
          "Mønster og Maler",
        ],
      },
    },
    // backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
      source: {
        dark: true,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  initialGlobals: {
    mode: "default",
    font: "Source Sans 3",
  },
  globalTypes: {
    // language: {
    //   defaultValue: "nb",
    //   toolbar: {
    //     icon: "globe",
    //     title: "Language",
    //     dynamicTitle: true,
    //     items: [
    //       { value: "nb", right: "🇳🇴", title: "Norsk bokmål" },
    //       { value: "en", right: "🇬🇧", title: "English" },
    //     ],
    //   },
    // },
    font: {
      defaultValue: fonts[0],
      toolbar: {
        icon: "edit",
        items: fonts.map(font => ({ value: font, title: font })),
        dynamicTitle: true,
        title: "Font",
      },
    },
  },
  decorators: [
    (Story, context) => (
      <FontDecorator font={context.globals.font}>
        <Story />
      </FontDecorator>
    ),
    (Story, context) => {
      return (
        <div data-theme={context.globals.backgrounds.value}>
          <Story />
        </div>
      );
    },
    (Story, context) => {
      document.documentElement.style.setProperty(
        "--canvas-bg",
        context.globals.backgrounds.value === "dark" ? "#222325" : "#ffffff"
      );
      return <Story />;
    },
  ],
} satisfies Preview;
