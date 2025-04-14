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
  Commission_rate: number;
  ID: number;
  Brand_id: number;
  Description: string;
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

export interface ICampaign {
  ID: number;
  BrandID: {
    Int64: number;
    Valid: boolean;
  };
  Name: string;
  Description: {
    String: string;
    Valid: boolean;
  };
  CommissionRate: string;
  LandingUrl: string;
  CreatedAt: {
    Time: string;
    Valid: boolean;
  };
}

export interface Affiliate {
  AffiliateID: number;
  UserID: {
    Int64: number;
    Valid: boolean;
  };
  AffiliateCreatedAt: {
    Time: string;
    Valid: boolean;
  };
  Username: string;
  Email: string;
  Role: string;
  UserCreatedAt: {
    Time: string;
    Valid: boolean;
  };
  AffiliateCampaignCreatedAt: {
    Time: string;
    Valid: boolean;
  };
  ClickCount: number;
  ConversionCount: number;
  TotalConversionAmount: number;
}

export interface AffiliateResponse {
  affiliates: Affiliate[];
}

export interface TrackingLink {
  LinkCode: string;
  CampaignID: {
    Int64: number;
    Valid: boolean;
  };
  AffiliateID: number;
  Username: string;
}

export interface TrackingResponse {
  tracking_code: TrackingLink;
}

export interface ICreateCampaign {
  name: string;
  description: string;
  commission_rate: string;
  landing_url: string;
  brand_id: string;
}

export interface Invite {
  ID: number;
  CampaignID: number;
  UserID: number;
  Status: string;
  InvitedAt: {
    Time: string;
    Valid: boolean;
  };
  RespondedAt: {
    Time: string;
    Valid: boolean;
  };
  CampaignName: string;
  CampaignDescription: {
    String: string;
    Valid: true;
  };
  CommissionRate: string;
  LandingUrl: string;
  CampaignCreatedAt: {
    Time: string;
    Valid: boolean;
  };
  BrandID: number;
  CompanyName: string;
  Website: {
    String: string;
    Valid: boolean;
  };
  BrandCreatedAt: {
    Time: string;
    Valid: boolean;
  };
}
