import { redirect } from "next/navigation";

export default function ProfileLayout({ children: _children }: { children: React.ReactNode }) {
  redirect("/");
}
