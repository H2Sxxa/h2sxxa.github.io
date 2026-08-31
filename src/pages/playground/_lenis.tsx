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

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP(
    () => {
      // Hero
      gsap.from(heroTitle.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Box
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

      /**
       * 图片固定
       */
      ScrollTrigger.create({
        trigger: story.current,
        start: "top top",
        end: "bottom bottom",
        pin: sticky.current,
      });

      /**
       * 文字进入动画
       */
      gsap.utils.toArray(".story-text").forEach((item: any) => {
        gsap.from(item, {
          y: 100,
          opacity: 0,
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
            end: "top 40%",
            scrub: true,
          },
        });
      });
    },
    {
      scope: container,
    },
  );

  return (
    <main ref={container} className="mx-auto overflow-x-hidden">
      <section className="relative flex h-screen items-center justify-center">
        <div ref={heroTitle} className="absolute bottom-24 left-24 z-0">
          <h1 className="font-handwriting text-7xl">Lenis</h1>
          <div className="my-4 h-px w-full bg-border" />

          <h2 className="font-serif text-xl italic">
            GSAP / Lenis / React / TypeScript
          </h2>
        </div>
        {/* Decoration */}
        {/* Background Image */}
      </section>

      <section className="flex h-screen items-center justify-center">
        <div ref={box} className="h-40 w-40 bg-primary" />
      </section>

      <section ref={story} className="grid h-[300vh] grid-cols-2">
        <div className="flex flex-col items-center">
          <div className="story-text flex h-screen flex-col items-start justify-center">
            <h2 className="text-5xl font-bold">01</h2>
            <p className="mt-5 text-xl">First Paragraph</p>
          </div>
          <div className="story-text flex h-screen flex-col items-start justify-center">
            <h2 className="text-5xl font-bold">02</h2>
            <p className="mt-5 text-xl">Second Paragraph</p>
          </div>
          <div className="story-text flex h-screen flex-col items-start justify-center">
            <h2 className="text-5xl font-bold">03</h2>
            <p className="mt-5 text-xl">Third Paragraph</p>
          </div>
        </div>

        <div ref={sticky} className="flex h-screen items-center justify-center">
          <img
            src="https://placehold.net/default.png"
            className="w-[70%] rounded-xl"
          />
        </div>
      </section>

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
