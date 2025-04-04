// Data point interfaces
export interface DataPoint {
  [key: string]: string | number;
}

export interface AgeBreakdown {
  name: string;
  value: number;
}

export interface GeographicData {
  country: string;
  value: number;
}

export interface DeviceStat {
  name: string;
  value: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface CampaignEffectiveness {
  campaign: string;
  roi: number;
  conversionRate: number;
  engagement: number;
}

export interface MetricOverTime {
  date: string;
  value: number;
}

export interface KeyMetrics {
  totalCampaigns: number;
  activeInfluencers: number;
  totalReach: string;
  averageEngagement: string;
  totalRevenue: string;
  roi: string;
}

// Main data interface
export interface AnalyticsData {
  campaignPerformance: DataPoint[];
  audienceBreakdown: AgeBreakdown[];
  geographicDistribution: GeographicData[];
  deviceStats: DeviceStat[];
  revenueData: RevenueData[];
  campaignEffectiveness: CampaignEffectiveness[];
  metricsOverTime: {
    ctr: MetricOverTime[];
    cpc: MetricOverTime[];
    conversionRate: MetricOverTime[];
  };
  keyMetrics: KeyMetrics;
}

// Animation variants
export interface ContainerAnimation {
  hidden: { opacity: number };
  show: {
    opacity: number;
    transition: {
      staggerChildren: number;
      delayChildren: number;
    };
  };
}

// Props interfaces for tab components
export interface TabProps {
  data: AnalyticsData;
  container: ContainerAnimation;
}
