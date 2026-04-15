import { useLanguage } from "@/hooks/useLanguage";
import styles from "./LanguageSwitch.module.css";

export default function LanguageSwitch() {
  const { locales, currentLocale } = useLanguage();

  if (locales.length > 2)
    throw new Error(
      "LanguageSwitch: This component does not suport more than 2 languages. If more have been added, refactor this component"
    );

  return (
    <span className={styles.switch} lang-index={locales.indexOf(currentLocale)}>
      <div className={styles.backdrop} />
      <div className={styles.label}>
        {locales.map(l => (
          <span key={l}>{l.toUpperCase()}</span>
        ))}
      </div>
    </span>
  );
}
