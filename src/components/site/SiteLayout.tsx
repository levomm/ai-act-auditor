import { useRouter } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isRoot = router.state.location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isRoot && <Header />}
      <main className="flex-1">{children}</main>
      {!isRoot && <Footer />}
    </div>
  );
}
