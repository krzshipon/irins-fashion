import { Metadata } from "next";
import OverviewClient from "./OverviewClient";

export const metadata: Metadata = {
    title: "Overview | Irin's Fashion",
    description: "Account overview and recent activity",
};

export default function OverviewPage() {
    return <OverviewClient />;
}
