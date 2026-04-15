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

const Page = () => {
  const t = useTranslations("pages.adminEvents");
  const c = useTranslations("common.actions");
  const navigation = useRouter();

  const [searchName, setSearchName] = useState<GetEventsParams["name"]>("");
  const [sortBy, setSortBy] = useState<GetEventsParams["sortBy"]>("name");
  const [sortOrder, setSortOrder] = useState<GetEventsParams["order"]>("descending");

  const { data, isLoading } = useEventsQuery({
    name: searchName,
    sortBy,
    order: sortOrder,
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

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
          label="Search"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <Select
          label="Sort"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as GetEventsParams["sortBy"])}
        >
          <Select.Option value="name" label="Name" />
          <Select.Option value="startDate" label="Start Date" />
          <Select.Option value="endDate" label="End Date" />
          <Select.Option value="createdAt" label="Created At" />
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
              onClick={() => navigation.push(`./dashboard/${event.id}`)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Page;
