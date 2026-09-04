"use client";

import LeaderProfileModal from "@/features/about/components/leader_profile_modal";
import { leaders } from "@/features/about/data/leadership";

export default function LeaderPreview() {
  return (
    <div className="min-h-screen bg-cream">
      <LeaderProfileModal leader={leaders[0]} onClose={() => {}} />
    </div>
  );
}
