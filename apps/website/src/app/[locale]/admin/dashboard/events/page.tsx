"use client";
import { Plus } from "lucide-react";
import { Button, Loader, Title } from "@flash/ui";
import styles from "./page.module.css";
import CreateEventCard from "@/components/EventDialogs/CreateEventDialog";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useEventsQuery } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard/EventCard";
import { useRouter } from "next/navigation";

const EVENTS_PAGE_SIZE = 25;

const Page = () => {
  const t = useTranslations("pages.adminEvents");
  const c = useTranslations("common.actions");
  const navigation = useRouter();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useEventsQuery({ pageSize: EVENTS_PAGE_SIZE });
  const events = data?.pages.flatMap(page => page.items) ?? [];
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (hasNextPage !== true) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry?.isIntersecting || isFetchingNextPage) return;
        void fetchNextPage();
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <CreateEventCard ref={dialogRef} onClose={() => dialogRef.current?.close()} />

      <div className={styles.header}>
        <Title description={t("description")}>{t("title")}</Title>
        <Button
          icon={<Plus />}
          data-color="brand-purple"
          onClick={() => dialogRef.current?.showModal()}
          className={styles.createButton}
        >
          {c("createNewEvent")}
        </Button>
      </div>
      <div className={styles.eventsContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer} data-testid="loading-spinner">
            <Loader size="3xlarge" />
          </div>
        ) : (
          <>
            {events.map(event => (
              <EventCard
                key={event.id}
                data={event}
                onClick={() => navigation.push(`./events/${event.id}`)}
              />
            ))}
            {hasNextPage ? (
              <div ref={loadMoreRef} className={styles.loadMoreSentinel} />
            ) : null}
            {isFetchingNextPage ? (
              <div className={styles.loadingContainer} data-testid="loading-more-spinner">
                <Loader size="large" />
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default Page;
