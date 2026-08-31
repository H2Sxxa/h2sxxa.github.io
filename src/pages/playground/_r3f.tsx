"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, type JSX } from "react";
import type { Mesh } from "three";

function Box(props: JSX.IntrinsicElements["mesh"]) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<Mesh | null>(null);
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    const ref = meshRef.current;
    if (ref) {
      ref.rotation.x += delta;
      ref.rotation.y += delta;
    }
  });
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? "hotpink" : "orange"}
        metalness={0.8}
        roughness={0.5}
      />
    </mesh>
  );
}

export default function Page() {
  return (
    <div className="h-dvh w-dvw">
      <h1 className="absolute top-16 w-dvw text-center font-handwriting text-6xl">
        Rotated Box
      </h1>
      <Canvas>
        <Box />
        <directionalLight position={[0, 0, 2]} />
      </Canvas>
    </div>
  );
}
