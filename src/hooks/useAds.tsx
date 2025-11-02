import { useQuery } from "@tanstack/react-query";

function useAds(ads_type: string) {
  const { data, isPending } = useQuery({
    queryKey: ["Ads", ads_type],
    queryFn: async function ({ queryKey }) {
      let url = "http://127.0.0.1:8000/ads/advertises/";
      if (queryKey[1] !== "all") {
        url += "?ad_type=" + queryKey[1];
      }
      const data = await fetch(url);
      return data.json();
    },
  });
  return { data, isPending };
}

export default useAds;
