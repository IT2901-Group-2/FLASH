import { Button, Card, TextField, Title } from "@flash/ui";
import styles from "./SignInCard.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/useAuth";
import { useState } from "react";

export default function SignInCard() {
  const navigate = useRouter();
  const t = useTranslations("admin.login.card");
  const c = useTranslations("common");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(t("error.noCredentials"));
      return;
    }
    login(
      { password },
      {
        onSuccess: () => navigate.push("/admin/dashboard"),
        onError: () => setError(t("error.invalidCredentials")),
      }
    );
  };

  return (
    <Card className={styles.card}>
      <Title
        align="left"
        size="medium"
        weight="bold"
        as="h2"
        description={t("description")}
      >
        {t("heading")}
      </Title>
      <form onSubmit={handleSubmit} className={styles.content}>
        <TextField
          className={styles.inputComponent}
          aria-label={c("fields.password")}
          label={c("fields.password")}
          type="password"
          id="passwordField"
          placeholder={c("fields.passwordPlaceholder")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={error}
          onKeyDown={() => setError("")}
        />
        <Button
          className={styles.buttonComponent}
          data-color="brand-purple"
          fill
          disabled={isPending}
          type="submit"
        >
          {c("actions.signIn")}
        </Button>
      </form>
      <span>
        {t("links.guestAccessPrefix")}{" "}
        <Link role="link" href={"/"}>
          {c("roles.guest")}
        </Link>
        .
      </span>
    </Card>
  );
}
