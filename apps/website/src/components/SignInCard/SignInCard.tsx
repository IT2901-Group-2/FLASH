import { Button, Card, Input, Title } from "ui";
import styles from "./SignInCard.module.css";

const SignInCard = () => {
  return (
    <Card className={styles.card}>
      <Title
        align="left"
        size="medium"
        weight="bold"
        as="h2"
        data-color="neutral"
        description="Enter your credentials to access the admin panel"
      >
        Sign in
      </Title>
      <Input
        aria-label="password"
        label="Passeword"
        required
        type="password"
        id="passwordField"
      />
      <div className={styles.buttonWrapper}>
        <Button className={styles.button} data-color="brand-purple">
          Sign in
        </Button>
      </div>
    </Card>
  );
};

export default SignInCard;
