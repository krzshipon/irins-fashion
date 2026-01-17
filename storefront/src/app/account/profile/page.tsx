import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
    title: "Edit Profile | Irin's Fashion",
    description: "Update your personal information",
};

export default function ProfilePage() {
    return <ProfileClient />;
}
