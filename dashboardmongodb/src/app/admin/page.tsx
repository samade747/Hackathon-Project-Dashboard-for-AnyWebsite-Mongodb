import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // redirect to main dashboard
  redirect("/admin/dashboard");
}
