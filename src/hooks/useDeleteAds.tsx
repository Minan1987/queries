import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Advertise, PaginatedAdsResponse } from "../interface/models";

interface UpdateAdArgs {
  id: number;
}

const useDeleteAds = () => {
  const client = useQueryClient();

  const mutation = useMutation<
    Advertise, // TData (return type from mutationFn)
    unknown, // TError
    UpdateAdArgs, // TVariables (what mutate(...) receives)
    PaginatedAdsResponse | undefined // TContext (what onMutate returns for rollback)(nullable!)
  >({
    mutationKey: ["Ads"],
    mutationFn: async ({ id }: UpdateAdArgs) => {
      const res = await axios.delete<Advertise>(
        `http://127.0.0.1:8000/ads/advertises/${id}/`
      );
      return res.data;
    },

    // ✅ Optimistic Update (پیش‌نمایش فوری تغییرات در UI)
    onMutate: async ({ id }) => {
      // 1) cancel any ongoing refetches
      await client.cancelQueries({ queryKey: ["Ads"] });

      // 2) snapshot previous data
      const oldData = client.getQueryData<PaginatedAdsResponse>(["Ads"]);

      // 3) perform optimistic update
      if (oldData?.results) {
        const newResults = oldData.results.filter((ad) => ad.id !== id);

        client.setQueryData<PaginatedAdsResponse>(["Ads"], {
          ...oldData,
          results: newResults,
        });
      }

      // 4) return old data for rollback
      return oldData;
    },

    // ✅ Return to previous state
    onError: (_error, _variables, context) => {
      if (context) {
        client.setQueryData(["Ads"], context);
      }
    },

    onSettled: () => {
      client.invalidateQueries({ queryKey: ["Ads"] });
    },

    onSuccess: () => {},
  });
  return mutation;
};

export default useDeleteAds;
