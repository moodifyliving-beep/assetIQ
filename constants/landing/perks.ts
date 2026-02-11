export interface PerkItem {
  title: string;
  description: string;
  icon: string;
}

export const PERKS: PerkItem[] = [
  { title: "Property Sync", description: "Sync listings across platforms instantly.", icon: "/icons/perk-one.svg" },
  { title: "Buy Fractional NFTs", description: "Own shares of premium properties without managing tenants or maintenance", icon: "/icons/perk-two.svg" },
  { title: "Earn Royalties", description: "Receive automated rental income distributed directly to your wallet", icon: "/icons/perk-three.svg" },
  { title: "Sell Anytime", description: "Exit your positions on the open marketplace with complete liquidity", icon: "/icons/perk-four.svg" },
];
