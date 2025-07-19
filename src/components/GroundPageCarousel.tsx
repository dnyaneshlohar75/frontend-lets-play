import { useRef } from "react";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function GroundPageCarousel({ data } : {data: string[]}) {
  const swiperRef = useRef<any | null>(null);

  return (
    <Swiper
      slidesPerView={1}
      slidesPerGroup={1}
      modules={[Navigation]}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
    >
      {data?.map((img) => (
        <div className="w-full overflow-hidden rounded-xl">
            <img src={img} className="w-full" />
        </div>
      ))}
    </Swiper>
  );
}
