import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Package, Plus, BarChart3, Settings } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: React.ReactNode;
  cta?: boolean;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", to: "/", icon: <Home className="size-5" /> },
  { id: "storage", label: "Storage", to: "/storage", icon: <Package className="size-5" /> },
  { id: "add", label: "Add", to: "", icon: <Plus className="size-6" />, cta: true },
  { id: "stats", label: "Stats", to: "/stats", icon: <BarChart3 className="size-5" /> },
  { id: "settings", label: "Settings", to: "/settings", icon: <Settings className="size-5" /> },
];

export default function BottomNav() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  function isActive(to: string) {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80
                 backdrop-blur-lg h-16 [@media(display-mode:standalone)]:h-20
                 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-around px-2 [@media(display-mode:standalone)]:h-20">
        {navItems.map((item) =>
          item.cta ? (
            <button
              key={item.id}
              type="button"
              className="relative -mt-3 flex size-12 items-center justify-center rounded-full
                         bg-primary text-primary-foreground shadow-lg transition-transform
                         active:scale-95"
              aria-label={item.label}
            >
              {item.icon}
            </button>
          ) : (
            <Link
              key={item.id}
              to={item.to}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5
                         py-1 transition-colors ${
                           isActive(item.to)
                             ? "text-primary"
                             : "text-muted-foreground"
                         }`}
              aria-label={item.label}
              aria-current={isActive(item.to) ? "page" : undefined}
            >
              {item.icon}
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
