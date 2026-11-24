import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Vector3,
} from "three";

// The logo's two strokes, traced as ribbons: the V sweeping up into the top of
// the C, and the C curving round beneath it.
const STROKES = [
  {
    z: 0.14,
    points: [
      [-2.45, 1.28],
      [-1.75, 0.2],
      [-1.15, -0.9],
      [-0.72, -1.2],
      [-0.2, -0.72],
      [0.42, 0.42],
      [1.08, 1.22],
      [1.62, 1.34],
      [2.42, 0.86],
    ],
    colors: ["#02506f", "#0194b0", "#0bd6e8", "#0194b0", "#0bfafd"],
    // Service points carried by this ribbon: [service index, position along it].
    nodes: [
      [0, 0.1],
      [1, 0.32],
      [2, 0.58],
      [3, 0.9],
    ],
  },
  {
    z: -0.14,
    points: [
      [1.72, 1.32],
      [0.98, 1.08],
      [0.3, 0.42],
      [0.06, -0.24],
      [0.4, -0.92],
      [1.12, -1.34],
      [1.82, -1.26],
      [2.44, -0.84],
    ],
    colors: ["#02506f", "#02698a", "#0194b0", "#0bd6e8", "#0bfafd"],
    nodes: [
      [4, 0.18],
      [5, 0.52],
      [6, 0.88],
    ],
  },
];

const RIBBON_WIDTH = 0.8;
const Z_AXIS = new Vector3(0, 0, 1);
const REST_COLOR = new Color("#ffffff");
const ACTIVE_COLOR = new Color("#06242f");

function gradientAt(stops, u, target) {
  const scaled = u * (stops.length - 1);
  const index = Math.min(Math.floor(scaled), stops.length - 2);
  return target.copy(stops[index]).lerp(stops[index + 1], scaled - index);
}

function createRibbon(stroke, segments) {
  const curve = new CatmullRomCurve3(
    stroke.points.map(([x, y]) => new Vector3(x, y, 0)),
    false,
    "centripetal"
  );
  const stops = stroke.colors.map((value) => new Color(value));
  const vertexCount = (segments + 1) * 2;
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const indices = [];
  const samples = [];
  const color = new Color();

  for (let i = 0; i <= segments; i += 1) {
    const u = i / segments;
    const center = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);
    samples.push({ u, center, side: new Vector3(-tangent.y, tangent.x, 0).normalize() });
    gradientAt(stops, u, color);
    color.toArray(colors, i * 6);
    color.toArray(colors, i * 6 + 3);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  return { geometry, samples, z: stroke.z, phase: stroke.z > 0 ? 0 : 1.7, nodes: stroke.nodes, curve };
}

const edge = new Vector3();

function updateRibbon(ribbon, time) {
  const positions = ribbon.geometry.attributes.position;
  ribbon.samples.forEach(({ u, center, side }, i) => {
    const twist = 0.42 * Math.sin(u * 5.2 + time * 0.55 + ribbon.phase);
    const depth = ribbon.z + 0.12 * Math.sin(u * 4.4 + time * 0.45 + ribbon.phase);
    edge.copy(side).multiplyScalar(Math.cos(twist)).addScaledVector(Z_AXIS, Math.sin(twist));
    edge.multiplyScalar(RIBBON_WIDTH / 2);
    positions.setXYZ(i * 2, center.x + edge.x, center.y + edge.y, depth + edge.z);
    positions.setXYZ(i * 2 + 1, center.x - edge.x, center.y - edge.y, depth - edge.z);
  });
  positions.needsUpdate = true;
  ribbon.geometry.computeVertexNormals();
}

function Ribbons({ activeRef, segments, onSlow, watchSpeed }) {
  const group = useRef(null);
  const nodeRefs = useRef([]);
  const speed = useRef({ warmup: 1, frames: 0, total: 0, done: !watchSpeed });
  const { viewport, pointer } = useThree();

  const ribbons = useMemo(() => STROKES.map((stroke) => createRibbon(stroke, segments)), [segments]);
  const nodes = useMemo(
    () =>
      ribbons.flatMap((ribbon) =>
        ribbon.nodes.map(([service, u]) => ({ service, u, position: ribbon.curve.getPointAt(u), ribbon }))
      ),
    [ribbons]
  );

  useEffect(
    () => () => {
      ribbons.forEach((ribbon) => ribbon.geometry.dispose());
    },
    [ribbons]
  );

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    ribbons.forEach((ribbon) => updateRibbon(ribbon, time));

    const root = group.current;
    if (root) {
      // Leaves room for the ribbon's width and sway, so it never meets the canvas edge.
      const fit = Math.min(viewport.width / 6.6, viewport.height / 3.9);
      root.scale.setScalar(fit);
      root.rotation.y += (Math.sin(time * 0.32) * 0.26 + pointer.x * 0.16 - root.rotation.y) * 0.05;
      root.rotation.x += (Math.sin(time * 0.24) * 0.07 - pointer.y * 0.1 - root.rotation.x) * 0.05;
    }

    nodes.forEach((node, i) => {
      const mesh = nodeRefs.current[i];
      if (!mesh) return;
      const isActive = activeRef.current === node.service;
      const depth = node.ribbon.z + 0.12 * Math.sin(node.u * 4.4 + time * 0.45 + node.ribbon.phase);
      mesh.position.set(node.position.x, node.position.y, depth + 0.1);
      const size = mesh.scale.x + ((isActive ? 2 : 1) - mesh.scale.x) * 0.14;
      mesh.scale.setScalar(size);
      mesh.material.color.lerp(isActive ? ACTIVE_COLOR : REST_COLOR, 0.14);
    });

    // Falls back to the still image if this device can't hold about 30fps.
    const check = speed.current;
    if (!check.done) {
      if (check.warmup > 0) {
        check.warmup -= delta;
      } else if (delta < 0.5) {
        check.frames += 1;
        check.total += delta;
        if (check.frames >= 120) {
          check.done = true;
          if (check.total / check.frames > 1 / 30) onSlow();
        }
      }
    }
  });

  return (
    <group ref={group}>
      {ribbons.map((ribbon, i) => (
        <mesh key={i} geometry={ribbon.geometry}>
          <meshStandardMaterial vertexColors side={DoubleSide} roughness={0.42} metalness={0.08} />
        </mesh>
      ))}
      {nodes.map((node, i) => (
        // Drawn over the ribbons, so all seven stay visible as the ribbons fold.
        <mesh
          key={node.service}
          renderOrder={2}
          ref={(mesh) => {
            nodeRefs.current[i] = mesh;
          }}
        >
          <sphereGeometry args={[0.085, 20, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} depthTest={false} />
        </mesh>
      ))}
    </group>
  );
}

function FirstFrame({ onReady }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onReady();
    }
  });
  return null;
}

export default function HeroScene({ activeRef, running, compact, watchSpeed, onReady, onFail }) {
  return (
    <Canvas
      flat
      dpr={[1, compact ? 1.25 : 1.5]}
      frameloop={running ? "always" : "never"}
      camera={{ position: [0, 0, 8.5], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[-3, 4, 6]} intensity={2} />
      <directionalLight position={[4, -2, 3]} intensity={0.7} color="#bdf6ff" />
      <Ribbons activeRef={activeRef} segments={compact ? 80 : 130} onSlow={onFail} watchSpeed={watchSpeed} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  );
}
