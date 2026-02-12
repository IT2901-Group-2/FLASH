"use client";
import { Plus } from "lucide-react";
import { Button, Title } from "ui";
import styles from "./page.module.css";

export const Page = () => {
  return (
    <>
      <div className={styles.header}>
        <Title description="Manage your events.">Event</Title>
        <Button icon={<Plus />} data-color="brand-purple">
          Create New Event
        </Button>
      </div>
    </>
  );
};

export default Page;
