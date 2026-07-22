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
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label} ({counts[tab.id]})
        </button>
      ))}
    </div>
  );
}
