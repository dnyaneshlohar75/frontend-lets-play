import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Ground } from "../types/types";
import GroundCard from "./GroundCard";
import { Button } from "@heroui/button";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

type LandingPageCarouselProps = {
  data?: Ground[];
  heading: string;
  cardType?: "shadow" | "normal";
};

export default function LandingPageCarousel({
  heading,
  data,
}: LandingPageCarouselProps) {
  const swiperRef = useRef<any | null>(null);
  return (
    <div>
      <header className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">{heading}</h1>

        <div className="">
          {/* 🔘 Custom Navigation Buttons */}
          <div className="flex gap-2">
            <Button
              startContent = {<IoMdArrowDropleft size={22} className="text-white" />}
              onPress={() => swiperRef.current?.slidePrev()}
              size="sm"
              color="success"
              isIconOnly
              radius="full"
            />
            <Button
              startContent = {<IoMdArrowDropright size={22} className="text-white" />}
              onPress={() => swiperRef.current?.slideNext()}
              size="sm"
              color="success"
              isIconOnly
              radius="full"
            />
          </div>
        </div>
      </header>

      <div className="py-4">
        <Swiper
          slidesPerView={3}
          slidesPerGroup={1}
          spaceBetween={20}
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data &&
            data.map((item, index) => (
              <SwiperSlide key={index}>
                <GroundCard ground={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
