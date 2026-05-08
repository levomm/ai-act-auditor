import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div>
          <div className="text-sm font-semibold">ActReady</div>
          <p className="mt-2 text-xs text-muted-foreground">
            EU AI Act readiness for teams shipping AI into Europe. Built like a tool, not a deck.
          </p>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">Product</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/product" className="hover:text-foreground text-muted-foreground">How it works</Link></li>
            <li><Link to="/scan" className="hover:text-foreground text-muted-foreground">Free repo scan</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground text-muted-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">Services</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/audit" className="hover:text-foreground text-muted-foreground">DFY audit</Link></li>
            <li><Link to="/timeline" className="hover:text-foreground text-muted-foreground">AI Act timeline</Link></li>
            <li><Link to="/contact" className="hover:text-foreground text-muted-foreground">Talk to us</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">Disclaimer</div>
          <p className="mt-3 text-xs text-muted-foreground">
            ActReady is a readiness and evidence-mapping tool. It does not replace formal legal
            review, conformity assessment, or regulator guidance.
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} ActReady</span>
          <span>Audit-ready. Procurement-proof.</span>
        </div>
      </div>
    </footer>
  );
}
