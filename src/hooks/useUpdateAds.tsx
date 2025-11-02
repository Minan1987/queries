import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Advertise, PaginatedAdsResponse } from "../interface/models";

interface UpdateAdArgs {
  id: number;
  data: FormData;
}

const useUpdateAds = () => {
  const client = useQueryClient();

  const mutation = useMutation<
    Advertise, // TData (return type from mutationFn)
    unknown, // TError
    UpdateAdArgs, // TVariables (what mutate(...) receives)
    PaginatedAdsResponse | undefined // TContext (what onMutate returns for rollback)(nullable!)
  >({
    mutationKey: ["Ads"],
    mutationFn: async ({ id, data }: UpdateAdArgs) => {
      const res = await axios.put<Advertise>(
        `http://127.0.0.1:8000/ads/advertises/${id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },

    // ✅ Optimistic Update (پیش‌نمایش فوری تغییرات در UI)
    onMutate: async ({ id, data }) => {
      // 1) cancel any ongoing refetches
      await client.cancelQueries({ queryKey: ["Ads"] });

      // 2) snapshot previous data
      const oldData = client.getQueryData<PaginatedAdsResponse>(["Ads"]);

      // 3) perform optimistic update
      if (oldData?.results) {
        // مقادیر متنی رو از FormData می‌خونیم
        const title = data.get("title") as string | null;
        const description = data.get("description") as string | null;
        const ad_type = data.get("ad_type") as "buy" | "sell" | null;
        const priceStr = data.get("price") as string | null;
        const price = priceStr ? Number(priceStr) : undefined;

        const newResults = oldData.results.map((ad) =>
          ad.id === id
            ? {
                ...ad,
                ...(title ? { title } : {}),
                ...(description ? { description } : {}),
                ...(ad_type ? { ad_type } : {}),
                ...(price !== undefined ? { price } : {}),
              }
            : ad
        );

        client.setQueryData<PaginatedAdsResponse>(["Ads"], {
          ...oldData,
          results: newResults,
        });
      }

      // 4) return old data for rollback
      return oldData;
    },

    // ✅ Return to previous state/// ✅ Rollback در صورت خطا
    onError: (_error, _variables, context) => {
      if (context) {
        client.setQueryData(["Ads"], context);
      }
    },

    // ✅ invalidate پس از موفقیت یا خطا
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["Ads"] });
    },

    onSuccess: () => {},
  });
  return mutation;
};

export default useUpdateAds;
