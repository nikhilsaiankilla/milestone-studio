export interface TrustMRRStartup {
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  website: string | null;
  country: string | null;
  foundedDate: string | null;
  category: string | null;
  paymentProvider: string;
  targetAudience: string | null;
  revenue: {
    last30Days: number;
    mrr: number;
    total: number;
  };
  customers: number;
  activeSubscriptions: number;
  askingPrice: number | null;
  profitMarginLast30Days: number | null;
  growth30d: number | null;
  growthMRR30d: number | null;
  multiple: number | null;
  rank: number | null;
  visitorsLast30Days: number | null;
  googleSearchImpressionsLast30Days: number | null;
  revenuePerVisitor: number | null;
  onSale: boolean;
  firstListedForSaleAt: string | null;
  xHandle: string | null;
  xFollowerCount: number | null;
  isMerchantOfRecord: boolean;
  techStack: { slug: string; category: string }[];
  cofounders: { xHandle: string; xName: string | null }[];
}

export type TrustMRRCardTemplate =
  | "mrr"
  | "revenue30d"
  | "totalRevenue"
  | "customers"
  | "growth"
  | "visitors"
  | "rank"
  | "forSale";

export interface TrustMRRCardConfig {
  id: TrustMRRCardTemplate;
  label: string;
  description: string;
  available: (data: TrustMRRStartup) => boolean;
}

export const TRUSTMRR_CARD_CONFIGS: TrustMRRCardConfig[] = [
  {
    id: "mrr",
    label: "MRR",
    description: "Monthly recurring revenue",
    available: (d) => d.revenue.mrr > 0,
  },
  {
    id: "revenue30d",
    label: "Last 30 Days",
    description: "Revenue this month + growth",
    available: (d) => d.revenue.last30Days > 0,
  },
  {
    id: "totalRevenue",
    label: "Total Revenue",
    description: "All-time earnings",
    available: (d) => d.revenue.total > 0,
  },
  {
    id: "customers",
    label: "Customers",
    description: "Total customers & subscriptions",
    available: (d) => d.customers > 0,
  },
  {
    id: "growth",
    label: "Growth",
    description: "30-day revenue growth %",
    available: (d) => d.growth30d !== null,
  },
  {
    id: "visitors",
    label: "Visitors",
    description: "Traffic + revenue per visitor",
    available: (d) => (d.visitorsLast30Days ?? 0) > 0,
  },
  {
    id: "rank",
    label: "Rank",
    description: "TrustMRR revenue ranking",
    available: (d) => d.rank !== null,
  },
  {
    id: "forSale",
    label: "For Sale",
    description: "Acquisition card",
    available: (d) => d.onSale && d.askingPrice !== null,
  },
];

// Helpers
export const centsToUSD = (usd: number): string => {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
  return `$${usd.toFixed(0)}`;
};

export const formatPercent = (val: number | null): string => {
  if (val === null) return "N/A";
  return `${val > 0 ? "+" : ""}${val.toFixed(1)}%`;
};

export const formatNumber = (val: number): string => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toString();
};

export interface TrustMRRStyle {
  textColor: string;
  fontFamily: string;
  valueSize: number;
  labelSize: number;
}

export const DEFAULT_TRUSTMRR_STYLE: TrustMRRStyle = {
  textColor: "#ffffff",
  fontFamily: "inherit",
  valueSize: 64,
  labelSize: 12,
};
