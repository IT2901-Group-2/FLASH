import { Button, Card, Input, Title } from "@flash/ui";
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
        description={t("description")}
      >
        {t("heading")}
      </Title>
      <form onSubmit={handleSubmit}>
        <Input
          className={styles.inputComponent}
          aria-label={c("fields.password")}
          label={c("fields.password")}
          required
          type="password"
          id="passwordField"
          visualSize="medium"
          placeholder={c("fields.passwordPlaceholder")}
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
