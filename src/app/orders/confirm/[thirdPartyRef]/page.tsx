import { use } from "react";
import OrderCallbackPage from "@/features/orders/pages/order_callback_page";

export const metadata = {
  title: "Order Confirmation | CHLPS Canada",
  description: "Verify and confirm your CHLPS enrollment and purchase transaction.",
};

export default function Page({
  params,
}: {
  params: Promise<{ thirdPartyRef: string }>;
}) {
  const { thirdPartyRef } = use(params);
  return <OrderCallbackPage routeRef={thirdPartyRef} />;
}
