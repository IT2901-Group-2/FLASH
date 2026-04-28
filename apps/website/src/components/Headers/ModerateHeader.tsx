"use client";

import { ChevronLeft } from "lucide-react";
import { Button, Title } from "@flash/ui";
import { useTranslations } from "next-intl";
import { cl } from "@/utils/className";
import styles from "./ModerateHeader.module.css";
import BaseHeader, { BaseHeaderProps } from "./BaseHeader";

export interface ModerateHeaderProps extends BaseHeaderProps {
  onBack: () => void;
  selectMode: boolean;
  onSelectToggle: () => void;
  onSelectAll: () => void;
  allSelected?: boolean;
}

export const ModerateHeader = ({
  onBack,
  selectMode,
  onSelectToggle,
  onSelectAll,
  allSelected = false,
}: ModerateHeaderProps) => {
  const t = useTranslations("guest.event.moderate");
  const selectAllLabel = allSelected ? t("actions.deselectAll") : t("actions.selectAll");

  return (
    <BaseHeader>
      <div className={styles.leftSection}>
        <Button
          className={styles.backButton}
          variant="tertiary"
          icon={<ChevronLeft aria-hidden="true" />}
          onClick={onBack}
          aria-label={t("aria.goBack")}
        />
        <Title
          as="h1"
          size="large"
          weight="bold"
          className={cl(styles.title, selectMode && styles.titleSelectMode)}
        >
          {t("title")}
        </Title>
      </div>

      <div className={styles.rightSection}>
        {selectMode && (
          <Button
            variant="primary"
            size="medium"
            data-color="brand-purple"
            className={styles.actionButton}
            onClick={onSelectAll}
          >
            {selectAllLabel}
          </Button>
        )}
        <Button
          variant={selectMode ? "secondary" : "primary"}
          size="medium"
          data-color="brand-purple"
          className={styles.actionButton}
          onClick={onSelectToggle}
        >
          {selectMode ? t("actions.cancel") : t("actions.select")}
        </Button>
      </div>
    </BaseHeader>
  );
};

export default ModerateHeader;
