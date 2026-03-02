"use client";

import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Breadcrumb } from "../Breadcrumb";
import { Button } from "../Button";
import { Title } from "../Title";
import styles from "./ModerateHeader.module.css";

export interface ModerateHeaderProps {
  /** Callback invoked when the back arrow is clicked. */
  onBack: () => void;
  /** Whether the page is currently in multi-select mode. */
  selectMode: boolean;
  /** Toggles between Select and Cancel mode. */
  onSelectToggle: () => void;
  /** Selects all images in the active tab. Only relevant when selectMode is true. */
  onSelectAll: () => void;
  /**
   * Breadcrumb items for the mobile bottom bar.
   * Defaults to a home link + "Moderate" current page label.
   */
  breadcrumbItems?: { label: string; href?: string }[];
}

/**
 * A header for the moderator image review page.
 *
 * - **Mobile default**: two rows — title bar (centred heading + ChevronLeft) and
 *   bottom bar (Breadcrumb + "Select" pill).
 * - **Mobile select mode**: same title bar, bottom bar shows "Select All" + "Cancel".
 * - **Desktop**: single row — ArrowLeft + title + action button(s). No breadcrumb.
 *
 * > _Last updated: `2026-03-01`_
 */
export const ModerateHeader = ({
  onBack,
  selectMode,
  onSelectToggle,
  onSelectAll,
  // TODO: Replace the href with the actual event URL once event ID is wired into this component.
  breadcrumbItems = [{ label: "Event", href: "/event" }, { label: "Moderate" }],
}: ModerateHeaderProps) => {
  return (
    <header className={styles.header}>
      {/* ── Desktop layout (hidden on mobile via CSS) ── */}
      <div className={styles.desktopRow}>
        <Button
          variant="tertiary"
          icon={<ArrowLeft />}
          onClick={onBack}
          aria-label="Go back"
        />

        <div className={styles.desktopCenter}>
          <Title
            as="h1"
            size="xlarge"
            weight="bold"
            align="left"
            data-color="brand-purple"
          >
            Moderate
          </Title>

          <div className={styles.desktopActions}>
            {selectMode && (
              <Button
                variant="primary"
                data-color="brand-purple"
                className={styles.desktopButton}
                onClick={onSelectAll}
              >
                Select All
              </Button>
            )}
            <Button
              variant={selectMode ? "secondary" : "primary"}
              data-color="brand-purple"
              className={styles.desktopButton}
              onClick={onSelectToggle}
            >
              {selectMode ? "Cancel" : "Select"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile title bar (hidden on desktop via CSS) ── */}
      <div className={styles.mobileTitleBar}>
        <Button
          className={styles.mobileBackButton}
          variant="tertiary"
          icon={<ChevronLeft />}
          onClick={onBack}
          aria-label="Go back"
        />
        <Title
          as="h1"
          size="xlarge"
          weight="bold"
          align="center"
          data-color="brand-purple"
        >
          Moderate
        </Title>
      </div>

      {/* ── Mobile bottom bar (hidden on desktop via CSS) ── */}
      <div className={styles.mobileBottomBar}>
        {selectMode ? (
          <div className={styles.mobileSelectActions}>
            <Button
              variant="primary"
              size="xsmall"
              data-color="brand-purple"
              className={styles.mobileSelectAllButton}
              onClick={onSelectAll}
            >
              Select All
            </Button>
            <Button
              variant="secondary"
              size="xsmall"
              data-color="brand-purple"
              className={styles.mobileSelectButton}
              onClick={onSelectToggle}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <Breadcrumb items={breadcrumbItems} data-color="brand-purple" />
            <Button
              variant="primary"
              size="xsmall"
              data-color="brand-purple"
              className={styles.mobileSelectButton}
              onClick={onSelectToggle}
            >
              Select
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default ModerateHeader;
