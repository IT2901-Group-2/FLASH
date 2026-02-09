"use client";
import JoinEventCard from "@/components/JoinEvent/JoinEventCard";
import Logo from "@/components/Logo/Logo";
import { Card } from "ui";

const Page = () => {

    return (
       <Card data-color="background-secondary">
            <Logo />
            <JoinEventCard />
        </Card>
    )
}

export default Page;