"use client";
import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Ensure we always have items to display, even if the images array is empty
  const safeImages = images?.length > 0 ? images : [];
  const third = Math.ceil(safeImages.length / 3);

  const firstPart = safeImages.slice(0, third);
  const secondPart = safeImages.slice(third, 2 * third);
  const thirdPart = safeImages.slice(2 * third);

  return (
    <div
      className={cn("h-[40rem] items-start overflow-y-auto w-full", className)}
      ref={gridRef}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10">
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={`grid-1-${idx}`}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={el}
                className="h-80 w-full object-cover object-center rounded-lg !m-0 !p-0 transition-transform duration-500 hover:scale-105"
                height="400"
                width="400"
                alt="Scriptopia testimonial"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div
              style={{ y: translateSecond }}
              key={`grid-2-${idx}`}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={el}
                className="h-80 w-full object-cover object-center rounded-lg !m-0 !p-0 transition-transform duration-500 hover:scale-105"
                height="400"
                width="400"
                alt="Scriptopia testimonial"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{ y: translateThird }}
              key={`grid-3-${idx}`}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={el}
                className="h-80 w-full object-cover object-center rounded-lg !m-0 !p-0 transition-transform duration-500 hover:scale-105"
                height="400"
                width="400"
                alt="Scriptopia testimonial"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
