import { useEffect, useState } from "react";

const SearchBar = (props) => {
  const [SearchInput, SetSearchInput] = useState("");

  const Search = (e) => {
    SetSearchInput(e.target.value);
  };

  useEffect(() => {
    props.SearchFilter(SearchInput);
  }, [SearchInput]);

  return (
    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <input
        onChange={Search}
        value={SearchInput}
        type="text"
        placeholder="Search stays or restaurants"
        className="h-[30px] w-full rounded-full px-2 text-sm font-medium outline-none placeholder:text-slate-400 md:text-base"
      />
      <button className="rounded-full bg-primary p-2 text-white transition hover:bg-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
