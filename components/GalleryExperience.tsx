"use client";

/* eslint-disable react-hooks/immutability -- R3F camera controls intentionally mutate Three.js objects. */

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls, useTexture } from "@react-three/drei";
import { memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { galleryFrameConfig } from "@/components/galleryConfig";

const moveMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
];

const palette = [
  "#d8b98a",
  "#d0d7d3",
  "#b8c6d6",
  "#d9a978",
  "#c7b6a1",
  "#b6c7a7",
  "#d8cfc0",
];

const CAMERA_HEIGHT = 1.68;
const PLAYER_RADIUS = 0.55;
const MAP_BOUNDS = { minX: -22.3, maxX: 22.3, minZ: -16.4, maxZ: 18.9 };
const canvasGlConfig = { antialias: false, powerPreference: "low-power" as const };
const canvasCameraConfig = { position: [0, CAMERA_HEIGHT, 12] as [number, number, number], fov: 72, near: 0.1, far: 90 };
const ATLAS_URL = "/photography/atlas/gallery-atlas-lod-1024-v2.jpg";
const PHOTO_RENDER_DISTANCE = 15;
const PHOTO_RENDER_DOT = 0.12;
const photoPreviews = [
  "20230225-_DSC7339-编辑.webp",
  "20230513-_DSC2435-编辑.webp",
  "20230623-_DSC5450-编辑.webp",
  "20230709-_DSC6531.webp",
  "20230711-_DSC7213.webp",
  "20230713-_DSC7541.webp",
  "20230718-_DSC8385.webp",
  "20230723-_DSC9675.webp",
  "20230724-_DSC9815.webp",
  "20230728-_DSC1070.webp",
  "20230730-_DSC1504.webp",
  "20230818-_DSC3796-编辑.webp",
  "DSC_2667.webp",
].map((fileName, index) => ({
  id: index + 1,
  modalSrc: `/photography/modal/photo-${String(index + 1).padStart(2, "0")}.webp`,
  previewSrc: `/photography/previews/${encodeURIComponent(fileName)}`,
  fullSrc: `/photography/thumbs/${encodeURIComponent(fileName)}`,
  title: `作品${index + 1}`,
}));
const atlasItems = [
  { id: 1, aspect: 0.737394, u0: 0.040039, u1: 0.209961, v0: 0.759766, v1: 0.990234 },
  { id: 2, aspect: 1.531859, u0: 0.259766, u1: 0.490234, v0: 0.799805, v1: 0.950195 },
  { id: 3, aspect: 0.667553, u0: 0.547852, u1: 0.702148, v0: 0.759766, v1: 0.990234 },
  { id: 4, aspect: 0.667553, u0: 0.797852, u1: 0.952148, v0: 0.759766, v1: 0.990234 },
  { id: 5, aspect: 1.741625, u0: 0.009766, u1: 0.240234, v0: 0.558594, v1: 0.691406 },
  { id: 6, aspect: 1.551832, u0: 0.259766, u1: 0.490234, v0: 0.550781, v1: 0.699219 },
  { id: 7, aspect: 0.629482, u0: 0.551758, u1: 0.697266, v0: 0.509766, v1: 0.740234 },
  { id: 8, aspect: 1.498008, u0: 0.759766, u1: 0.990234, v0: 0.547852, v1: 0.702148 },
  { id: 9, aspect: 1.591941, u0: 0.009766, u1: 0.240234, v0: 0.302734, v1: 0.447266 },
  { id: 10, aspect: 1, u0: 0.259766, u1: 0.490234, v0: 0.259766, v1: 0.490234 },
  { id: 11, aspect: 0.687554, u0: 0.545898, u1: 0.704102, v0: 0.259766, v1: 0.490234 },
  { id: 12, aspect: 1.497961, u0: 0.759766, u1: 0.990234, v0: 0.297852, v1: 0.452148 },
  { id: 13, aspect: 1.498008, u0: 0.009766, u1: 0.240234, v0: 0.047852, v1: 0.202148 },
];

type FrameData = {
  id: number;
  title: string;
  color: string;
  imageId?: number;
  kind?: "photo" | "object";
  position: [number, number, number];
  rotation: [number, number, number];
  size?: [number, number];
};
type CameraPose = {
  x: number;
  z: number;
  rotation: number;
};

type BoxSpec = {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
};
type ZoneLabel = {
  label: string;
  position: [number, number, number];
};
type FloorPatchSpec = {
  id: string;
  color: string;
  opacity: number;
  position: [number, number];
  scale: [number, number];
  rotation?: number;
};
type GalleryCanvasProps = {
  dragMovedRef: MutableRefObject<boolean>;
  selectedFrameId: number | null;
  selectFrame: (frame: FrameData) => void;
  setWebglLost: (lost: boolean) => void;
  reportPose: (pose: CameraPose) => void;
};

function ContextLossMonitor({ setWebglLost }: { setWebglLost: (lost: boolean) => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setWebglLost(true);
    };
    const onContextRestored = () => setWebglLost(false);

    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", onContextLost, false);
      canvas.removeEventListener("webglcontextrestored", onContextRestored, false);
    };
  }, [gl, setWebglLost]);

  return null;
}

const frames: FrameData[] = galleryFrameConfig.map((frameData) =>
  frame(
    frameData.id,
    frameData.position,
    frameData.rotation,
    frameData.size,
    frameData.kind ?? "photo",
    frameData.imageId,
  ),
);

const wallBoxes: BoxSpec[] = [
  box("north-wall", [0, 1.75, -16], [44.5, 3.5, 0.55]),
  box("south-wall-left", [-12.4, 1.75, 17], [19.2, 3.5, 0.55]),
  box("south-wall-right", [12.4, 1.75, 17], [19.2, 3.5, 0.55]),
  box("west-wall", [-22, 1.75, 0.5], [0.55, 3.5, 32.5]),
  box("east-wall", [22, 1.75, 0.5], [0.55, 3.5, 32.5]),
  box("left-top-divider", [-10, 1.75, -12.2], [0.45, 3.5, 7.6]),
  box("left-mid-divider", [-10, 1.75, 0], [0.45, 3.5, 7.2]),
  box("left-bottom-divider", [-10, 1.75, 12.7], [0.45, 3.5, 8.0]),
  box("bc-divider", [-16, 1.75, 0], [12, 3.5, 0.45]),
  box("right-top-divider", [8, 1.75, -12.6], [0.45, 3.5, 6.8]),
  box("right-bottom-divider", [8, 1.75, 12.7], [0.45, 3.5, 8.0]),
];

const panelBoxes: BoxSpec[] = [
  box("panel-a-left", [-5.4, 1.6, 0.3], [0.4, 3.2, 10.4], "#e9e4d9"),
  box("panel-a-right", [5.4, 1.6, 0.3], [0.4, 3.2, 10.4], "#e9e4d9"),
  box("plinth-11", [0, 0.45, -1], [3.4, 0.9, 0.8], "#cdbda8"),
  box("plinth-12", [0, 0.45, 7], [3.4, 0.9, 0.8], "#cdbda8"),
];

const collisionBoxes = [...wallBoxes, ...panelBoxes];

const zoneLabels: ZoneLabel[] = [
  { label: "A", position: [0, 0.06, 3.2] },
  { label: "B", position: [-16, 0.06, -8.2] },
  { label: "C", position: [-16, 0.06, 8.6] },
  { label: "D", position: [15.2, 0.06, 2.2] },
  { label: "IN", position: [0, 0.06, 18.6] },
];

const floorLightPatches: FloorPatchSpec[] = [
  { id: "light-a-north", color: "#d6d0c5", opacity: 0.16, position: [0, -8.6], scale: [7.8, 3.0], rotation: 0.08 },
  { id: "light-a-center", color: "#bbb7ae", opacity: 0.11, position: [1.4, 2.8], scale: [5.4, 7.8], rotation: -0.22 },
  { id: "light-d-wall", color: "#c7c0b3", opacity: 0.13, position: [15.5, -3.2], scale: [6.2, 8.8], rotation: 0.28 },
  { id: "light-bc-left", color: "#aaa69d", opacity: 0.1, position: [-16.8, 1.6], scale: [4.6, 13.2], rotation: -0.08 },
];

const floorShadowPatches: FloorPatchSpec[] = [
  { id: "shadow-entry", color: "#1b1c1d", opacity: 0.24, position: [0, 15.0], scale: [9.5, 2.8], rotation: 0 },
  { id: "shadow-left-panel", color: "#202123", opacity: 0.22, position: [-6.2, 2.6], scale: [2.4, 11.8], rotation: -0.04 },
  { id: "shadow-right-panel", color: "#202123", opacity: 0.22, position: [6.2, 2.6], scale: [2.4, 11.8], rotation: 0.04 },
  { id: "shadow-b-corner", color: "#171819", opacity: 0.2, position: [-17.7, -11.5], scale: [6.2, 4.2], rotation: 0.12 },
  { id: "shadow-d-corner", color: "#171819", opacity: 0.18, position: [18.2, 11.8], scale: [6.6, 4.6], rotation: -0.18 },
];

function frame(
  id: number,
  position: [number, number, number],
  rotation: [number, number, number],
  size: [number, number] = [2.5, 1.75],
  kind: "photo" | "object" = "photo",
  imageId: number | null = id,
): FrameData {
  return {
    id,
    title: `作品${id}`,
    color: palette[(id - 1) % palette.length],
    imageId: imageId ?? undefined,
    kind,
    position,
    rotation,
    size,
  };
}

function box(id: string, position: [number, number, number], size: [number, number, number], color?: string): BoxSpec {
  return { id, position, size, color };
}

function collidesWithBox(position: THREE.Vector3, boxSpec: BoxSpec) {
  const halfX = boxSpec.size[0] / 2 + PLAYER_RADIUS;
  const halfZ = boxSpec.size[2] / 2 + PLAYER_RADIUS;

  return Math.abs(position.x - boxSpec.position[0]) < halfX && Math.abs(position.z - boxSpec.position[2]) < halfZ;
}

function isWalkable(position: THREE.Vector3) {
  const insideOuterBounds = position.x > -21.25 && position.x < 21.25 && position.z > -15.25 && position.z < 16.25;
  const entranceVestibule = Math.abs(position.x) < 2.8 && position.z > 16.0 && position.z < 18.9;

  if (!insideOuterBounds && !entranceVestibule) return false;

  return !collisionBoxes.some((boxSpec) => collidesWithBox(position, boxSpec));
}

function PlayerController() {
  const [, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const { camera } = state;
    const pressed = getKeys();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();

    const speed = 6.5 * delta;
    const nextPosition = camera.position.clone();
    if (pressed.forward) nextPosition.addScaledVector(forward, speed);
    if (pressed.backward) nextPosition.addScaledVector(forward, -speed);
    if (pressed.left) nextPosition.addScaledVector(right, -speed);
    if (pressed.right) nextPosition.addScaledVector(right, speed);

    const nextX = new THREE.Vector3(nextPosition.x, CAMERA_HEIGHT, camera.position.z);
    const nextZ = new THREE.Vector3(camera.position.x, CAMERA_HEIGHT, nextPosition.z);

    if (isWalkable(nextX)) camera.position.x = nextX.x;
    if (isWalkable(nextZ)) camera.position.z = nextZ.z;
    camera.position.y = CAMERA_HEIGHT;
  });

  return null;
}

function DragLookControls({ dragMovedRef }: { dragMovedRef: MutableRefObject<boolean> }) {
  const { camera, gl } = useThree();
  const dragState = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    pitch: 0,
    totalMove: 0,
    yaw: 0,
  });

  useEffect(() => {
    const canvas = gl.domElement;
    camera.rotation.order = "YXZ";

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragState.current.active = true;
      dragState.current.lastX = event.clientX;
      dragState.current.lastY = event.clientY;
      dragState.current.pitch = camera.rotation.x;
      dragState.current.totalMove = 0;
      dragState.current.yaw = camera.rotation.y;
      dragMovedRef.current = false;
      canvas.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragState.current.active) return;

      const deltaX = event.clientX - dragState.current.lastX;
      const deltaY = event.clientY - dragState.current.lastY;
      dragState.current.lastX = event.clientX;
      dragState.current.lastY = event.clientY;
      dragState.current.totalMove += Math.abs(deltaX) + Math.abs(deltaY);

      if (dragState.current.totalMove > 5) dragMovedRef.current = true;

      dragState.current.yaw -= deltaX * 0.004;
      dragState.current.pitch -= deltaY * 0.004;
      dragState.current.pitch = THREE.MathUtils.clamp(
        dragState.current.pitch,
        -Math.PI / 2 + 0.08,
        Math.PI / 2 - 0.08,
      );
      camera.rotation.set(dragState.current.pitch, dragState.current.yaw, 0, "YXZ");
    };

    const onPointerUp = (event: PointerEvent) => {
      dragState.current.active = false;
      canvas.releasePointerCapture?.(event.pointerId);
      window.setTimeout(() => {
        dragMovedRef.current = false;
      }, 120);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [camera, dragMovedRef, gl]);

  return null;
}

function CameraPoseReporter({ reportPose }: { reportPose: (pose: CameraPose) => void }) {
  const lastReport = useRef(0);

  useFrame(({ camera, clock }) => {
    if (clock.elapsedTime - lastReport.current < 0.08) return;
    lastReport.current = clock.elapsedTime;
    reportPose({
      x: camera.position.x,
      z: camera.position.z,
      rotation: camera.rotation.y,
    });
  });

  return null;
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 36]} />
        <meshStandardMaterial color="#5d6061" roughness={0.9} metalness={0.04} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 32.8]} />
        <meshBasicMaterial color="#8a8d8c" transparent opacity={0.08} />
      </mesh>
      <FloorMoodLayer />
      <mesh position={[0, 3.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 36]} />
        <meshStandardMaterial color="#8a857b" roughness={0.9} />
      </mesh>
      {[...wallBoxes, ...panelBoxes].map((wall) => (
        <WallBox key={wall.id} wall={wall} />
      ))}
      <mesh position={[0, 0.02, 17.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.9, 2.1]} />
        <meshBasicMaterial color="#9b9c98" transparent opacity={0.42} />
      </mesh>
      <gridHelper args={[44, 22, "#3c3f40", "#6d7070"]} position={[0, 0.03, 0]} />
      {zoneLabels.map((zone) => (
        <ZoneMarker key={zone.label} zone={zone} />
      ))}
    </group>
  );
}

function FloorMoodLayer() {
  return (
    <group>
      {floorLightPatches.map((patch) => (
        <FloorPatch key={patch.id} patch={patch} y={0.018} blending={THREE.AdditiveBlending} />
      ))}
      {floorShadowPatches.map((patch) => (
        <FloorPatch key={patch.id} patch={patch} y={0.021} />
      ))}
    </group>
  );
}

function FloorPatch({
  blending,
  patch,
  y,
}: {
  blending?: THREE.Blending;
  patch: FloorPatchSpec;
  y: number;
}) {
  return (
    <mesh
      position={[patch.position[0], y, patch.position[1]]}
      renderOrder={1}
      rotation={[-Math.PI / 2, 0, patch.rotation ?? 0]}
      scale={[patch.scale[0], patch.scale[1], 1]}
    >
      <circleGeometry args={[1, 72]} />
      <meshBasicMaterial
        blending={blending}
        color={patch.color}
        depthWrite={false}
        toneMapped={false}
        transparent
        opacity={patch.opacity}
      />
    </mesh>
  );
}

function ZoneMarker({ zone }: { zone: ZoneLabel }) {
  return (
    <mesh position={zone.position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 0.75, 32]} />
      <meshBasicMaterial color="#2f2a22" transparent opacity={0.45} />
    </mesh>
  );
}

function WallBox({ wall }: { wall: BoxSpec }) {
  const isStructureWall = !wall.color;

  return (
    <mesh position={wall.position}>
      <boxGeometry args={wall.size} />
      <meshStandardMaterial
        color={wall.color ?? "#777b7b"}
        emissive={isStructureWall ? "#242728" : "#000000"}
        emissiveIntensity={isStructureWall ? 0.1 : 0}
        metalness={0.02}
        roughness={0.78}
      />
    </mesh>
  );
}

function TargetedSpotlight({
  angle,
  color,
  distance,
  intensity,
  penumbra,
  position,
  target,
}: {
  angle: number;
  color: string;
  distance: number;
  intensity: number;
  penumbra: number;
  position: [number, number, number];
  target: [number, number, number];
}) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!lightRef.current || !targetRef.current) return;
    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <group ref={targetRef} position={target} />
      <spotLight
        ref={lightRef}
        angle={angle}
        color={color}
        decay={1.6}
        distance={distance}
        intensity={intensity}
        penumbra={penumbra}
        position={position}
      />
    </>
  );
}

function FrameSpotlight({ hasImage }: { hasImage: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!lightRef.current || !targetRef.current) return;
    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <group ref={targetRef} position={[0, 0, 0.04]} />
      <spotLight
        ref={lightRef}
        angle={0.42}
        color="#f3eee2"
        decay={2}
        distance={4.2}
        intensity={hasImage ? 0.44 : 0.28}
        penumbra={0.82}
        position={[0, 0.28, 2.2]}
      />
    </>
  );
}

function PhotoFrame({
  atlasTexture,
  dragMovedRef,
  frame,
  selectedFrameId,
  selectFrame,
}: {
  atlasTexture: THREE.Texture;
  dragMovedRef: MutableRefObject<boolean>;
  frame: FrameData;
  selectedFrameId: number | null;
  selectFrame: (frame: FrameData) => void;
}) {
  if (frame.kind === "object") {
    return (
      <group position={frame.position} rotation={frame.rotation}>
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[1.45, 0.34, 1.45]} />
          <meshStandardMaterial color="#f0ede6" roughness={0.58} metalness={0.05} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.48, 32, 18]} />
          <meshStandardMaterial color={frame.color} roughness={0.42} metalness={0.24} />
        </mesh>
      </group>
    );
  }

  const maxSize = frame.size ?? [2.5, 1.75];
  const imageId = frame.imageId ?? null;
  const atlasItem = imageId ? atlasItems[(imageId - 1) % atlasItems.length] : null;
  const aspect = atlasItem?.aspect ?? maxSize[0] / maxSize[1];
  const [width, height] = fitInsideAspect(maxSize, aspect);

  return (
    <group position={frame.position} rotation={frame.rotation}>
      <FrameSpotlight hasImage={Boolean(atlasItem)} />
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[width + 0.34, height + 0.34, 0.16]} />
        <meshStandardMaterial color="#3a332b" roughness={0.48} metalness={0.18} />
      </mesh>
      {atlasItem ? (
        <AtlasPhotoPlane
          dragMovedRef={dragMovedRef}
          frame={frame}
          forceVisible={selectedFrameId === frame.id}
          item={atlasItem}
          selectFrame={selectFrame}
          texture={atlasTexture}
          width={width}
          height={height}
        />
      ) : (
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#efe7da" />
        </mesh>
      )}
      <mesh position={[0, -height / 2 - 0.26, 0.07]}>
        <planeGeometry args={[0.58, 0.12]} />
        <meshBasicMaterial color="#11100c" />
      </mesh>
    </group>
  );
}

function fitInsideAspect([maxWidth, maxHeight]: [number, number], aspect: number): [number, number] {
  const maxAspect = maxWidth / maxHeight;

  if (aspect > maxAspect) return [maxWidth, maxWidth / aspect];

  return [maxHeight * aspect, maxHeight];
}

function AtlasPhotoPlane({
  dragMovedRef,
  forceVisible,
  frame,
  height,
  item,
  selectFrame,
  texture,
  width,
}: {
  dragMovedRef: MutableRefObject<boolean>;
  forceVisible: boolean;
  frame: FrameData;
  height: number;
  item: (typeof atlasItems)[number];
  selectFrame: (frame: FrameData) => void;
  texture: THREE.Texture;
  width: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const photoGeometry = new THREE.PlaneGeometry(width, height);

    photoGeometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(
        [
          item.u0,
          item.v1,
          item.u1,
          item.v1,
          item.u0,
          item.v0,
          item.u1,
          item.v0,
        ],
        2,
      ),
    );

    return photoGeometry;
  }, [height, item.u0, item.u1, item.v0, item.v1, width]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      if (dragMovedRef.current) return;
      if (!frame.imageId) return;
      selectFrame(frame);
    },
    [dragMovedRef, frame, selectFrame],
  );

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    const framePosition = new THREE.Vector3(...frame.position);
    const toFrame = framePosition.sub(camera.position);
    const distance = toFrame.length();
    const cameraForward = new THREE.Vector3();
    camera.getWorldDirection(cameraForward);
    const viewDot = cameraForward.dot(toFrame.normalize());

    meshRef.current.visible =
      forceVisible || (distance <= PHOTO_RENDER_DISTANCE && viewDot >= PHOTO_RENDER_DOT);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} onClick={handleClick} position={[0, 0, 0.03]}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function GalleryScene({
  dragMovedRef,
  reportPose,
  selectedFrameId,
  selectFrame,
}: {
  dragMovedRef: MutableRefObject<boolean>;
  reportPose: (pose: CameraPose) => void;
  selectedFrameId: number | null;
  selectFrame: (frame: FrameData) => void;
}) {
  const atlasTexture = useTexture(ATLAS_URL);

  atlasTexture.colorSpace = THREE.SRGBColorSpace;
  atlasTexture.anisotropy = 2;
  atlasTexture.generateMipmaps = true;
  atlasTexture.minFilter = THREE.LinearFilter;
  atlasTexture.magFilter = THREE.LinearFilter;

  return (
    <>
      <color attach="background" args={["#05070a"]} />
      <fog attach="fog" args={["#151719", 24, 66]} />
      <ambientLight color="#d8d4cc" intensity={0.42} />
      <hemisphereLight args={["#f0e8dc", "#5c6264", 0.9]} />
      <directionalLight position={[-7, 8, 10]} color="#ddd4c6" intensity={0.52} />
      <pointLight position={[0, 3.25, 0]} color="#d8dcda" intensity={0.9} distance={34} decay={1.25} />
      <pointLight position={[0, 3.15, 13]} color="#ddd6cc" intensity={0.64} distance={26} decay={1.35} />
      <TargetedSpotlight angle={1.0} color="#ece4d8" distance={38} intensity={1.55} penumbra={0.98} position={[0, 2.9, 1]} target={[0, 1.8, -16]} />
      <TargetedSpotlight angle={1.0} color="#d8d8d2" distance={38} intensity={1.25} penumbra={0.98} position={[0, 2.8, 2]} target={[0, 1.75, 16]} />
      <TargetedSpotlight angle={0.98} color="#d5d7d3" distance={36} intensity={1.35} penumbra={0.98} position={[-3, 2.8, 0]} target={[-22, 1.75, 0]} />
      <TargetedSpotlight angle={0.98} color="#ded4c4" distance={36} intensity={1.35} penumbra={0.98} position={[3, 2.8, 0]} target={[22, 1.75, 0]} />
      <TargetedSpotlight angle={0.95} color="#d0d3d2" distance={22} intensity={0.62} penumbra={1} position={[0, 1.7, 0]} target={[0, 3.55, 0]} />
      <TargetedSpotlight angle={0.55} color="#f0e6d8" distance={18} intensity={0.55} penumbra={0.85} position={[0, 3.4, -13]} target={[0, 1.8, -15.6]} />
      <TargetedSpotlight angle={0.5} color="#e8d6bd" distance={15} intensity={0.42} penumbra={0.9} position={[16, 3.25, -7]} target={[21.7, 1.8, -3]} />
      <TargetedSpotlight angle={0.52} color="#e2d8c7" distance={15} intensity={0.38} penumbra={0.85} position={[-16, 3.2, 2]} target={[-21.7, 1.8, 2]} />
      <Room />
      {frames.map((frame) => (
        <PhotoFrame
          key={frame.id}
          atlasTexture={atlasTexture}
          dragMovedRef={dragMovedRef}
          frame={frame}
          selectedFrameId={selectedFrameId}
          selectFrame={selectFrame}
        />
      ))}
      <PlayerController />
      <DragLookControls dragMovedRef={dragMovedRef} />
      <CameraPoseReporter reportPose={reportPose} />
    </>
  );
}

function toMapPosition(x: number, z: number) {
  const mapWidth = MAP_BOUNDS.maxX - MAP_BOUNDS.minX;
  const mapHeight = MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ;

  return {
    left: `${((x - MAP_BOUNDS.minX) / mapWidth) * 100}%`,
    top: `${((z - MAP_BOUNDS.minZ) / mapHeight) * 100}%`,
  };
}

function MiniMap({ pose }: { pose: CameraPose }) {
  return (
    <div className="absolute bottom-5 right-5 z-10 w-64 rounded-3xl border border-white/15 bg-[#0b0b09]/70 p-4 text-[#f4eddf] shadow-[0_18px_45px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between text-xs font-bold tracking-[0.22em] text-[#f4eddf]/70">
        <span>MINI MAP</span>
        <span>展馆平面</span>
      </div>
      <div className="relative h-44 overflow-hidden rounded-2xl border border-white/10 bg-[#efe7da]">
        {[...wallBoxes, ...panelBoxes].map((boxSpec) => (
          <div
            key={boxSpec.id}
            className={boxSpec.color ? "absolute bg-[#d7cdbc]" : "absolute bg-[#222]"}
            style={{
              left: toMapPosition(boxSpec.position[0] - boxSpec.size[0] / 2, boxSpec.position[2]).left,
              top: toMapPosition(boxSpec.position[0], boxSpec.position[2] - boxSpec.size[2] / 2).top,
              width: `${(boxSpec.size[0] / (MAP_BOUNDS.maxX - MAP_BOUNDS.minX)) * 100}%`,
              height: `${(boxSpec.size[2] / (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ)) * 100}%`,
            }}
          />
        ))}
        {zoneLabels.slice(0, 4).map((zone) => {
          const position = toMapPosition(zone.position[0], zone.position[2]);

          return (
            <span
              key={zone.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-[#11100c]/55"
              style={position}
            >
              {zone.label.replace("展区", "")}
            </span>
          );
        })}
        <div
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#ff5d2a] shadow-[0_0_18px_rgba(255,93,42,0.9)]"
          style={{
            ...toMapPosition(pose.x, pose.z),
            transform: `translate(-50%, -50%) rotate(${pose.rotation}rad)`,
          }}
        >
          <span className="absolute left-1/2 top-[-8px] h-3 w-0.5 -translate-x-1/2 rounded-full bg-[#ff5d2a]" />
        </div>
      </div>
    </div>
  );
}

function PhotoModal({ frame, onClose }: { frame: FrameData; onClose: () => void }) {
  const imageId = frame.imageId;
  const photo = imageId ? photoPreviews[(imageId - 1) % photoPreviews.length] : undefined;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (!photo) return null;

  return (
    <div
      className="absolute inset-0 z-30 grid place-items-center bg-black/85 p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${frame.title} 放大预览`}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-[#f4eddf] p-3 text-[#11100c]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4 px-2">
          <div>
            <p className="text-xs font-black tracking-[0.28em] text-[#6f6253]">PHOTO PREVIEW</p>
            <h3 className="mt-1 text-xl font-bold">{frame.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#11100c] px-4 py-2 text-sm font-bold text-[#f4eddf] transition hover:bg-[#ff5d2a]"
          >
            关闭
          </button>
        </div>
        <div className="grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[1.4rem] bg-[#11100c]">
          {/* eslint-disable-next-line @next/next/no-img-element -- Modal preview uses generated static thumbnails. */}
          <img
            alt={frame.title}
            className="block max-h-[72vh] max-w-full object-contain"
            decoding="async"
            draggable={false}
            src={photo.modalSrc}
          />
        </div>
      </div>
    </div>
  );
}

const GalleryCanvas = memo(function GalleryCanvas({
  dragMovedRef,
  reportPose,
  selectedFrameId,
  selectFrame,
  setWebglLost,
}: GalleryCanvasProps) {
  return (
    <KeyboardControls map={moveMap}>
      <Canvas dpr={1} gl={canvasGlConfig} camera={canvasCameraConfig}>
        <ContextLossMonitor setWebglLost={setWebglLost} />
        <GalleryScene
          dragMovedRef={dragMovedRef}
          reportPose={reportPose}
          selectedFrameId={selectedFrameId}
          selectFrame={selectFrame}
        />
      </Canvas>
    </KeyboardControls>
  );
});

export default function GalleryExperience() {
  const [cameraPose, setCameraPose] = useState<CameraPose>({ x: 0, z: 12, rotation: 0 });
  const [webglLost, setWebglLost] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<FrameData | null>(null);
  const dragMovedRef = useRef(false);
  const reportPose = useCallback((pose: CameraPose) => {
    setCameraPose(pose);
  }, []);
  const selectFrame = useCallback((frameData: FrameData) => {
    setSelectedFrame(frameData);
  }, []);

  return (
    <div className="gallery-canvas relative rounded-[2rem]">
      <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-[#f0eadc]/85">
        左键拖动视角 / WASD 移动 / 点击照片放大
      </div>
      <GalleryCanvas
        dragMovedRef={dragMovedRef}
        reportPose={reportPose}
        selectedFrameId={selectedFrame?.id ?? null}
        selectFrame={selectFrame}
        setWebglLost={setWebglLost}
      />
      <MiniMap pose={cameraPose} />
      {webglLost ? (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/80 p-6 text-center text-[#f4eddf]">
          <div className="max-w-md rounded-3xl bg-[#11100c] p-6">
            <p className="text-sm font-black tracking-[0.28em] text-[#ff5d2a]">WEBGL CONTEXT LOST</p>
            <p className="mt-4 text-sm leading-7 text-[#f4eddf]/75">
              浏览器释放了 WebGL 上下文。请刷新页面；如果在开发模式下，请重启 dev server 以清理旧纹理缓存。
            </p>
          </div>
        </div>
      ) : null}
      {selectedFrame ? <PhotoModal frame={selectedFrame} onClose={() => setSelectedFrame(null)} /> : null}
    </div>
  );
}
