import { Button, Card, Input, Title } from "ui";
import styles from "./SignInCard.module.css";

export default function SignInCard() {
  return (
    <Card data-color="background-secondary" className={styles.card}>
      <Title
        align="left"
        size="medium"
        weight="bold"
        as="h2"
        data-color="brand-purple"
        description="Enter your credentials to access the admin panel"
      >
        Sign in
      </Title>
      <Input
        className={styles.inputComponent}
        aria-label="password"
        label="Password"
        required
        type="password"
        id="passwordField"
        visualSize="medium"
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
      />
      <Button className={styles.buttonComponent} data-color="brand-purple">
        Sign in
      </Button>
    </Card>
  );
}
