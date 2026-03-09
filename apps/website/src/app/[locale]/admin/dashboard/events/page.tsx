"use client";
import { Plus } from "lucide-react";
import { Button, Loader, Title } from "ui";
import styles from "./page.module.css";
import CreateEventCard from "@/components/EventDialogs/CreateEventDialog";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useEventsQuery } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard/EventCard";
import { useRouter } from "next/navigation";

const Page = () => {
  const t = useTranslations("pages.adminEvents");
  const c = useTranslations("common.actions");
  const navigation = useRouter();

  const { data, isLoading } = useEventsQuery();

  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <CreateEventCard ref={dialogRef} onClose={() => dialogRef.current?.close()} />

      <div className={styles.header}>
        <Title description={t("description")}>{t("title")}</Title>
        <Button
          icon={<Plus />}
          data-color="brand-purple"
          onClick={() => dialogRef.current?.showModal()}
        >
          {c("createNewEvent")}
        </Button>
      </div>
      <Title size="small">{t("title")}</Title>
      <div className={styles.eventsContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer} data-testid="loading-spinner">
            <Loader size="3xlarge" />
          </div>
        ) : (
          data?.map(event => (
            <EventCard
              key={event.id}
              data={event}
              onClick={() => navigation.push(`./events/${event.id}`)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Page;
