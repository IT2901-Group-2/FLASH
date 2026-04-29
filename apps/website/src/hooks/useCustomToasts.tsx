import { TOAST_DISPLAY_TIME } from "@/config";
import { useToast } from "@flash/ui";
import { OctagonAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export const useCustomToast = () => {
  const t = useTranslations("guest.event.upload.errors");
  const { createToast } = useToast();

  const errorToast = useCallback(
    (message: string) =>
      createToast({
        title: t("uploadFailedTitle"),
        description: message,
        icon: <OctagonAlert />,
        "data-color": "danger",
        duration: TOAST_DISPLAY_TIME,
      }),
    [createToast, t]
  );

  return { errorToast };
};
