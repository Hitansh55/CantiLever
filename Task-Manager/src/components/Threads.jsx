import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'

/**
 * Threads — full-screen animated line background.
 * Renders a bundle of flowing, noise-driven threads on a fullscreen
 * WebGL triangle, with optional mouse-driven distortion.
 *
 * Props:
 *  - color: [r, g, b] (0-1 range) thread color
 *  - amplitude: vertical wave amplitude
 *  - distance: mouse influence falloff distance
 *  - enableMouseInteraction: boolean
 */
export default function Threads({
  color = [0.11, 0.5, 0.45],
  amplitude = 1.2,
  distance = 0,
  enableMouseInteraction = true,
  className = '',
}) {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, target: { x: 0, y: 0 } })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas)

    const vertex = /* glsl */ `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fragment = /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor;
      uniform vec2 uMouse;
      uniform float uAmplitude;
      uniform float uMouseInfluence;
      varying vec2 vUv;

      float thread(vec2 uv, float offset, float freq, float speed, float thickness) {
        float wave = sin(uv.x * freq + uTime * speed + offset * 6.2831) * uAmplitude * 0.06;
        float mouseWave = uMouseInfluence * exp(-abs(uv.x - uMouse.x) * 3.0) * (uMouse.y - 0.5) * 0.4;
        float y = 0.5 + (offset - 0.5) * 0.85 + wave + mouseWave;
        float d = abs(uv.y - y);
        return smoothstep(thickness, 0.0, d);
      }

      void main() {
        vec2 uv = vUv;
        uv.x *= uResolution.x / uResolution.y;
        float mouseX = uMouse.x * (uResolution.x / uResolution.y);
        vec2 adjUv = vec2(uv.x, vUv.y);

        float intensity = 0.0;
        const int THREAD_COUNT = 14;
        for (int i = 0; i < THREAD_COUNT; i++) {
          float fi = float(i) / float(THREAD_COUNT - 1);
          intensity += thread(vec2(vUv.x, vUv.y), fi, 6.0 + fi * 3.0, 0.15 + fi * 0.05, 0.0025 + fi * 0.0006);
        }
        intensity = clamp(intensity, 0.0, 1.0);

        vec3 color = uColor * intensity;
        float alpha = intensity * 0.85;
        gl_FragColor = vec4(color, alpha);
      }
    `

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uColor: { value: new Color(...color) },
        uMouse: { value: [0.5, 0.5] },
        uAmplitude: { value: amplitude },
        uMouseInfluence: { value: enableMouseInteraction ? 1 : 0 },
      },
      transparent: true,
    })
    const mesh = new Mesh(gl, { geometry, program })

    function resize() {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width, height]
    }
    resize()
    window.addEventListener('resize', resize)

    function handlePointerMove(e) {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      mouseRef.current.target = { x, y }
    }
    if (enableMouseInteraction) {
      window.addEventListener('pointermove', handlePointerMove)
    }

    let rafId
    const start = performance.now()
    function update() {
      const elapsed = (performance.now() - start) / 1000
      program.uniforms.uTime.value = elapsed

      const m = mouseRef.current
      m.x += (m.target.x - m.x) * 0.06
      m.y += (m.target.y - m.y) * 0.06
      program.uniforms.uMouse.value = [m.x, m.y]

      renderer.render({ scene: mesh })
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      if (enableMouseInteraction) {
        window.removeEventListener('pointermove', handlePointerMove)
      }
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas)
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, distance, enableMouseInteraction])

  return <div ref={containerRef} className={`h-full w-full ${className}`} aria-hidden="true" />
}
