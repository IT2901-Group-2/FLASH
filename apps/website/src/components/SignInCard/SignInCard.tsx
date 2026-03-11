import { Button, Card, TextField, Title } from "ui";
import styles from "./SignInCard.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInCard() {
  const navigate = useRouter();
  const t = useTranslations();
  return (
    <Card className={styles.card}>
      <Title
        align="left"
        size="medium"
        weight="bold"
        as="h2"
        description={t("admin.login.card.description")}
      >
        {t("admin.login.card.heading")}
      </Title>
      <TextField
        className={styles.inputComponent}
        aria-label={t("common.fields.password")}
        label={t("common.fields.password")}
        required
        type="password"
        id="passwordField"
        placeholder={t("common.fields.passwordPlaceholder")}
      />
      <Button
        className={styles.buttonComponent}
        data-color="brand-purple"
        fill
        onClick={() => navigate.push("/admin/dashboard")}
      >
        {t("common.actions.signIn")}
      </Button>
      <span>
        {t("admin.login.card.links.guestAccessPrefix")}{" "}
        <Link role="link" href={"/"}>
          {t("common.roles.guest")}
        </Link>
        .
      </span>
    </Card>
  );
}
