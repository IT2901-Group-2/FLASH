import no from "./messages/no.json";

type Messages = typeof no;

declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Messages;
}
