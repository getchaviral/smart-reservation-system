import React, { useEffect, useState } from "react";
import SidePanel from "./MainPage/SideBar/SidePanel";
import Display from "./MainPage/DisplayPage/Display";
import axios from "axios";
import Header from "../../Header/Header";

const PrimaryPage = () => {
  const [isLoading, SetisLoading] = useState(false);
  const [Reserves, SetReserves] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
  });
  const [fetchError, setFetchError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minRating: "",
    maxRating: "",
    maxPrice: "300",
    search: "",
  });

  useEffect(() => {
    const fetchReserves = async () => {
    SetisLoading(true);
    setFetchError("");
      try {
        const { data } = await axios.get("/reserves", {
          params: {
            page,
            limit: 9,
            category: filters.category || undefined,
            search: filters.search || undefined,
            minRating: filters.minRating || undefined,
            maxRating: filters.maxRating || undefined,
            maxPrice: filters.maxPrice || undefined,
            sortBy: "rating",
            sortOrder: "desc",
          },
        });

        SetReserves(data.items || []);
        setPagination({
          totalPages: data.pagination?.totalPages || 1,
          totalCount: data.pagination?.totalCount || 0,
        });
      } catch (error) {
        console.log(error);
        setFetchError(
          error?.response?.data?.message || "Unable to load listings right now."
        );
      } finally {
      SetisLoading(false);
      }
    };

    fetchReserves();
  }, [page, filters]);

  const FilterCategory = (cat) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, category: cat || "" }));
  };

  const AllReserves = () => {
    setPage(1);
    setFilters({
      category: "",
      minRating: "",
      maxRating: "",
      maxPrice: "300",
      search: "",
    });
  };

  const FilterRating = (max, min) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      minRating: min || "",
      maxRating: max || "",
    }));
  };

  const FilterPrice = (max) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, maxPrice: max || "300" }));
  };

   const SearchFilter = (search)=>{
    setPage(1);
    setFilters((prev) => ({ ...prev, search: search?.trim() || "" }));
  };

  return (
    <>
      <Header SearchFilter={SearchFilter}/>

      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="mx-auto w-full max-w-[1440px] px-3 pb-8 pt-2 md:px-5">
      <div className="mb-4 rounded-2xl border border-blue-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
        <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">
          Explore Stays & Dining
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Curated accommodations and restaurants with live filters, search, and pagination.
        </p>
      </div>
      <div className="flex gap-4">
        <SidePanel
          className="h-screen"
          Category={FilterCategory}
          All={AllReserves}
          FilterRating={FilterRating}
          FilterPrice={FilterPrice}
        />
        <Display
          Reserves={Reserves}
          isLoading={isLoading}
          fetchError={fetchError}
          page={page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
          onNext={() =>
            setPage((prev) => Math.min(pagination.totalPages, prev + 1))
          }
        />
      </div>
      </div>
      </div>
    </>
  );
};

export default PrimaryPage;
