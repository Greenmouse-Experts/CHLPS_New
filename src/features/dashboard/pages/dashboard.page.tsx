"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  BookOpen01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout, StatCard } from "@/components";
import { useDashboard } from "../domain/data/hooks/dashboard_hooks";
import ActivityTimeline from "../components/activity_timeline";

const DashboardPage = () => {
  const { analytics, isLoading, activity, activityLoading } = useDashboard();

  return (
    <DashboardLayout title="My Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Subscribed programs"
          value={analytics.subscribedPrograms ?? 0}
          loading={isLoading}
          icon={<HugeiconsIcon icon={File01Icon} size={18} color="currentColor" />}
        />
        <StatCard
          title="Total courses"
          value={analytics.totalCourses ?? 0}
          loading={isLoading}
          icon={<HugeiconsIcon icon={BookOpen01Icon} size={18} color="currentColor" />}
        />
        <StatCard
          title="Completed courses"
          value={analytics.completedCourses ?? 0}
          loading={isLoading}
          icon={<HugeiconsIcon icon={Award01Icon} size={18} color="currentColor" />}
        />
      </div>

      <ActivityTimeline items={activity} loading={activityLoading} />
    </DashboardLayout>
  );
};

export default DashboardPage;
