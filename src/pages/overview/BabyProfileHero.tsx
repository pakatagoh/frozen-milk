import { useMemo } from "react";
import type { BabyProfile } from "@/lib/baby-profile-fn";
import { BabyAvatarPlaceholder } from "@/pages/overview/BabyAvatarPlaceholder";
import { Pencil } from "lucide-react";

interface BabyProfileHeroProps {
  profile: BabyProfile;
  /** Optional uploaded image URL to replace the placeholder. */
  imageUrl?: string | null;
  onEdit?: () => void;
}

function computeAge(dob: string): string {
  const birth = new Date(dob + "T00:00:00");
  if (Number.isNaN(birth.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (totalDays < 0) return "";

  // Under 4 weeks: show in weeks
  if (totalDays < 28) {
    const weeks = Math.floor(totalDays / 7);
    if (weeks === 0 && totalDays === 0) return "Today";
    if (weeks === 0) return `${totalDays} day${totalDays > 1 ? "s" : ""}`;
    const remainingDays = totalDays - weeks * 7;
    if (remainingDays === 0) return `${weeks} week${weeks > 1 ? "s" : ""}`;
    return `${weeks} week${weeks > 1 ? "s" : ""}, ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
  }

  // Under 12 months: show in months + weeks
  const totalWeeks = Math.floor(totalDays / 7);
  const months = Math.floor(totalDays / 30.4375);
  const remainingWeeks = Math.floor((totalWeeks - months * 4.345) % 4.345);

  if (months < 12) {
    if (remainingWeeks <= 0) return `${months} month${months > 1 ? "s" : ""}`;
    return `${months} month${months > 1 ? "s" : ""}, ${remainingWeeks} week${remainingWeeks > 1 ? "s" : ""}`;
  }

  // 1+ year: show in years + months
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
}

export function BabyProfileHero({ profile, imageUrl, onEdit }: BabyProfileHeroProps) {
  const age = useMemo(() => computeAge(profile.dateOfBirth), [profile.dateOfBirth]);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-muted px-5 py-4">
      {/* Avatar */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={profile.firstName}
            className="h-full w-full object-cover"
          />
        ) : (
          <BabyAvatarPlaceholder
            gender={profile.gender}
            className="h-full w-full"
          />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold text-foreground">{profile.firstName}</p>
        {age && (
          <p className="text-sm text-muted-foreground">{age}</p>
        )}
        {profile.latestWeightKg != null && (
          <p className="text-sm text-muted-foreground">{profile.latestWeightKg} kg</p>
        )}
      </div>

      {/* Edit */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Edit profile"
        >
          <Pencil className="size-4" />
        </button>
      )}
    </div>
  );
}
