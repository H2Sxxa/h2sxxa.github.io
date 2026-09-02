import { Text, OrthographicCamera, Line } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

function Letter({
  word,
  position,
}: {
  word: string;
  position: [number, number, number];
}) {
  const body = useRef<RapierRigidBody>(null);

  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { camera, pointer } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const LETTER_SIZE = {
    width: 2,
    height: 1,
    depth: 2,
  };

  const FLOOR_Y = 0;

  const DRAG_Y = FLOOR_Y + LETTER_SIZE.height / 2;
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -DRAG_Y),
    [DRAG_Y],
  );

  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!dragging || !body.current) return;

    raycaster.setFromCamera(pointer, camera);

    if (raycaster.ray.intersectPlane(dragPlane, point)) {
      body.current.setNextKinematicTranslation({
        x: point.x,
        y: DRAG_Y,
        z: point.z,
      });
    }
  });

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    body.current?.setBodyType(2, true);
    setDragging(true);
  };

  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    body.current?.setBodyType(0, true);
    setDragging(false);
  };

  return (
    <RigidBody
      ref={body}
      type="dynamic"
      position={position}
      colliders={false}
      friction={0.8}
      restitution={0.2}
      linearDamping={0.8}
      angularDamping={0.2}
    >
      <CuboidCollider
        args={[
          LETTER_SIZE.width / 2,
          LETTER_SIZE.height / 2,
          LETTER_SIZE.depth / 2,
        ]}
      />

      <group
        onPointerDown={startDrag}
        onPointerUp={endDrag}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh castShadow>
          <boxGeometry
            args={[LETTER_SIZE.width, LETTER_SIZE.height, LETTER_SIZE.depth]}
          />

          <meshStandardMaterial
            color={dragging || hovered ? "hotpink" : "grey"}
          />
        </mesh>

        <Text
          position={[0, LETTER_SIZE.height / 2 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1}
          anchorX="center"
          anchorY="middle"
        >
          {word}
        </Text>
      </group>
    </RigidBody>
  );
}

function Floor() {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[0, -1, 0]}
      friction={1}
    >
      <CuboidCollider args={[15, 0.5, 10]} />

      <mesh receiveShadow>
        <boxGeometry args={[300, 1, 200]} />
        <meshStandardMaterial color="#676d7a" roughness={0.9} metalness={0.1} />
      </mesh>
    </RigidBody>
  );
}

function Letters() {
  const letters = [
    { word: "A", position: [-2.5, 5, 0] as [number, number, number] },
    { word: "B", position: [0, 5, 0] as [number, number, number] },
    { word: "C", position: [2.5, 5, 0] as [number, number, number] },
  ];

  return (
    <group position={[0, -4, 0]}>
      {letters.map((letter) => (
        <Letter
          key={letter.word}
          word={letter.word}
          position={letter.position}
        />
      ))}
    </group>
  );
}

function Camera() {
  const ref = useRef<THREE.OrthographicCamera>(null);

  useEffect(() => {
    ref.current?.lookAt(0, 0, 0);
  }, []);

  return (
    <OrthographicCamera
      ref={ref}
      makeDefault
      position={[0, 12, 15]}
      zoom={50}
    />
  );
}

export default function Page() {
  return (
    <div className="h-dvh w-full">
      <Canvas className="border-8" shadows>
        <Camera />
        <ambientLight intensity={1.25} />
        <directionalLight position={[20, 15, 0]} castShadow />

        <Physics gravity={[0, -12, 0]}>
          <Letters />
          <Floor />
        </Physics>
      </Canvas>
    </div>
  );
}
