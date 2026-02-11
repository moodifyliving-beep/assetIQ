export type PlanFeature = { text: string; included: boolean };

export type Plan = {
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  features: PlanFeature[];
  popular?: boolean;
};

export const PRICING_PLANS: Plan[] = [
  { name: "Starter", description: "Perfect for new investors", price: { monthly: 29, yearly: 290 }, features: [
    { text: "Invest in 5 properties per month", included: true }, { text: "Basic portfolio tracking", included: true }, { text: "NFT ownership verification", included: true }, { text: "Email support", included: true },
    { text: "Real-time yield tracking", included: false }, { text: "Advanced trading tools", included: false }, { text: "Secondary market access", included: false }, { text: "Priority property access", included: false },
  ]},
  { name: "Investor", description: "Ideal for active investors", price: { monthly: 79, yearly: 790 }, popular: true, features: [
    { text: "Unlimited property investments", included: true }, { text: "Advanced portfolio analytics", included: true }, { text: "NFT ownership & trading", included: true }, { text: "Priority support", included: true },
    { text: "Real-time yield tracking", included: true }, { text: "Advanced trading tools", included: true }, { text: "Secondary market access", included: true }, { text: "Priority property access", included: false },
  ]},
  { name: "Premium", description: "For serious portfolio builders", price: { monthly: 199, yearly: 1990 }, features: [
    { text: "Unlimited property investments", included: true }, { text: "Custom portfolio analytics", included: true }, { text: "NFT trading & staking", included: true }, { text: "24/7 dedicated support", included: true },
    { text: "Real-time yield & ROI tracking", included: true }, { text: "Advanced trading & automation", included: true }, { text: "Exclusive secondary market", included: true }, { text: "Priority property access", included: true },
  ]},
];
