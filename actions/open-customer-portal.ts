"use server";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

export async function openCustomerPortal(
  userStripeId: string,
): Promise<responseAction> {
  throw new Error("Stripe has been disabled in this project");
}
