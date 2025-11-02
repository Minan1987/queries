import AdsList from "./AdsList";
import { useEffect, useState } from "react";
import useAdsPaginated from "../hooks/useAdsPaginated";
import { IoSearchOutline } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import Modal from "./Modal";
import AdsForm from "./AdsForm";
import type { Advertise } from "../interface/models";

const AdsContainer = () => {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAd, setEditAd] = useState<Advertise | null>(null);

  const handleEditAd = (ad: Advertise) => {
    setEditAd(ad);
    setIsModalOpen(true);
  };

  const handleCreateAd = () => {
    setEditAd(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditAd(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only search if 3+ characters or empty (to show all results)
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        setDebouncedSearchTerm(searchTerm);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // const { data } = useAds(filter);
  const { data, totalCount, nextPage, previousPage, isPending } =
    useAdsPaginated({
      ads_type: filter,
      page,
      search: debouncedSearchTerm,
    });

  const pageSize = 6; // Match backend CustomPagination page_size
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isPending) {
    return <div className="text-center py-10">در حال لود...</div>;
  }

  return (
    <section className="container mx-auto p-4 ">
      <div className="mb-6 flex justify-between items-center">
        <div className=" flex gap-2">
          <button
            className={`btn ${
              filter === "all" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
          >
            همه
          </button>
          <button
            className={`btn ${
              filter === "buy" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => {
              setFilter("buy");
              setPage(1);
            }}
          >
            خرید
          </button>
          <button
            className={`btn ${
              filter === "sell" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => {
              setFilter("sell");
              setPage(1);
            }}
          >
            فروش
          </button>
        </div>
        <div className="flex items-center">
          <input
            className="border border-gray-700 rounded-sm p-2 text-gray-500 bo"
            placeholder="جستجو در آگهی ها..."
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button className="btn btn-outline ms-2 text-xl  ">
            <IoSearchOutline />
          </button>
          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <span className="text-yellow-400 text-sm mr-2">
              حداقل ۳ کاراکتر وارد کنید
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center  justify-center mb-6">
        <button className="btn btn-success" onClick={handleCreateAd}>
          <IoAddOutline className="text-2xl" /> ایجاد آگهی
        </button>
      </div>

      <AdsList adsList={data} onEdit={handleEditAd} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 gap-2">
          <button
            className="btn"
            disabled={!previousPage || page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            قبلی
          </button>

          <span className="px-3 py-1 border rounded">
            صفحه {page} از {totalPages || 1}
          </span>

          <button
            className="btn"
            disabled={!nextPage || page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            بعدی
          </button>
        </div>
      )}

      {/* Modal for creating/editing ads */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editAd ? "ویرایش آگهی" : "ایجاد آگهی جدید"}
      >
        <AdsForm onClose={handleCloseModal} editAd={editAd} />
      </Modal>
    </section>
  );
};

export default AdsContainer;
