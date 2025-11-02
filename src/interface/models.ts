export type Advertise = {
  id: number;
  ad_type: "sell" | "buy";
  title: string;
  description: string;
  image: string;
  price: number;
};

export type PaginatedAdsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Advertise[];
};

export type AdsPageParams = {
  ads_type?: string;
  page: number;
  search?: string;
};
