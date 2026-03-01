import React, { useEffect, useState } from "react";

const SidePanel = (props) => {
  const [isOpen, SetisOpen] = useState(true);
  const [Category, SetCategory] = useState("");
  const [Rating, SetRating] = useState({ min: "", max: "" });
  const [Price, SetPrice] = useState("300");

  const clicked = () => SetisOpen((prev) => !prev);

  const handlechangeAcc = () => SetCategory("accommodation");
  const handlechangeRes = () => SetCategory("restaurant");

  useEffect(() => {
    props.Category(Category);
  }, [Category]);

  const handlechangeAll = () => {
    SetCategory("");
    SetRating({ min: "", max: "" });
    SetPrice("300");
    props.All();
  };

  const Rate1 = () => SetRating({ min: "5.0", max: "5.1" });
  const Rate2 = () => SetRating({ min: "4.5", max: "5.0" });
  const Rate3 = () => SetRating({ min: "4.0", max: "4.5" });
  const Rate4 = () => SetRating({ min: "0.0", max: "4.0" });

  useEffect(() => {
    props.FilterRating(Rating.max, Rating.min);
  }, [Rating]);

  const RangeSlider = (e) => SetPrice(e.target.value);

  useEffect(() => {
    props.FilterPrice(Price);
  }, [Price]);

  return (
    <div
      className={`${
        isOpen ? "w-full md:w-72" : "w-full md:w-14"
      } sticky top-2 h-fit rounded-2xl border border-blue-200 bg-gradient-to-b from-secondary to-primary p-3 text-white shadow-xl duration-500`}
    >
      <div className="absolute -right-3 top-6 hidden w-7 md:block">
        <svg
          onClick={clicked}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${
            isOpen ? "rotate-180" : ""
          } cursor-pointer rounded-full  w-7 border-2 font-bolder text-white bg-primary border-primary`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className={`${isOpen ? "flex" : "hidden"} flex-col gap-3`}>
        <div className="py-1 text-left text-lg font-bold tracking-wide">Smart Filters</div>

        <div className="text-left text-xs uppercase tracking-wider text-white/75">All</div>
        <div className="text-left">
          <button
            onClick={handlechangeAll}
            type="button"
            className="rounded-lg border border-white/30 bg-white/95 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-white"
          >
            All Reserves
          </button>
        </div>

        <div className="text-left text-xs uppercase tracking-wider text-white/75">Category</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlechangeAcc}
            type="button"
            className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              Category === "accommodation"
                ? "border-white bg-white text-primary"
                : "border-white/40 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Accomodation
          </button>
          <button
            onClick={handlechangeRes}
            type="button"
            className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              Category === "restaurant"
                ? "border-white bg-white text-primary"
                : "border-white/40 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Restaurant
          </button>
        </div>

        <div className="text-left text-xs uppercase tracking-wider text-white/75">Rating</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={Rate1} type="button" className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-white">5.0*</button>
          <button onClick={Rate2} type="button" className="w-full rounded-lg border border-white/30 bg-white/90 px-2 py-2 text-sm font-semibold text-primary transition hover:bg-white">4.5* - 5.0*</button>
          <button onClick={Rate3} type="button" className="w-full rounded-lg border border-white/30 bg-white/90 px-2 py-2 text-sm font-semibold text-primary transition hover:bg-white">4.0* - 4.5*</button>
          <button onClick={Rate4} type="button" className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-white">{`< `}4.0*</button>
        </div>

        <div className="text-left text-xs uppercase tracking-wider text-white/75">Price</div>
        <div className="rounded-xl border border-white/20 bg-white/10 p-3">
          <input
            value={Price}
            type="range"
            min="0"
            step="1"
            max="300"
            onChange={RangeSlider}
            className="h-2 w-full appearance-none rounded-lg border-transparent accent-golden bg-white/70"
          />
          <h1 className="mt-2 text-sm font-semibold">$0 - ${Price}</h1>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
