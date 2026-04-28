import styles from "./PhoneHeader.module.css";
import { Sidebar, Title } from "@flash/ui";
import { User } from "lucide-react";
import BaseHeader, { BaseHeaderProps } from "./BaseHeader";

export interface PhoneHeaderProps extends BaseHeaderProps {
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
}

export const PhoneHeader = ({
  title,
  description,
  username,
  children,
  ...rest
}: PhoneHeaderProps) => {
  return (
    <BaseHeader {...rest}>
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
      <span className={styles.childSection}>{children}</span>
    </BaseHeader>
  );
};

export default PhoneHeader;
