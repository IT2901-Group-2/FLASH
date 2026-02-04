"use client";
import { Button, Input, Title } from "ui";

const page = () => {
  return (
    <div>
      <Title align="center" size="medium" as="h1" data-color="neutral">
        PhotoEvent Admin
      </Title>
      <div
        style={{
          margin: "auto",
          border: "1px solid black",
          borderRadius: "1rem",
          width: "50%",
          height: "50%",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Bytt denne diven ut med en card component */}
        <Title align="left" size="small" as="h2" data-color="neutral">
          Sign in
        </Title>
        <Input
          aria-label="password"
          label="Passeword"
          required
          type="password"
          id="passwordField"
        />
        <Button data-color="brand-purple">Sign in</Button>
      </div>
    </div>
  );
};

export default page;
