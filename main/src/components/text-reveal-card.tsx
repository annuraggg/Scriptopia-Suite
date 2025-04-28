"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      const { left, width: localWidth } =
        cardRef.current.getBoundingClientRect();
      setLeft(left);
      setLocalWidth(localWidth);
    }
  }, []);

  useEffect(() => {
    // Update dimensions on window resize
    const handleResize = () => {
      if (cardRef.current) {
        const { left, width } = cardRef.current.getBoundingClientRect();
        setLeft(left);
        setLocalWidth(width);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function mouseMoveHandler(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();

    const { clientX } = event;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }

  function mouseEnterHandler() {
    setIsMouseOver(true);
  }

  function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
    event.preventDefault();
    const clientX = event.touches[0]!.clientX;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  const rotateDeg = (widthPercentage - 50) * 0.1;

  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
      onTouchMove={touchMoveHandler}
      ref={cardRef}
      className={cn(
        "w-full px-8 py-16 relative overflow-hidden bg-white",
        className
      )}
    >
      {children}

      <div className="h-60 md:h-80 relative flex items-center justify-center overflow-hidden">
        <motion.div
          style={{
            width: "100%",
          }}
          animate={
            isMouseOver
              ? {
                  opacity: widthPercentage > 0 ? 1 : 0,
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
              : {
                  clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                }
          }
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="absolute bg-white z-20 will-change-transform flex justify-center items-center"
        >
          <p
            style={{
              textShadow: "4px 4px 15px rgba(0,0,0,0.1)",
              lineHeight: 1.2,
            }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center max-w-5xl"
          >
            {revealText}
          </p>
        </motion.div>
        <motion.div
          animate={{
            left: `${widthPercentage}%`,
            rotate: `${rotateDeg}deg`,
            opacity: widthPercentage > 0 ? 1 : 0,
          }}
          transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
          className="h-full w-[3px] bg-gradient-to-b from-transparent via-indigo-600 to-transparent absolute z-50 will-change-transform"
        ></motion.div>

        <div className="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)] flex justify-center items-center">
          <p
            className="text-3xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gray-300 text-center max-w-5xl"
            style={{ lineHeight: 1.2 }}
          >
            {text}
          </p>
          <MemoizedStars />
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={twMerge(
        "text-gray-900 text-xl font-semibold text-center",
        className
      )}
    >
      {children}
    </h2>
  );
};

export const TextRevealCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={twMerge("text-gray-600 text-base text-center", className)}>
      {children}
    </p>
  );
};

const Stars = () => {
  const randomMove = () => Math.random() * 4 - 2;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();

  // Updated star colors for light theme
  const starColors = [
    "#6366f1", // indigo-500
    "#8b5cf6", // purple-500
    "#a855f7", // purple-600
    "#4f46e5", // indigo-600
    "#c7d2fe", // indigo-200 (lighter for light theme)
  ];

  return (
    <div className="absolute inset-0">
      {[...Array(80)].map((_, i) => {
        const colorIndex = Math.floor(random() * starColors.length);
        return (
          <motion.span
            key={`star-${i}`}
            animate={{
              top: `calc(${random() * 100}% + ${randomMove()}px)`,
              left: `calc(${random() * 100}% + ${randomMove()}px)`,
              opacity: randomOpacity(),
              scale: [1, 1.2, 0],
            }}
            transition={{
              duration: random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: `${random() * 100}%`,
              left: `${random() * 100}%`,
              width: `2px`,
              height: `2px`,
              backgroundColor: starColors[colorIndex],
              borderRadius: "50%",
              zIndex: 1,
            }}
            className="inline-block"
          ></motion.span>
        );
      })}
    </div>
  );
};

export const MemoizedStars = memo(Stars);
  