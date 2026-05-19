import { useTransition } from "react";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { Button } from "@/components/ui/button";

interface BillingFormButtonProps {
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps & { offer: any }) {
  let [isPending, startTransition] = useTransition();

  const stripeSessionAction = () => {
    startTransition(async () => {
      console.log("Stripe flow este amânat pentru MVP.");
    });
  };

  const userOffer =
    subscriptionPlan.stripePriceId ===
    offer.stripeIds[year ? "yearly" : "monthly"];

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      rounded="full"
      className="w-full"
      onClick={stripeSessionAction}
      disabled={isPending}
    >
      {userOffer ? "Planul tău curent" : "Selectează Plan"}
    </Button>
  );
}