import { pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { UserSubscriptionPlan } from "types";

export async function getUserSubscriptionPlan(userId: string): Promise<UserSubscriptionPlan> {
  // Returnăm un plan implicit, simulat, deoarece Stripe este amânat în MVP
  return {
    title: "Free",
    description: "Planul gratuit implicit pentru MVP.",
    benefits: [],
    limitations: [],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
    stripePriceId: "",
    stripeCustomerId: "",
    stripeSubscriptionId: "",
    stripeCurrentPeriodEnd: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 an avans
    isPaid: false,
    interval: "month",
  };
}