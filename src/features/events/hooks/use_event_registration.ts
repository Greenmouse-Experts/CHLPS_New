"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/store";
import {
  eventRegistrationService,
  type EventRegistrationPaymentResult,
  type EventRegistrationResult,
} from "../services/event_registration_service";
import type { EventRegistration } from "@/types/events";

export function useMyEventRegistrations() {
  const token = useAppSelector((state) => state.user.token);

  return useQuery({
    queryKey: ["my-event-registrations", token],
    queryFn: async () => {
      const res = await eventRegistrationService.getMyEventRegistrations();
      if (res.success && res.data) {
        return res.data;
      }
      return [] as EventRegistration[];
    },
    enabled: Boolean(token),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useEventRegistrationStatus(eventId?: string) {
  const { data: registrations = [], isLoading } = useMyEventRegistrations();

  const registration = eventId
    ? registrations.find(
        (reg) =>
          reg.eventId === eventId ||
          reg.event?.id === eventId ||
          reg.event?.slug === eventId,
      )
    : undefined;

  const isRegistered = Boolean(
    registration && registration.status !== "Cancelled",
  );

  return {
    isRegistered,
    registration,
    isLoading,
  };
}

export function useJoinFreeEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string): Promise<EventRegistrationResult> => {
      const res = await eventRegistrationService.joinFreeEvent(eventId);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to register for event");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-event-registrations"] });
    },
  });
}

export function useRegisterPaidEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      callbackUrl,
    }: {
      eventId: string;
      callbackUrl?: string;
    }): Promise<EventRegistrationPaymentResult> => {
      const res = await eventRegistrationService.registerPaidEvent(
        eventId,
        callbackUrl,
      );
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to initiate payment");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-event-registrations"] });
    },
  });
}
