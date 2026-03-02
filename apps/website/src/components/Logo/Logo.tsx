import { useRouter } from "next/navigation";
import styles from "./Logo.module.css";
import { Logo as ApplicationLogo } from "ui";

export default function Logo({ ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const navigation = useRouter();

  return (
    <div
      className={styles.cameraWrapper}
      onClick={() => navigation.push("/admin/dashboard")}
      {...rest}
    >
      <ApplicationLogo animationOnHover />
    </div>
  );
}
