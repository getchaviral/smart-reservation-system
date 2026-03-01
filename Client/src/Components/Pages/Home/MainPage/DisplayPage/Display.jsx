import { Link } from "react-router-dom";
import Loader from "../../../../Preloader/loader";
import { Typewriter } from "react-simple-typewriter";

const Display = (props) => {
  const skeletonCards = Array.from({ length: 6 });

  return (
    <>
      {props.isLoading ? <Loader /> : ""}

      <div className="flex-1 rounded-2xl border border-blue-100 bg-white/70 p-3 shadow-sm backdrop-blur-sm md:p-5">
        <div>
          <h1 className="px-1 text-left text-2xl font-bold text-primary md:text-4xl">
            <Typewriter
              words={[
                "Book It, Live It, Love It!",
                "Your Next Adventure Awaits – Reserve Today!",
                "Turning Dreams into Reservations",
                "Reserve, Relax, Rejoice!",
              ]}
              loop={0}
              cursor
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-4 p-2 pt-5 sm:grid-cols-2 xl:grid-cols-3">
          {props.isLoading &&
            skeletonCards.map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="h-40 animate-pulse rounded-xl bg-slate-200"></div>
                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-200"></div>
                <div className="mt-4 h-9 w-full animate-pulse rounded-xl bg-slate-200"></div>
              </div>
            ))}

          {props.Reserves.length > 0 &&
            props.Reserves.map((Reserve) => {
              return (
                <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgb(0,0,0,0.14)]">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-200">
                    <img
                      src={Reserve.photos[0]}
                      alt="photo"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {Reserve.category}
                    </div>
                  </div>
                  <div className="p-4">
                      <h5 className="mb-2 line-clamp-1 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
                        {Reserve.MainTitle}
                      </h5>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600 md:text-base">
                        {Reserve.location}
                      </p>
                      <p className="flex items-center text-sm font-semibold text-slate-700 md:text-base">
                        {Reserve.rating}
                        <img
                          className="h-5 w-5"
                          src="https://img.icons8.com/emoji/48/star-emoji.png"
                          alt="star-emoji"
                        />
                      </p>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                      <p className="text-sm font-medium text-slate-700">
                        <span className="text-2xl font-extrabold text-slate-900">
                          ${Reserve.price}
                        </span>{" "}
                        / {Reserve.category == "accommodation" ? "night" : "table"}
                      </p>
                      <p>
                        <Link
                          to={`/Reserve/${Reserve._id}`}
                          className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          view details
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          {!props.isLoading && props.fetchError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">Could not load reserves</p>
              <p className="mt-1 text-sm text-red-600">{props.fetchError}</p>
            </div>
          )}
          {!props.isLoading && props.Reserves.length === 0 && (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-base font-medium text-gray-700">
              No reserves found. Add a new reserve from your account to see listings.
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 px-2 pb-2">
          <button
            onClick={props.onPrev}
            disabled={props.page <= 1}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm font-medium text-slate-700">
            Page {props.page || 1} of {props.totalPages || 1}
          </span>
          <button
            onClick={props.onNext}
            disabled={props.page >= props.totalPages}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
          >
            Next
          </button>
          <span className="text-sm text-slate-600">
            Total: {props.totalCount || 0}
          </span>
        </div>
      </div>
    </>
  );
};

export default Display;
