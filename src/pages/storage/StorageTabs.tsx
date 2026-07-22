type TabId = "all" | "frozen" | "used";

interface StorageTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  totalCount: number;
  frozenCount: number;
  usedCount: number;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "frozen", label: "Frozen" },
  { id: "used", label: "Used" },
];

export function StorageTabs({ activeTab, onTabChange, totalCount, frozenCount, usedCount }: StorageTabsProps) {
  const counts: Record<TabId, number> = {
    all: totalCount,
    frozen: frozenCount,
    used: usedCount,
  };

  return (
    <div className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          {tab.label} ({counts[tab.id]})
        </button>
      ))}
    </div>
  );
}
