import { useEffect, useState, useRef } from "react";
import { useLocation } from "../context/LocationContext";
import LandingPageCarousel from "../components/LandingPageCarousel";
import { Link } from "react-router-dom";
import { Ground } from "../types/types";
import { getGroundsNearby } from "../actions/grounds";
import { Button, Chip, Form, Input, Textarea } from "@heroui/react";

import { CiLocationOn } from "react-icons/ci";
import { TiStarFullOutline } from "react-icons/ti";
import { LuFacebook, LuInstagram, LuTwitter } from "react-icons/lu";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { LuArrowRight, LuLogIn } from "react-icons/lu";

const popular_sports = [
  {
    id: 1,
    imageUrl:
      "https://playo-website.gumlet.io/playo-website-v3/popular_sports/badminton_new.png",
    title: "Badminton",
  },
  {
    id: 2,
    imageUrl:
      "https://playo-website.gumlet.io/playo-website-v3/popular_sports/football_new.png",
    title: "Football",
  },
  {
    id: 3,
    imageUrl:
      "https://playo-website.gumlet.io/playo-website-v3/popular_sports/cricket_new.png",
    title: "Cricket",
  },
  {
    id: 4,
    imageUrl:
      "https://playo-website.gumlet.io/playo-website-v3/popular_sports/table_tennis_new.png",
    title: "Table Tennis",
  },
  {
    id: 5,
    imageUrl:
      "https://playo-website.gumlet.io/playo-website-v3/popular_sports/tennis_new.png",
    title: "Tennis",
  },
];

const carouselImages = [
  "/4k-sports-background-alo883jxrlpc363q.jpg",
  // "/badminton-background-8lzg30w79bqm06ff.jpg",
  // "/red-cricket-ball-ground-28edoi8tnky8re0l.jpg",
  // "/basketball-ring-sports-in-4k-7f7w0lhkredv8r1i.jpg",
];

export const LandingPage = () => {
  const { location } = useLocation();
  const [address, setAddress] = useState<null | string>(null);
  const [grounds, setGrounds] = useState<Ground[] | null>(null);

  const swiperRef = useRef<any | null>(null);

  useEffect(() => {
    if (location || address == null) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location?.coords.latitude}&lon=${location?.coords.longitude}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.address.city);
        })
        .catch((err) => {
          console.error("Reverse geocoding error:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (!grounds) {
      (async function () {
        const grounds = await getGroundsNearby(
          location?.coords.latitude as number,
          location?.coords.longitude as number
        );
        setGrounds(grounds);
      })();
    }
  }, [location]);

  return (
    <>
      <Swiper
        slidesPerView={1}
        slidesPerGroup={1}
        modules={[Navigation, Autoplay]}
        loop={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {carouselImages.map((img_url, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-screen overflow-hidden relative">
              <img
                src={img_url}
                alt={`slide-${idx}`}
                className="w-full h-full object-cover"
              />

              <div className="absolute left-16 top-1/2 transform translate-y-10 max-w-xl text-white space-y-4">
                <h1 className="leading-tight">
                  <span className="text-5xl font-bold text-blue-700 pb-2">
                    Unleash Your Game.
                  </span>
                  <br />
                  <span className="text-4xl font-semibold">
                    Book. Play. Dominate.
                  </span>
                </h1>
                <p className="">
                  Whether you're chasing victory or just playing for fun, find
                  your ground, create your match, and make every game
                  unforgettable.
                </p>

                <div className="pt-6">
                  <Link
                    to="/auth/login"
                    className="max-w-fit px-6 py-2 rounded-md text-white bg-blue-700 text-sm flex items-center gap-x-3 hover:bg-blue-800"
                  >
                    <span>Get started</span>
                    <LuArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <section className="w-full px-6 py-3 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden my-10">
            <header className="p-8 bg-blue-700 flex items-center justify-between">
              <h1 className="text-3xl text-white font-semibold">
                Get the Lets Play app for a<br />
                seamless experience!
              </h1>
              <div>
                <button>
                  <img
                    src="https://playo-website.gumlet.io/playo-website-v3/google_play_badge.png"
                    alt=""
                  />
                </button>
                <button>
                  <img
                    src="https://playo-website.gumlet.io/playo-website-v3/apple_store_badge.png"
                    alt=""
                  />
                </button>
              </div>
            </header>
            <div className="p-8 bg-white">
              <h1 className="text-2xl mb-6 text-gray-900 font-semibold">
                Top Sports Complexes in Cities
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="w-full p-4 border rounded-lg">Pune</div>
                <div className="w-full p-4 border rounded-lg">Mumbai</div>
                <div className="w-full p-4 border rounded-lg">Chennai</div>
                <div className="w-full p-4 border rounded-lg">Delhi</div>
                <div className="w-full p-4 border rounded-lg">Surat</div>
              </div>
            </div>
          </div>

          <div className="">
            <header className="text-center mb-10">
              <h1 className="text-3xl font-semibold">Recommended Venues</h1>
            </header>
            <div className="flex gap-x-6 overflow-x-auto scrollbar-hide">
              {grounds && grounds?.length != 0 ? grounds.map(ground => (
                // <LandingPageCarousel heading="Nearby Venues" data={grounds} />
                <Link
                      to={`/grounds/${ground.groundId}`}
                      key={ground.groundId}
                      className="w-[380px] shadow-lg rounded-md flex-shrink-0"
                    >
                      <div className="rounded-lg relative overflow-hidden w-full h-[220px]">
                        <img
                          src={ground.imageUrls[0] || "https://media.hudle.in/venues/b22289cf-9262-4495-8bc7-698354cb0f1b/photo/eadffe99c6421fe17510a328a7b0e1861182a320"}
                          className="w-full h-full object-cover"
                          alt="Ground"
                        />

                        <div className="bg-gradient-to-t from-neutral-900 via-transparent to-transparent absolute top-0 left-0 w-full h-full" />

                        <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                          <h1 className="text-white text-lg font-semibold">
                            {ground.name}
                          </h1>
                          <p className="line-clamp-1 text-xs text-white">
                            {ground.city}, {ground.address}
                          </p>
                        </div>
                      </div>
                    </Link>
              )) : (
                <h1 className="text-red-600 text-center font-bold">
                  No grounds found near to the location
                </h1>
              )}
            </div>
          </div>

          <div>
            <header className="text-center my-10">
              <h1 className="text-3xl font-semibold">Popular Sports</h1>
            </header>
            <div className="flex items-center justify-between gap-x-8">
              {popular_sports?.map((sport) => (
                <Link
                  to={`/ground?sport=${sport.title}`}
                  key={sport.id}
                  className="relative"
                >
                  <img src={sport.imageUrl} />
                  <h1 className="absolute bottom-3 left-4 text-white font-medium">
                    {sport.title}
                  </h1>
                </Link>
              ))}
            </div>
          </div>

          <section className="bg-white py-16 my-10 px-8 rounded-3xl">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  About Let's Play
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Let's Play is your one-stop solution for discovering, booking,
                  and managing sports grounds across the city. Whether you're a
                  casual player, a team organizer, or a sports enthusiast – we
                  make playing sports easy, accessible, and fun.
                </p>
                <p className="text-gray-600 text-sm">
                  Our mission is to bring sports closer to everyone by providing
                  a seamless platform to connect players, book venues, and build
                  a sporting community that thrives on competition and
                  camaraderie.
                </p>
              </div>

              {/* Feedback Section */}
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                  We Value Your Feedback
                </h2>
                <p className="text-gray-600 mb-6">
                  Let us know what you think. Help us improve and serve you
                  better.
                </p>
                <Form className="gap-y-4">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    label = "Your Name"
                    labelPlacement="outside"
                    radius="sm"
                    isRequired
                  />
                  <Input
                    type="email"
                    labelPlacement="outside"
                    label="Email address"
                    radius="sm"
                    placeholder="yourname@company.com"
                    isRequired
                  />
                  <Textarea
                    placeholder="Your feedback..."
                    rows={4}
                    labelPlacement="outside"
                    label="Feedback"
                    radius="sm"
                    isRequired
                  ></Textarea>
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Submit Feedback
                  </Button>
                </Form>
              </div>
            </div>
          </section>

          <footer className="bg-neutral-900 text-white px-6 py-10 mt-20 rounded-3xl">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {/* Logo & About */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Let's Play</h2>
                <p className="text-sm text-gray-400">
                  Book your favorite sports grounds, connect with players, and
                  experience the joy of the game – anytime, anywhere.
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link to="/" className="hover:text-white transition">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/grounds" className="hover:text-white transition">
                      Grounds
                    </Link>
                  </li>
                  <li>
                    <Link to="/matches" className="hover:text-white transition">
                      Matches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/auth/login"
                      className="hover:text-white transition"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact</h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>Email: support@letsplay.com</li>
                  <li>Phone: +91 74993 78600</li>
                  <li>Pune, Maharashtra, India</li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-blue-500 transition">
                    <LuFacebook size={22} />
                  </a>
                  <a href="#" className="hover:text-sky-400 transition">
                    <LuTwitter size={22} />
                  </a>
                  <a href="#" className="hover:text-pink-500 transition">
                    <LuInstagram size={22} />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Let's Play. All rights reserved.
            </div>
          </footer>
        </div>
      </section>
    </>
  );
};
