import { Text, OrthographicCamera } from "@react-three/drei";
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

  const { camera, pointer, viewport } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const LETTER_SIZE = {
    width: 2,
    height: 1,
    depth: 2,
  };

  const FLOOR_Y = 0;
  const MAX_SPEED = 18;
  const OUT = 1;
  const DRAG_Y = FLOOR_Y + LETTER_SIZE.height / 2;

  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -DRAG_Y),
    [DRAG_Y],
  );

  const point = useMemo(() => new THREE.Vector3(), []);
  const screenPosition = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (!body.current) return;

    if (dragging) {
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(dragPlane, point)) {
        body.current.setNextKinematicTranslation({
          x: point.x,
          y: DRAG_Y,
          z: point.z,
        });
      }
      return;
    }

    const position = body.current.translation();
    screenPosition.set(position.x, position.y, position.z);
    screenPosition.project(camera);

    if (Math.abs(screenPosition.x) > OUT || Math.abs(screenPosition.z) > OUT) {
      resetPosition();
    }
  });
  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const target = event.target as Element;
    target?.setPointerCapture(event.pointerId);
    body.current?.setBodyType(2, true);
    setDragging(true);
  };

  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    // Limit the speed of the letter when released to prevent it from flying off too fast
    const rigidBody = body.current;

    if (rigidBody) {
      rigidBody.setBodyType(0, true);

      const velocity = rigidBody.linvel();

      const speed = Math.sqrt(
        velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2,
      );

      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;

        rigidBody.setLinvel(
          {
            x: velocity.x * scale,
            y: velocity.y * scale,
            z: velocity.z * scale,
          },
          true,
        );
      }
    }

    body.current?.setBodyType(0, true);
    setDragging(false);
    const target = event.target as Element;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  const resetPosition = () => {
    if (!body.current) return;
    body.current.setTranslation({ x: 0, y: 20, z: 0 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    body.current.wakeUp();
  };

  return (
    <RigidBody
      ref={body}
      type="dynamic"
      position={position}
      colliders={false}
      friction={0.8}
      restitution={0.1}
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
        onPointerCancel={endDrag}
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
        <directionalLight
          position={[20, 15, 0]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-camera-near={0.1}
          shadow-camera-far={100}
        />
        <Physics>
          <Letters />
          <Floor />
        </Physics>
      </Canvas>
    </div>
  );
}
