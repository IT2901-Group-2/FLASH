import { useLanguage } from "@/hooks/useLanguage";
import styles from "./LanguageSwitch.module.css";

export default function LanguageSwitch() {
  const { locales, currentLocale } = useLanguage();

  if (locales.length !== 2)
    throw new Error(`
      LanguageSwitch: Wrong number of locales. This component suports exactly 2 locales. If the number is more or less, refactor this component.
      
      Current number of locales: ${locales.length}`);

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
