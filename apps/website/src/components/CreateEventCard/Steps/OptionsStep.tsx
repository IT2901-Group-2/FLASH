import { useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, DropdownControls, Input, Switch } from "ui";
import styles from "./Steps.module.css";

export const OptionsStep = ({ formData, updateFormData }: StepProps) => {
  const [limitMode, setLimitMode] = useState<"limited" | "unlimited">("limited");
  const [autoGenerateCode, setAutoGenerateCode] = useState<boolean>(true);

  return (
    <>
      <Title description="Configure event settings.">Event Settings</Title>
      <DropdownControls
        onChange={setLimitMode}
        options={[
          {
            content: (
              <div className={styles.maxImageContainer}>
                <span>Set max uploads to:</span>
                <Input
                  aria-label="maxImages"
                  type="number"
                  min={0}
                  value={formData.photosPerGuest}
                  onChange={e =>
                    updateFormData(
                      "photosPerGuest",
                      limitMode === "limited" ? e.target.value : 9999
                    )
                  }
                />
              </div>
            ),
            label: "Limited",
            value: "limited",
          },
          {
            label: "Unlimited",
            value: "unlimited",
          },
        ]}
      />
      <Switch position="right">
        <b>Auto-Approve Photos</b>
      </Switch>
      <Switch
        position="right"
        checked={autoGenerateCode}
        onChange={e => setAutoGenerateCode(e.target.checked)}
      >
        <b>Auto Generate Code</b>
      </Switch>
      {!autoGenerateCode && (
        <Input visualSize="small" label="Custom Entry Code" aria-label="manualCode" />
      )}
    </>
  );
};

export default OptionsStep;
