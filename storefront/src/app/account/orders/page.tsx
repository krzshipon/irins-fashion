import { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
    title: "My Orders | Irin's Fashion",
    description: "View your order history and status",
};

export default function OrdersPage() {
    return <OrdersClient />;
}
