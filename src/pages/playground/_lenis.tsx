import { useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Body() {
  const container = useRef(null);
  const heroTitle = useRef(null);
  const box = useRef(null);
  const story = useRef(null);
  const sticky = useRef(null);
  /**
   * Lenis -> ScrollTrigger 同步
   */
  useLenis(() => {
    ScrollTrigger.update();
  });
  /**
   * GSAP
   */
  useGSAP(
    () => {
      // 1. Hero 入场动画
      gsap.from(heroTitle.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
      // 2. 滚动控制 box
      gsap.to(box.current, {
        x: 500,
        rotate: 360,
        opacity: 0,
        scrollTrigger: {
          trigger: box.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      // 3. Pin 滚动叙事
      gsap.to(sticky.current, {
        scale: 2,
        scrollTrigger: {
          trigger: story.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: true,
        },
      });
    },
    {
      scope: container,
    },
  );

  return (
    <main ref={container} className="overflow-x-hidden">
      {/* Hero */}
      <section className="flex h-screen items-center justify-center">
        <h1 ref={heroTitle} className="text-7xl font-bold">
          GSAP + Lenis
        </h1>
      </section>
      {/* Box Animation */}
      <section className="flex h-screen items-center justify-center">
        <div ref={box} className="h-40 w-40 bg-blue-500" />
      </section>
      {/* Scroll Story */}
      <section ref={story} className="h-[300vh]">
        <div ref={sticky} className="flex h-screen items-center justify-center">
          <h2 className="text-6xl font-bold">Scroll Story</h2>
        </div>
      </section>
      {/* End */}
      <section className="flex h-screen items-center justify-center">
        <h2 className="text-5xl">End</h2>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <ReactLenis root>
      <Body />
    </ReactLenis>
  );
}
