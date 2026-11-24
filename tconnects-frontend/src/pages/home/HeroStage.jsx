import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const HeroScene = lazy(() => import("./HeroScene"));

const POSTER_SRC = "/assets/hero-ribbon.png";

// Dev-only switches for checking the scene: ?hero3d=force skips the device
// checks, ?hero3d=off shows only the still image. Removed from production builds.
const devMode = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("hero3d") : null;

function supportsWebGL() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

function deviceCanRun3D() {
  if (devMode === "off") return false;
  if (devMode === "force") return supportsWebGL();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = navigator.connection;
  if (connection?.saveData) return false;
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;
  return supportsWebGL();
}

/** If the 3D code fails to download or crashes, the still image stays. */
class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroStage({ activeRef }) {
  const stageRef = useRef(null);
  const [mount3D, setMount3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [compact] = useState(() => window.matchMedia("(max-width: 899.98px)").matches);

  // Load the 3D code only after the page has painted and the browser is idle.
  useEffect(() => {
    if (!deviceCanRun3D()) return undefined;
    const start = () => setMount3D(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 800);
    return () => window.clearTimeout(id);
  }, []);

  // Turning on reduced motion mid-visit drops back to the still image.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => {
      if (event.matches && devMode !== "force") {
        setMount3D(false);
        setReady(false);
      }
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Stop rendering when the hero is off screen or the tab is hidden.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    if (stageRef.current) observer.observe(stageRef.current);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleFail = () => {
    setMount3D(false);
    setReady(false);
  };

  return (
    <div className="vc-stage" ref={stageRef}>
      <img
        className={`vc-stage__poster ${ready ? "is-hidden" : ""}`}
        src={POSTER_SRC}
        alt=""
        width="1200"
        height="727"
        fetchPriority="high"
      />

      {mount3D && (
        <div className={`vc-stage__canvas ${ready ? "is-ready" : ""}`}>
          <SceneBoundary onFail={handleFail}>
            <Suspense fallback={null}>
              <HeroScene
                activeRef={activeRef}
                running={!paused && onScreen && tabVisible}
                compact={compact}
                watchSpeed={devMode !== "force"}
                onReady={() => setReady(true)}
                onFail={handleFail}
              />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      {mount3D && ready && (
        <button
          type="button"
          className="vc-stage__pause"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play animation" : "Pause animation"}
        >
          {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
