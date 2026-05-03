import type { Metadata } from "next";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Milestone Studio Editor — Create Your Card",
  description:
    "Design your milestone card with custom gradients, fonts, metrics, and platform branding. Export up to 6K PNG instantly.",
  alternates: { canonical: "/editor" },
  robots: { index: false, follow: false }, // editor doesn't need indexing
};

const EditorPage = () => {
  return (
    <div className="w-full min-h-screen">
      <Dashboard />
    </div>
  );
};

export default EditorPage;