import { TOAST_DISPLAY_TIME } from "@/config";
import { useToast } from "@flash/ui";
import { OctagonAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export const useCustomToast = () => {
  const tErr = useTranslations("guest.event.upload.errors");
  const tSucc = useTranslations("guest.event.upload.success");
  const { createToast } = useToast();

  const uploadErrorToast = useCallback(
    (message: string) =>
      createToast({
        title: tErr("uploadFailedTitle"),
        description: message,
        icon: <OctagonAlert />,
        "data-color": "danger",
        duration: TOAST_DISPLAY_TIME,
      }),
    [createToast, tErr]
  );

  const uploadSuccessToast = useCallback(
    (messageOverride?: string) =>
      createToast({
        title: messageOverride ?? tSucc("title"),
        description: tSucc("message"),
        "data-color": "success",
        duration: TOAST_DISPLAY_TIME,
      }),
    [createToast, tSucc]
  );

  return { uploadErrorToast, uploadSuccessToast };
};
