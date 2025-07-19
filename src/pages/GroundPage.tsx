import { getGroundsNearby } from "@/actions/grounds";
import { useLocation } from "@/context/LocationContext";
import { Ground } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function GroundPage() {
  const { location } = useLocation();
  const [grounds, setGrounds] = useState<Ground[]>();

  const getGroundsData = async () => {
    const response = await getGroundsNearby(
      location?.coords.latitude as number,
      location?.coords.longitude as number
    );
    if (response) setGrounds(response);
  };

  useEffect(() => {
    getGroundsData();
  }, [location]);

  return (
    <section className="w-full px-6 py-3 bg-white -z-50">
      <div className="max-w-6xl mx-auto flex gap-12">
        <div className="flex gap-6 flex-wrap">
          {grounds && grounds?.length != 0 ? (
            grounds.map((ground) => (
              <Link
                to={`/grounds/${ground.groundId}`}
                key={ground.groundId}
                className="w-[340px] shadow-lg rounded-md flex-shrink-0"
              >
                <div className="rounded-lg relative overflow-hidden w-full h-[220px]">
                  <img
                    src={
                      ground.imageUrls[0] ||
                      "https://media.hudle.in/venues/b22289cf-9262-4495-8bc7-698354cb0f1b/photo/eadffe99c6421fe17510a328a7b0e1861182a320"
                    }
                    className="w-full h-full object-cover"
                    alt="Ground"
                  />

                  <div className="bg-gradient-to-t from-neutral-900 via-transparent to-transparent absolute top-0 left-0 w-full h-full" />

                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                    <h1 className="text-white text-lg font-semibold">
                      {ground.name}
                    </h1>
                    <p className="line-clamp-1 text-xs text-white">
                      {ground.address}, {ground.city}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <h1 className="text-red-600 text-center font-bold">
              No grounds found near to the location
            </h1>
          )}
        </div>
      </div>
    </section>
  );
}
