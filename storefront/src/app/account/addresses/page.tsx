import { Metadata } from "next";
import AddressesClient from "./AddressesClient";

export const metadata: Metadata = {
    title: "Address Book | Irin's Fashion",
    description: "Manage your delivery addresses",
};

export default function AddressesPage() {
    return <AddressesClient />;
}
