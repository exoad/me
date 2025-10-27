import { useMemo } from "react";
import "../styles/WarpTunnelBg.css";


export default function WarpTunnelBg({ scrollY }: Readonly<{ scrollY: number; }>) {
  const _particles = useMemo(() => Math.min(Math.floor(200 * (window.devicePixelRatio || 1) * ((navigator.hardwareConcurrency || 4) / 4)), 320), []);
  const particles = useMemo(
    () =>
      Array.from({ length: _particles }).map((_, i) => {
        return {
          id: i,
          angle: Math.random() * Math.PI * 2,
          life: 500 + Math.random() * 1000,
          speed: 5.5 + Math.random() * 20.3,
          delay: Math.random() * 2,
          size: 2 + Math.random() * 3,
          stretch: 4.5 + Math.random() * 6,

        };
      }),
    [_particles]
  );
  return (
    <div
      className="warp-tunnel"
      style={{ opacity: Math.max(0, 1 - scrollY / 500) }}
    >
      {particles.map((p) => {
        return (
          <div
            key={p.id}
            className="warp-particle"
            style={{
              width: p.size,
              height: p.size,
              animationDuration: `${p.speed}s`,
              animationDelay: `${p.delay}s`,
              ["--dx" as any]: `${Math.cos(p.angle) * p.life}px`,
              ["--dy" as any]: `${Math.sin(p.angle) * p.life}px`,
              ["--angle" as any]: `${(p.angle * 180) / Math.PI}deg`,
              ["--stretch" as any]: p.stretch,
            }}
          />
        );
      })}
    </div>
  );
}
