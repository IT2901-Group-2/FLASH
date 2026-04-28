"use client";
import { Plus, SortAsc, SortDesc } from "lucide-react";
import { Button, Loader, Select, TextField, Title } from "@flash/ui";
import styles from "./page.module.css";
import CreateEventCard from "@/components/EventDialogs/CreateEventDialog";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useEventsQuery } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard/EventCard";
import { useRouter } from "next/navigation";
import { GetEventsParams } from "@/db";
import { useLoadMore } from "@/hooks/useLoadMore";

const EVENTS_PAGE_SIZE = 12;

const Page = () => {
  const navigation = useRouter();
  const t = useTranslations("pages.dashboard");
  const c = useTranslations("common.actions");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [searchName, setSearchName] = useState<GetEventsParams["name"]>("");
  const [status, setStatus] = useState<GetEventsParams["status"]>(undefined);
  const [sortBy, setSortBy] = useState<GetEventsParams["sortBy"]>("name");
  const [sortOrder, setSortOrder] = useState<GetEventsParams["order"]>("descending");
  const [archived, setArchived] = useState<GetEventsParams["archived"]>(false);

  const eventsQuery = useEventsQuery({
    name: searchName,
    order: sortOrder,
    sortBy,
    status,
    archived,
    pageSize: EVENTS_PAGE_SIZE,
  });
  const { data, isLoading, hasNextPage, isFetchingNextPage } = eventsQuery;
  const events = data?.pages.flatMap(page => page.items) ?? [];
  const loadMoreRef = useLoadMore(eventsQuery);

  // `archived` is not a status. It's a boolean field for an event
  // This makes it so it can be handled as a status when sorting
  const handleStatus = (status: GetEventsParams["status"] | "archived") => {
    if (status === "archived") {
      setArchived(true);
      return;
    }
    setArchived(false);
    setStatus(prev => (prev === status ? undefined : status));
  };

  return (
    <>
      <CreateEventCard ref={dialogRef} />

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
      <div className={styles.filterContainer}>
        <TextField
          label={t("filter.search.title")}
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <Select
          label={t("filter.status.title")}
          value={status ?? ""}
          onChange={e =>
            handleStatus(e.target.value as GetEventsParams["status"] | "archived")
          }
        >
          <Select.Option value="" label={t("filter.status.options.all")} />
          <Select.Option value="upcoming" label={t("filter.status.options.upcoming")} />
          <Select.Option value="active" label={t("filter.status.options.active")} />
          <Select.Option value="finished" label={t("filter.status.options.finished")} />
          <Select.Option value="archived" label={t("filter.status.options.archived")} />
        </Select>
        <div className={styles.filterSection}>
          <Select
            label={t("filter.sort.title")}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as GetEventsParams["sortBy"])}
          >
            <Select.Option value="name" label={t("filter.sort.options.name")} />
            <Select.Option value="startDate" label={t("filter.sort.options.startDate")} />
            <Select.Option value="endDate" label={t("filter.sort.options.endDate")} />
            <Select.Option value="createdAt" label={t("filter.sort.options.createdAt")} />
          </Select>

          <Button
            variant="icon"
            onClick={() =>
              setSortOrder(prev => (prev === "ascending" ? "descending" : "ascending"))
            }
            icon={sortOrder === "ascending" ? <SortAsc /> : <SortDesc />}
            radius="16"
          />
        </div>
      </div>
      <div className={styles.eventsContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer} data-testid="loading-spinner">
            <Loader size="3xlarge" />
          </div>
        ) : (
          events.map(event => (
            <EventCard
              key={event.id}
              data={event}
              onClick={() => navigation.push(`./dashboard/${event.id}`)}
            />
          ))
        )}
        {hasNextPage ?? <div ref={loadMoreRef} className={styles.loadMoreSentinel} />}
        {isFetchingNextPage ?? (
          <div className={styles.loadingContainer} data-testid="loading-more-spinner">
            <Loader size="large" />
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
