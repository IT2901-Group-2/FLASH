import { Button, Card, Input, Title } from "ui";
import styles from "./SignInCard.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/useAuth";
import { useState } from "react";

export default function SignInCard() {
  const navigate = useRouter();
  const t = useTranslations("admin.login.signIn");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    login({ password }, { onSuccess: () => navigate.push("/admin/dashboard") });
  };

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
      <form onSubmit={handleSubmit}>
        <Input
          className={styles.inputComponent}
          aria-label="password"
          label={t("inputLabel")}
          required
          type="password"
          id="passwordField"
          visualSize="medium"
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          className={styles.buttonComponent}
          data-color="brand-purple"
          fill
          disabled={isPending}
          type="submit"
        >
          {t("buttonTitle")}
        </Button>
      </form>
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
