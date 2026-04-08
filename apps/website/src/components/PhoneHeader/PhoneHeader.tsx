import type { HTMLAttributes } from "react";
import styles from "./PhoneHeader.module.css";
import { cl } from "@/utils/className";
import { Title } from "@flash/ui";
import { ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";

export interface PhoneHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * The title of the event.
   */
  title: string;
  /**
   * Current loged in user. Will be displayed next to user icon.
   */
  username: string;
  /**
   * The description in the header. This will be hidden on small screens.
   */
  description?: string;
  /**
   * Child elements inside the header
   */
  children?: React.ReactNode;
  /**
   * Path to navigate to when clicking the back button.
   */
  backHref?: string;
}

/**
 * A phone header component that displays a title, optional subtitle, and optional
 * left/right actions suitable for mobile interfaces.
 *
 *  > _Last updated: `2026-03-19`_
 */
export const PhoneHeader = ({
  title,
  description,
  username,
  backHref = "/",
  className,
  children,
  ...rest
}: PhoneHeaderProps) => {
  const navigation = useRouter();

  return (
    <header className={cl(styles.container, className)} {...rest}>
      <div className={styles.infoSection}>
        <ArrowLeft
          className={styles.backButton}
          onClick={() => navigation.push(backHref)}
        />
        <div className={styles.titleBlock}>
          <Title size="small" as="h1">
            {title}
          </Title>
          <span className={styles.user}>
            <User />
            <span className={styles.truncate}>{username}</span>
          </span>
          <span>{description}</span>
        </div>
      </div>
      <span className={styles.childSection}>{children}</span>
    </header>
  );
};

export default PhoneHeader;
