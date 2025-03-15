export interface NullableString {
  String: string;
  Valid: boolean;
}

export interface NullableInt64 {
  Int64: number;
  Valid: boolean;
}

export interface NullableTime {
  Time: string;
  Valid: boolean;
}

export interface Brand {
  brand: {
    CompanyName: string;
    CreatedAt: NullableTime;
    Email: string;
    ID: number;
    Role: string;
    UserID: NullableInt64;
    Username: string;
    Website: NullableString;
  };
}

export interface Campaign {
  Name: string;
  LandingUrl: string;
  CreatedAt: {
    Time: string;
    Valid: boolean;
  };
  commission_rate: number;
  id: number;
  brand_id: number;
  description: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
}

export interface AffiliateCampaigns {
  AffiliateCampaignCreatedAt: { Time: string; Valid: boolean };
  BrandCreatedAt: { Time: string; Valid: boolean };
  BrandID: { Int64: number; Valid: boolean };
  BrandID_2: number;
  CampaignCreatedAt: { Time: string; Valid: boolean };
  CampaignDescription: { String: string; Valid: boolean };
  CampaignID: number;
  CampaignName: string;
  CommissionRate: string;
  CompanyName: string;
  LandingUrl: string;
  Website: { String: string; Valid: boolean };
}

export interface AffiliateCampaignsResponse {
  campaigns: AffiliateCampaigns[];
}
