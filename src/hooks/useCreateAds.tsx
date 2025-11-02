import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCreateAds = () => {
  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return axios.post("http://127.0.0.1:8000/ads/advertises/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
  return mutation;
};

export default useCreateAds;
