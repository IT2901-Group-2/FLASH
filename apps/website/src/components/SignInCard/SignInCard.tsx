import { Button, Card, Input, Title } from "ui";
import styles from "./SignInCard.module.css";
import { useTranslations } from "next-intl";

export default function SignInCard() {
  const t = useTranslations("SignInCard");
  return (
    <Card data-color="background-secondary" className={styles.card}>
      <Title
        align="left"
        size="medium"
        weight="bold"
        as="h2"
        data-color="brand-purple"
        description={t("titleDescription")}
      >
        {t("title")}
      </Title>
      <Input
        className={styles.inputComponent}
        aria-label="password"
        label={t("inputLabel")}
        required
        type="password"
        id="passwordField"
        visualSize="medium"
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
      />
      <Button className={styles.buttonComponent} data-color="brand-purple">
        {t("buttonTitle")}
      </Button>
    </Card>
  );
}
