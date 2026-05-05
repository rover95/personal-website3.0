"use client";

/* eslint-disable react-hooks/immutability -- R3F camera controls intentionally mutate Three.js objects. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

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

type FrameData = {
  id: number;
  title: string;
  color: string;
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

type LockState = "unsupported" | "idle" | "locked" | "cooldown";
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
type GalleryCanvasProps = {
  changeLockState: (state: LockState) => void;
  registerLockHandler: (handler: (() => void) | null) => void;
  reportPose: (pose: CameraPose) => void;
};

const frames: FrameData[] = [
  frame(1, [-4.8, 2.15, -15.72], [0, 0, 0]),
  frame(2, [0, 2.15, -15.72], [0, 0, 0]),
  frame(3, [4.8, 2.15, -15.72], [0, 0, 0]),
  frame(4, [-5.55, 1.85, -4.8], [0, -Math.PI / 2, 0], [2.1, 1.9]),
  frame(5, [-5.55, 1.85, 5.4], [0, -Math.PI / 2, 0], [2.1, 1.9]),
  frame(6, [5.55, 1.85, -4.8], [0, Math.PI / 2, 0], [2.1, 1.9]),
  frame(7, [5.55, 1.85, 5.4], [0, Math.PI / 2, 0], [2.1, 1.9]),
  frame(8, [21.72, 1.85, -10.2], [0, -Math.PI / 2, 0], [2, 1.9]),
  frame(9, [21.72, 1.85, 4.4], [0, -Math.PI / 2, 0], [2, 1.9]),
  frame(10, [14.8, 1.82, 15.05], [0, Math.PI, 0], [2.9, 1.55]),
  frame(11, [0, 1.78, -1.0], [0, 0, 0], [3, 1.45]),
  frame(12, [0, 1.78, 7.0], [0, 0, 0], [3, 1.45]),
  frame(13, [-21.72, 1.8, -11.6], [0, Math.PI / 2, 0], [2, 1.8]),
  frame(14, [-21.72, 1.8, -6.0], [0, Math.PI / 2, 0], [2, 1.8]),
  frame(15, [-15.5, 1.82, -1.2], [0, 0, 0], [3.4, 1.5]),
  frame(16, [-21.72, 1.8, 6.0], [0, Math.PI / 2, 0], [2, 1.8]),
  frame(17, [-21.72, 1.8, 11.4], [0, Math.PI / 2, 0], [2, 1.8]),
  frame(18, [-15.5, 1.82, 15.05], [0, Math.PI, 0], [3.4, 1.5]),
  frame(19, [12.6, 1.45, -11.0], [0, -0.25, 0], [1.65, 1.65], "object"),
  frame(20, [15.6, 1.45, -2.2], [0, 0.2, 0], [1.65, 1.65], "object"),
  frame(21, [12.2, 1.45, 10.3], [0, -0.1, 0], [1.65, 1.65], "object"),
];

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

function frame(
  id: number,
  position: [number, number, number],
  rotation: [number, number, number],
  size: [number, number] = [2.5, 1.75],
  kind: "photo" | "object" = "photo",
): FrameData {
  return {
    id,
    title: `作品${id}`,
    color: palette[(id - 1) % palette.length],
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

function FirstPersonLook({
  changeLockState,
  registerLockHandler,
}: {
  changeLockState?: (state: LockState) => void;
  registerLockHandler: (handler: (() => void) | null) => void;
}) {
  const { camera, gl } = useThree();
  const cooldownUntil = useRef(0);
  const wasLocked = useRef(false);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const setLockStateSafe = useCallback(
    (state: LockState) => {
      if (typeof changeLockState === "function") changeLockState(state);
    },
    [changeLockState],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    const supportsPointerLock =
      "pointerLockElement" in document && "exitPointerLock" in document && "requestPointerLock" in canvas;

    if (!supportsPointerLock) {
      setLockStateSafe("unsupported");
      registerLockHandler(null);
      return;
    }

    setLockStateSafe("idle");
    camera.rotation.order = "YXZ";
    yaw.current = camera.rotation.y;
    pitch.current = camera.rotation.x;

    const requestLock = () => {
      if (document.pointerLockElement === canvas) return;
      if (Date.now() < cooldownUntil.current) {
        setLockStateSafe("cooldown");
        return;
      }

      const lockResult = canvas.requestPointerLock() as Promise<void> | void;
      lockResult?.catch(() => {
        setLockStateSafe("idle");
      });
    };

    registerLockHandler(requestLock);

    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;

      yaw.current -= event.movementX * 0.0022;
      pitch.current -= event.movementY * 0.0022;
      pitch.current = THREE.MathUtils.clamp(pitch.current, -Math.PI / 2 + 0.08, Math.PI / 2 - 0.08);
      camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      registerLockHandler(null);
    };
  }, [camera, gl, registerLockHandler, setLockStateSafe]);

  useEffect(() => {
    const onLockChange = () => {
      const lockedElement = document.pointerLockElement;
      const locked = lockedElement === gl.domElement;

      if (locked) {
        wasLocked.current = true;
        setLockStateSafe("locked");
        return;
      }

      if (wasLocked.current) {
        cooldownUntil.current = Date.now() + 900;
        wasLocked.current = false;
        setLockStateSafe("cooldown");
        window.setTimeout(() => {
          if (!document.pointerLockElement) setLockStateSafe("idle");
        }, 950);
        return;
      }

      setLockStateSafe("idle");
    };

    document.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("pointerlockerror", onLockChange);

    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("pointerlockerror", onLockChange);
    };
  }, [gl, setLockStateSafe]);

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
        <meshStandardMaterial color="#ebe3d5" roughness={0.86} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 32.8]} />
        <meshBasicMaterial color="#f3eee4" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 3.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 36]} />
        <meshStandardMaterial color="#f7f2e8" roughness={0.94} />
      </mesh>
      {[...wallBoxes, ...panelBoxes].map((wall) => (
        <WallBox key={wall.id} wall={wall} />
      ))}
      <mesh position={[0, 0.02, 17.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.9, 2.1]} />
        <meshBasicMaterial color="#f2dfc2" transparent opacity={0.75} />
      </mesh>
      <gridHelper args={[44, 22, "#d1c7b8", "#e8dfd1"]} position={[0, 0.03, 0]} />
      {zoneLabels.map((zone) => (
        <ZoneMarker key={zone.label} zone={zone} />
      ))}
    </group>
  );
}

function ZoneMarker({ zone }: { zone: ZoneLabel }) {
  return (
    <mesh position={zone.position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 0.75, 32]} />
      <meshBasicMaterial color="#6f6253" transparent opacity={0.65} />
    </mesh>
  );
}

function WallBox({ wall }: { wall: BoxSpec }) {
  return (
    <mesh position={wall.position}>
      <boxGeometry args={wall.size} />
      <meshStandardMaterial color={wall.color ?? "#272727"} roughness={0.76} metalness={0.04} />
    </mesh>
  );
}

function PhotoFrame({ frame }: { frame: FrameData }) {
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

  const [width, height] = frame.size ?? [2.5, 1.75];

  return (
    <group position={frame.position} rotation={frame.rotation}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[width + 0.34, height + 0.34, 0.16]} />
        <meshStandardMaterial color="#3a332b" roughness={0.48} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={frame.color} emissive={frame.color} emissiveIntensity={0.05} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[width * 0.78, height * 0.55]} />
        <meshBasicMaterial color="#f7efe2" transparent opacity={0.24} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.26, 0.07]}>
        <planeGeometry args={[0.58, 0.12]} />
        <meshBasicMaterial color="#11100c" />
      </mesh>
    </group>
  );
}

function GalleryScene({
  changeLockState,
  registerLockHandler,
  reportPose,
}: {
  changeLockState: (state: LockState) => void;
  registerLockHandler: (handler: (() => void) | null) => void;
  reportPose: (pose: CameraPose) => void;
}) {
  return (
    <>
      <color attach="background" args={["#05070a"]} />
      <fog attach="fog" args={["#efe7da", 30, 72]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[0, 8, 8]} intensity={1.2} />
      <pointLight position={[-16, 2.8, -8]} color="#fff3dc" intensity={1.7} distance={12} />
      <pointLight position={[0, 3, -8]} color="#fff3dc" intensity={1.9} distance={18} />
      <pointLight position={[15, 3, 2]} color="#fff3dc" intensity={1.8} distance={18} />
      <pointLight position={[-16, 2.8, 8]} color="#fff3dc" intensity={1.5} distance={12} />
      <Room />
      {frames.map((frame) => (
        <PhotoFrame key={frame.id} frame={frame} />
      ))}
      <PlayerController />
      <FirstPersonLook changeLockState={changeLockState} registerLockHandler={registerLockHandler} />
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

const GalleryCanvas = memo(function GalleryCanvas({
  changeLockState,
  registerLockHandler,
  reportPose,
}: GalleryCanvasProps) {
  return (
    <KeyboardControls map={moveMap}>
      <Canvas dpr={1} gl={canvasGlConfig} camera={canvasCameraConfig}>
        <GalleryScene
          changeLockState={changeLockState}
          registerLockHandler={registerLockHandler}
          reportPose={reportPose}
        />
      </Canvas>
    </KeyboardControls>
  );
});

export default function GalleryExperience() {
  const [lockState, setLockState] = useState<LockState>("idle");
  const [cameraPose, setCameraPose] = useState<CameraPose>({ x: 0, z: 12, rotation: 0 });
  const lockHandler = useRef<(() => void) | null>(null);
  const registerLockHandler = useCallback((handler: (() => void) | null) => {
    lockHandler.current = handler;
  }, []);
  const changeLockState = useCallback((state: LockState) => {
    setLockState(state);
  }, []);
  const reportPose = useCallback((pose: CameraPose) => {
    setCameraPose(pose);
  }, []);

  const lockLabel =
    lockState === "unsupported"
      ? "当前浏览器不支持鼠标锁定"
      : lockState === "locked"
        ? "已进入 / ESC 退出"
        : lockState === "cooldown"
          ? "稍等后可再次进入"
          : "进入画廊视角";

  return (
    <div className="gallery-canvas relative rounded-[2rem]">
      <button
        type="button"
        disabled={lockState === "unsupported" || lockState === "locked" || lockState === "cooldown"}
        onClick={() => lockHandler.current?.()}
        className="absolute left-5 top-5 z-10 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-xs font-semibold tracking-[0.2em] text-[#f0eadc]/85 backdrop-blur transition hover:bg-black/65 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {lockLabel}
      </button>
      <GalleryCanvas
        changeLockState={changeLockState}
        registerLockHandler={registerLockHandler}
        reportPose={reportPose}
      />
      <MiniMap pose={cameraPose} />
    </div>
  );
}
