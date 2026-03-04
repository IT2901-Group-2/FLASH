import { Button, Card, Input, Title } from "ui";
import styles from "./SignInCard.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInCard() {
  const navigate = useRouter();
  const t = useTranslations("admin.login.signIn");
  return (
    <Card className={styles.card}>
      <Title
        align="left"
        size="medium"
        weight="bold"
        as="h2"
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
      <Button
        className={styles.buttonComponent}
        data-color="brand-purple"
        fill
        onClick={() => navigate.push("/admin/dashboard")}
      >
        {t("buttonTitle")}
      </Button>
      <span>
        {t("linkToGuest")}{" "}
        <Link role="link" href={"/"}>
          {t("guest")}
        </Link>
        .
      </span>
    </Card>
  );
}
