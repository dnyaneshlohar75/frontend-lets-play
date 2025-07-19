import { Ground } from "../types/types";
import { Link } from "react-router-dom";

export default function GroundCard({ ground }: { ground: Ground }) {
  return (
    <Link to={`/grounds/${ground.groundId}`}>
      <div className="min-w-9/12 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all ease-in-out duration-500"
            src={ground.imageUrls[0]}
            alt={ground.name}
          />
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">
              {ground.name}
            </h3>

            {/* <Tag
              
              icon="pi pi-clock"
              value={`${new Date(ground.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${new Date(ground.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
              severity="success"
              className="text-sm py-1"
              pt={{
                icon: { className: "mr-2 text-sm" },
                // root: { className: 'bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-gray-300' }
              }}
            /> */}
          </div>

          <div className="flex items-center gap-2">
            <i className="pi pi-map-marker"></i>
            <h1>
              <b>
                {ground.address}, {ground.city}
              </b>{" "}
              - {ground.distance} km.
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
            {ground.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
