"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  BookOpen01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout, StatCard } from "@/components";
import { useDashboard } from "../domain/data/hooks/dashboard_hooks";
import { useUserMembership } from "../domain/data/hooks/user_membership_hooks";
import ActivityTimeline from "../components/activity_timeline";
import PaidMembershipCard from "../components/paid_membership_card";

const DashboardPage = () => {
  const { analytics, isLoading, activity, activityLoading } = useDashboard();
  const { membership, isLoading: isMembershipLoading } = useUserMembership();

  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Subscribed programs"
            value={analytics.subscribedPrograms ?? 0}
            loading={isLoading}
            icon={
              <HugeiconsIcon icon={File01Icon} size={18} color="currentColor" />
            }
          />
          <StatCard
            title="Total courses"
            value={analytics.totalCourses ?? 0}
            loading={isLoading}
            icon={
              <HugeiconsIcon
                icon={BookOpen01Icon}
                size={18}
                color="currentColor"
              />
            }
          />
          <StatCard
            title="Completed courses"
            value={analytics.completedCourses ?? 0}
            loading={isLoading}
            icon={
              <HugeiconsIcon
                icon={Award01Icon}
                size={18}
                color="currentColor"
              />
            }
          />
        </div>

        {/* Paid Membership Status & Quick Navigation */}
        <PaidMembershipCard
          membership={membership}
          isLoading={isMembershipLoading}
        />

        <ActivityTimeline items={activity} loading={activityLoading} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
