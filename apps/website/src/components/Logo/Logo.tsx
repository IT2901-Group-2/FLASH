import { useRouter } from "next/navigation";
import styles from "./Logo.module.css";
import { Logo as ApplicationLogo } from "@flash/ui";
import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  animationOnHover?: boolean;
  redirectTo?: string;
}

export default function Logo({
  animationOnHover = false,
  redirectTo,
  ...rest
}: LogoProps) {
  const navigation = useRouter();

  const handleRedirect = () => {
    if (!redirectTo) return;
    navigation.push(redirectTo);
  };

  return (
    <div
      className={styles.logoWrapper}
      onClick={handleRedirect}
      {...rest}
      data-redirect={!!redirectTo}
    >
      <ApplicationLogo animationOnHover={animationOnHover} />
    </div>
  );
}
