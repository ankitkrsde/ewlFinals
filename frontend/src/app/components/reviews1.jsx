// "use client";

// import { IoIosStar } from "react-icons/io";
// import pfp1 from "../../../public/pfp1.jpg";
// import pfp2 from "../../../public/pfp2.jpg";
// import Image from "next/image";

// import React, { useRef, useState } from "react";

// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";

// // import required modules
// import { Autoplay } from "swiper/modules";

// // pages/index.js
// import { useEffect } from "react";
// import { database } from "./firebase";
// import { ref, get, child } from "firebase/database";

// export default function Reviews() {
//   const [reviewsData, setReviewsData] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       const dbRef = ref(database);
//       try {
//         const snapshot = await get(child(dbRef, "/reviews"));
//         if (snapshot.exists()) {
//           setReviewsData(snapshot.val());
//           console.log(reviewsData);
//         } else {
//           console.log("No data available");
//         }
//       } catch (error) {
//         console.error("Failed to fetch data", error);
//       }
//     }

//     fetchData();
//   }, []);

//   return (
//     <>
//       <div className="w-full px-10 lg:px-24 mt-24 flex flex-col items-center justify-center text-center">
//         <div className="flex flex-col items-center justify-center mb-6 ">
//           <div className="flex items-center gap-4 font-poppins text-lg text-gray-700 font-medium">
//             <span className="h-[2px] w-16 bg-purple-500"></span>
//             <span className="text-lg md:text-xl">
//               Hear What Our Adventurers Have to Say
//             </span>
//             <span className="h-[2px] w-16 bg-purple-500"></span>
//           </div>
//           <h1 className="font-poppins text-7xl font-semibold text-red-500 leading-tight">
//             Traveler Voices
//           </h1>
//         </div>

//         <Swiper
//           slidesPerView={1}
//           spaceBetween={10}
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           breakpoints={{
//             640: {
//               slidesPerView: 1,
//               spaceBetween: 15,
//             },
//             768: {
//               slidesPerView: 1,
//               spaceBetween: 15,
//             },
//             1024: {
//               slidesPerView: 2,
//               spaceBetween: 15,
//             },
//           }}
//           modules={[Autoplay]}
//           className="mySwiper w-full px-10 lg:px-24 mt-12 flex flex-col items-center justify-center text-center"
//         >
//           <SwiperSlide>
//             <div className=" flex flex-col items-start border gap-4 border-gray-300 rounded-xl p-6 bg-slate-50 ">
//               <div className="flex items-start gap-[4px] text-md">
//                 <p>5.0</p>
//                 <span className="flex gap-1">
//                   <IoIosStar size={20} className="text-yellow-500" />
//                   <IoIosStar size={20} className="text-yellow-500" />
//                   <IoIosStar size={20} className="text-yellow-500" />
//                   <IoIosStar size={20} className="text-yellow-500" />
//                   <IoIosStar size={20} className="text-yellow-500" />
//                 </span>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <h3 className="font-semibold text-md text-left">
//                   A Memorable Experience with John Smith
//                 </h3>

//                 <p className="text-left font-light text-[15px]">
//                   "John made our trip to the Grand Canyon unforgettable! His
//                   knowledge of the areas history and geology was impressive, and
//                   he had a great sense of humor. He knew all the best spots for
//                   photos and made sure everyone was having a great time. I
//                   highly recommend John for anyone visiting the Grand Canyon"
//                 </p>
//               </div>
//               <div className="flex">
//                 <div className="flex">
//                   <Image
//                     src={pfp1}
//                     alt="pfp1"
//                     width={50}
//                     height={50}
//                     className="rounded-full border-2 border-red-500 p-[2px]"
//                   />
//                   <Image
//                     src={pfp2}
//                     alt="pfp2"
//                     width={50}
//                     height={50}
//                     className="rounded-full border-2 border-purple-500 p-[2px]  -translate-x-7"
//                   />
//                 </div>
//                 <div className="flex flex-col items-start justify-center">
//                   <p className="font-semibold text-base text-left">
//                     Emma Johnson
//                   </p>
//                   <p className="font-light text-[13px] text-left">
//                     Grand Canyon, Arizona
//                   </p>
//                   <p className="font-light text-[13px] text-left">
//                     April 15, 2024
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         </Swiper>
//       </div>
//     </>
//   );
// }
