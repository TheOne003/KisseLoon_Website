import { redirect } from "next/navigation";

/** Full-screen startup ads are not part of the public website. */
export default function PostOtpAdPage() {
  redirect("/");
}
