"use client";
import { Plus } from "lucide-react";
import { Button, Title } from "ui";
import styles from "./page.module.css";
import CreateEventCard from "@/components/CreateEventCard/CreateEventCard";
import { useRef } from "react";

export const Page = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <CreateEventCard ref={dialogRef} onClose={() => dialogRef.current?.close()} />
      <div className={styles.header}>
        <Title description="Manage your events.">Event</Title>
        <Button
          icon={<Plus />}
          data-color="brand-purple"
          onClick={() => dialogRef.current?.showModal()}
        >
          Create New Event
        </Button>
      </div>
    </>
  );
};

export default Page;
