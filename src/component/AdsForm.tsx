import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import useCreateAds from "../hooks/useCreateAds";
import useUpdateAds from "../hooks/useUpdateAds";
import { useEffect } from "react";
import type { Advertise } from "../interface/models";
import useDeleteAds from "../hooks/useDeleteAds";
import { FaRegTrashCan } from "react-icons/fa6";

interface AdsFormProps {
  onClose: () => void;
  editAd?: Advertise | null;
}

const AdsForm = ({ onClose, editAd }: AdsFormProps) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();
  const {
    mutate: create,
    isPending: isCreating,
    // isError: isCreateError,
    // error: createError,
  } = useCreateAds();
  const {
    mutate: update,
    isPending: isUpdating,
    // isError: isUpdateError,
    // error: updateError,
  } = useUpdateAds();

  const { mutate: deleteAd } = useDeleteAds();

  const isEditMode = !!editAd;
  const isPending = isCreating || isUpdating;
  // const isError = isCreateError || isUpdateError;
  // const error = createError || updateError;

  // Pre-fill form when editing
  useEffect(() => {
    if (editAd) {
      setValue("title", editAd.title);
      setValue("description", editAd.description);
      setValue("price", editAd.price);
      setValue("ad_type", editAd.ad_type);
    }
  }, [editAd, setValue]);

  const handleFormSubmit = (data: any) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("ad_type", data.ad_type);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    const onSuccess = () => {
      // Invalidate and refetch ads data
      queryClient.invalidateQueries({ queryKey: ["Ads"] });
      reset();
      onClose();
    };

    const onError = (error: any) => {
      console.error("Error:", error);
    };

    if (isEditMode && editAd) {
      update({ id: editAd.id, data: formData }, { onSuccess, onError });
    } else {
      create(formData, { onSuccess, onError });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          عنوان
        </label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="عنوان آگهی"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          توضیحات
        </label>
        <textarea
          {...register("description", { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="توضیحات آگهی"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          قیمت
        </label>
        <input
          type="number"
          {...register("price", { required: true, min: 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="قیمت"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          نوع آگهی
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="sell"
              {...register("ad_type", { required: true })}
              className="mr-2"
            />
            فروش
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="buy"
              {...register("ad_type", { required: true })}
              className="mr-2"
            />
            خرید
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          تصویر
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between text-center gap-2 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex w-1/2 text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? isEditMode
              ? "در حال بروزرسانی..."
              : "در حال ایجاد..."
            : isEditMode
            ? "بروزرسانی آگهی"
            : "ایجاد آگهی"}
        </button>
        {isEditMode && editAd && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("آیا از حذف این آگهی مطمئن هستید؟")) {
                deleteAd(
                  { id: editAd.id },
                  {
                    onSuccess: () => {
                      onClose();
                    },
                  }
                );
              }
            }}
            className="flex w-1\2 text-center items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            <FaRegTrashCan /> حذف
          </button>
        )}
      </div>
    </form>
  );
};

export default AdsForm;
