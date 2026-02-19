"use client";

import { useEventsQuery } from "@/hooks/useEvents";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const { data } = useEventsQuery({ id: [id?.toString() || ""] });

  if (data === undefined) return;

  return (
    <div>
      <h1>Event Details</h1>
      {data && data.length > 0 && (
        <div>
          <p>Name: {data[0]?.name}</p>
        </div>
      )}
    </div>
  );
};

export default Page;
