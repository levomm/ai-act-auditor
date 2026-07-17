import { Header } from "./Header";
import { Footer } from "./Footer";
import { useRouter } from "@tanstack/react-router";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { state: { location: { pathname } } } = useRouter();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isLandingPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isLandingPage && <Footer />}
    </div>
  );
}
