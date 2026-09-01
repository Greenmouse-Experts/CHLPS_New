"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardRepository from "../../repository/dashboard_repository";
import {
  ActivityItem,
  AnalyticsData,
} from "../response/dashboard_response";

export function useDashboard() {
  const repo = new DashboardRepository();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await repo.getAnalytics();
      if (res.success && res.data) setAnalytics(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      setActivityLoading(true);
      const res = await repo.getActivityTimeline();
      if (res.success && res.data) setActivity(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Failed to load activity");
    } finally {
      setActivityLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchActivity();
  }, [fetchAnalytics, fetchActivity]);

  return {
    isLoading,
    analytics,
    activity,
    activityLoading,
  };
}
