import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { AdsPageParams, PaginatedAdsResponse } from "../interface/models";

function useAdsPaginated({ ads_type = "all", page, search }: AdsPageParams) {
  const query = useQuery<PaginatedAdsResponse>({
    queryKey: ["Ads", { ads_type, page, search }],
    queryFn: async () => {
      let url = `http://127.0.0.1:8000/ads/advertises/paged/?page=${page}`;

      if (ads_type && ads_type !== "all") {
        url += `&ad_type=${ads_type}`;
      }

      // Only add search parameter if search term exists and has 3+ characters
      if (search && search.trim() && search.trim().length >= 3) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await axios.get<PaginatedAdsResponse>(url);
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const data = query.data;
  return {
    data: data?.results || [],
    totalCount: data?.count || 0,
    nextPage: data?.next,
    previousPage: data?.previous,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
  };
}

export default useAdsPaginated;
