import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform float uIntensity;
  uniform float uGrain;

  // 2D simplex noise (Ashima)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for(int i = 0; i < 5; i++){
      v += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  // Cheap pseudo-random for grain
  float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = uv;
    p.x *= aspect;

    // Mouse position in same aspect-corrected space
    vec2 m = uMouse;
    m.x *= aspect;

    // Cursor-driven distortion field
    vec2 toMouse = p - m;
    float d = length(toMouse);
    float pull = exp(-d * 2.2) * 0.35 * uIntensity;
    vec2 swirl = vec2(-toMouse.y, toMouse.x) * pull;

    // Layered painted noise
    float t = uTime * 0.06;
    vec2 q = p * 1.6 + swirl + vec2(t, -t * 0.7);
    float n1 = fbm(q);
    float n2 = fbm(q * 2.2 + n1 + vec2(t * 1.3, t));
    float n3 = fbm(q * 0.6 - n2 * 0.5);

    // Brush-stroke streaks
    float streaks = sin((p.y * 18.0) + n1 * 6.0 + t * 2.0) * 0.5 + 0.5;
    streaks = pow(streaks, 6.0) * 0.12;

    // Color mixing between palette stops
    float k1 = smoothstep(-0.4, 0.6, n1 + n3 * 0.4);
    float k2 = smoothstep(0.0, 1.0, n2 * 0.6 + 0.5 + pull * 1.5);
    vec3 col = mix(uColorA, uColorB, k1);
    col = mix(col, uColorC, k2 * 0.85);

    // Soften with brush streaks and cursor glow
    col += streaks;
    col += vec3(0.9, 0.7, 0.55) * pull * 0.55;

    // Vignette
    vec2 vUvCenter = uv - 0.5;
    float vig = 1.0 - dot(vUvCenter, vUvCenter) * 0.9;
    col *= vig;

    // Film grain
    float g = hash(uv * uResolution + uTime) - 0.5;
    col += g * uGrain;

    gl_FragColor = vec4(col, 1.0);
  }
`

function hexToVec3(hex) {
  const c = new THREE.Color(hex)
  return new THREE.Vector3(c.r, c.g, c.b)
}

export default function PaintedBackground({ palette }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const initial = palette[0]
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColorA: { value: hexToVec3(initial.a) },
      uColorB: { value: hexToVec3(initial.b) },
      uColorC: { value: hexToVec3(initial.c) },
      uIntensity: { value: 1.0 },
      uGrain: { value: 0.06 },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const setSize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      uniforms.uResolution.value.set(w, h)
    }
    setSize()

    const targetMouse = new THREE.Vector2(0.5, 0.5)
    const onPointerMove = (e) => {
      const x = (e.touches ? e.touches[0].clientX : e.clientX) / window.innerWidth
      const y = 1.0 - (e.touches ? e.touches[0].clientY : e.clientY) / window.innerHeight
      targetMouse.set(x, y)
    }
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('resize', setSize)

    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      const dt = clock.getDelta()
      uniforms.uTime.value += dt
      uniforms.uMouse.value.lerp(targetMouse, Math.min(1, dt * 4.5))
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    stateRef.current = { uniforms }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('resize', setSize)
      mesh.geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  // Tween palette uniforms when active chapter changes (driven by parent via window event)
  useEffect(() => {
    const onChapter = (e) => {
      const idx = e.detail.index
      const next = palette[Math.max(0, Math.min(palette.length - 1, idx))]
      const s = stateRef.current
      if (!s) return
      const a = new THREE.Color(next.a)
      const b = new THREE.Color(next.b)
      const c = new THREE.Color(next.c)
      gsap.to(s.uniforms.uColorA.value, { x: a.r, y: a.g, z: a.b, duration: 1.4, ease: 'power2.out' })
      gsap.to(s.uniforms.uColorB.value, { x: b.r, y: b.g, z: b.b, duration: 1.4, ease: 'power2.out' })
      gsap.to(s.uniforms.uColorC.value, { x: c.r, y: c.g, z: c.b, duration: 1.4, ease: 'power2.out' })
      gsap.fromTo(
        s.uniforms.uIntensity,
        { value: 2.2 },
        { value: 1.0, duration: 1.6, ease: 'power3.out' }
      )
    }
    window.addEventListener('chapter:change', onChapter)
    return () => window.removeEventListener('chapter:change', onChapter)
  }, [palette])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        display: 'block',
      }}
    />
  )
}
