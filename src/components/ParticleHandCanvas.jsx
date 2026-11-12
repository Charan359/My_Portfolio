import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

/**
 * ParticleHandCanvas
 * High-performance 3D Cybernetic Particle Hand based on Pinterest aesthetic
 * (glowing cyan, gold, and electric blue point-cloud with ambient bokeh particles).
 * 
 * Features:
 * - Samples point-cloud from /particle-hand.jpg directly in-browser
 * - 60 FPS hardware accelerated single-draw-call THREE.Points
 * - Interactive 3D mouse parallax tilt
 * - Cinematic particle dispersion & dissolution effect that reveals the Live Demo
 * - Instant Skip on click or Space/Esc key
 * - Clean disposal of all Three.js resources (zero memory leaks, zero lag)
 */
export default function ParticleHandCanvas({ project, onComplete, onSkip }) {
  const mountRef = useRef(null)
  const [phaseText, setPhaseText] = useState('INITIALIZING NEURAL RUNTIME')
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth <= 768

    let width = container.clientWidth || window.innerWidth
    let height = container.clientHeight || window.innerHeight

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 16)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    container.appendChild(renderer.domElement)

    // 2. Circular Glow Particle Texture
    const createGlowTexture = () => {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 64
      const ctx = c.getContext('2d')
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255, 255, 255, 1)')
      g.addColorStop(0.2, 'rgba(0, 240, 255, 0.9)')
      g.addColorStop(0.55, 'rgba(200, 164, 93, 0.45)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    }

    const glowTexture = createGlowTexture()

    // 3. Floating Ambient Bokeh Orbs
    const bokehCount = isMobile ? 80 : 180
    const bokehGeo = new THREE.BufferGeometry()
    const bokehPos = new Float32Array(bokehCount * 3)
    const bokehColors = new Float32Array(bokehCount * 3)
    const bokehSpeeds = new Float32Array(bokehCount)

    for (let i = 0; i < bokehCount; i++) {
      bokehPos[i * 3] = (Math.random() - 0.5) * 28
      bokehPos[i * 3 + 1] = (Math.random() - 0.5) * 20
      bokehPos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2

      // Alternating cyan and champagne gold bokeh
      const isGold = Math.random() > 0.6
      bokehColors[i * 3] = isGold ? 0.85 : 0.05
      bokehColors[i * 3 + 1] = isGold ? 0.72 : 0.85
      bokehColors[i * 3 + 2] = isGold ? 0.38 : 1.0

      bokehSpeeds[i] = Math.random() * 0.008 + 0.003
    }

    bokehGeo.setAttribute('position', new THREE.BufferAttribute(bokehPos, 3))
    bokehGeo.setAttribute('color', new THREE.BufferAttribute(bokehColors, 3))

    const bokehMat = new THREE.PointsMaterial({
      size: isMobile ? 0.8 : 1.2,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6
    })

    const bokehPoints = new THREE.Points(bokehGeo, bokehMat)
    scene.add(bokehPoints)

    // 4. Particle Hand Point Cloud
    let handPoints = null
    let handGeo = null
    let handMat = null
    let initialPositions = null
    let currentPositions = null
    let velocities = null
    let colors = null
    let numHandParticles = 0

    const group = new THREE.Group()
    scene.add(group)

    // Fallback procedural hand in case image load takes longer
    const buildProceduralHand = () => {
      const count = isMobile ? 1800 : 3400
      numHandParticles = count
      handGeo = new THREE.BufferGeometry()
      initialPositions = new Float32Array(count * 3)
      currentPositions = new Float32Array(count * 3)
      velocities = new Float32Array(count * 3)
      colors = new Float32Array(count * 3)

      for (let i = 0; i < count; i++) {
        // Parametric palm and fingers
        const u = Math.random()
        const v = Math.random()
        let x, y, z

        if (u < 0.45) {
          // Palm area
          const r = Math.sqrt(v) * 3.5
          const theta = Math.random() * Math.PI * 1.6 - Math.PI * 0.3
          x = Math.cos(theta) * r - 1.0
          y = Math.sin(theta) * (r * 0.7) - 1.5
          z = (Math.random() - 0.5) * 1.4
        } else {
          // 5 articulated fingers
          const fingerIdx = Math.floor(Math.random() * 5)
          const t = Math.random()
          const fingerAngles = [-0.65, -0.25, 0.05, 0.35, 0.7]
          const fingerLengths = [3.2, 4.8, 5.2, 4.7, 3.6]
          const angle = fingerAngles[fingerIdx]
          const len = fingerLengths[fingerIdx]

          const baseX = (fingerIdx - 2) * 1.1 + Math.sin(angle) * 0.5
          const baseY = 0.5
          x = baseX + Math.sin(angle) * (t * len) + (Math.random() - 0.5) * 0.8
          y = baseY + Math.cos(angle) * (t * len) + (Math.random() - 0.5) * 0.8
          z = (t * 2.2) + (Math.random() - 0.5) * 0.9 - 1.0
        }

        initialPositions[i * 3] = x
        initialPositions[i * 3 + 1] = y
        initialPositions[i * 3 + 2] = z

        currentPositions[i * 3] = x
        currentPositions[i * 3 + 1] = y
        currentPositions[i * 3 + 2] = z

        velocities[i * 3] = (Math.random() - 0.5) * 6 + (x * 0.8)
        velocities[i * 3 + 1] = Math.random() * 7 + 3
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 6 + 2

        // Shimmering cyan + champagne gold cybernetic colors
        const ratio = Math.random()
        if (ratio < 0.65) {
          // Electric cyan
          colors[i * 3] = 0.05 + Math.random() * 0.15
          colors[i * 3 + 1] = 0.85 + Math.random() * 0.15
          colors[i * 3 + 2] = 0.95 + Math.random() * 0.05
        } else {
          // Champagne gold / warm white
          colors[i * 3] = 0.92 + Math.random() * 0.08
          colors[i * 3 + 1] = 0.78 + Math.random() * 0.12
          colors[i * 3 + 2] = 0.42 + Math.random() * 0.2
        }
      }

      handGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
      handGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      handMat = new THREE.PointsMaterial({
        size: isMobile ? 0.22 : 0.28,
        map: glowTexture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.9
      })

      handPoints = new THREE.Points(handGeo, handMat)
      group.add(handPoints)
    }

    // Try sampling directly from /particle-hand.jpg
    const img = new Image()
    img.src = '/particle-hand.jpg'
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const offscreen = document.createElement('canvas')
        const targetW = isMobile ? 120 : 160
        const targetH = Math.round((img.height / img.width) * targetW)
        offscreen.width = targetW
        offscreen.height = targetH
        const offCtx = offscreen.getContext('2d')
        offCtx.drawImage(img, 0, 0, targetW, targetH)
        const imgData = offCtx.getImageData(0, 0, targetW, targetH).data

        const validPoints = []
        for (let py = 0; py < targetH; py++) {
          for (let px = 0; px < targetW; px++) {
            const idx = (py * targetW + px) * 4
            const r = imgData[idx]
            const g = imgData[idx + 1]
            const b = imgData[idx + 2]
            const lum = 0.299 * r + 0.587 * g + 0.114 * b

            // Sample bright hand pixels
            if (lum > 42 && Math.random() < (isMobile ? 0.35 : 0.6)) {
              const nx = (px / targetW - 0.5) * 14
              const ny = -(py / targetH - 0.5) * 10
              const nz = (lum / 255) * 3.5 - 1.5 + (1 - py / targetH) * 2.0
              validPoints.push({
                x: nx,
                y: ny,
                z: nz,
                r: r / 255,
                g: g / 255,
                b: b / 255
              })
            }
          }
        }

        if (validPoints.length > 500) {
          // If we already built procedural, remove it
          if (handPoints) {
            group.remove(handPoints)
            handGeo.dispose()
            handMat.dispose()
          }

          numHandParticles = validPoints.length
          handGeo = new THREE.BufferGeometry()
          initialPositions = new Float32Array(numHandParticles * 3)
          currentPositions = new Float32Array(numHandParticles * 3)
          velocities = new Float32Array(numHandParticles * 3)
          colors = new Float32Array(numHandParticles * 3)

          for (let i = 0; i < numHandParticles; i++) {
            const p = validPoints[i]
            initialPositions[i * 3] = p.x
            initialPositions[i * 3 + 1] = p.y
            initialPositions[i * 3 + 2] = p.z

            currentPositions[i * 3] = p.x
            currentPositions[i * 3 + 1] = p.y
            currentPositions[i * 3 + 2] = p.z

            velocities[i * 3] = (Math.random() - 0.5) * 5 + p.x * 0.6
            velocities[i * 3 + 1] = Math.random() * 6 + 3
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 6 + 2

            // Shimmer boosted color
            colors[i * 3] = Math.min(p.r * 1.25, 1)
            colors[i * 3 + 1] = Math.min(p.g * 1.3, 1)
            colors[i * 3 + 2] = Math.min(p.b * 1.35, 1)
          }

          handGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
          handGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

          handMat = new THREE.PointsMaterial({
            size: isMobile ? 0.22 : 0.28,
            map: glowTexture,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.95
          })

          handPoints = new THREE.Points(handGeo, handMat)
          group.add(handPoints)
        }
      } catch (err) {
        console.warn('Image point-cloud fallback active:', err)
      }
    }

    img.onerror = () => {
      // Procedural fallback already in place
    }

    buildProceduralHand()

    // 5. Mouse Interaction for Parallax Tilt
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      mouseX = (clientX / width - 0.5) * 2
      mouseY = (clientY / height - 0.5) * 2
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })

    // 6. Animation Timeline (Total ~1.35s)
    let startTime = performance.now()
    let animationFrameId
    let isFinished = false

    const animate = (now) => {
      animationFrameId = requestAnimationFrame(animate)

      const elapsed = (now - startTime) / 1000 // in seconds

      // Rotate group smoothly toward mouse
      targetRotationY = mouseX * 0.35
      targetRotationX = -mouseY * 0.25
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.08
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.08

      // Slow organic hover bobbing
      group.position.y = Math.sin(elapsed * 2.2) * 0.25
      group.position.z = Math.cos(elapsed * 1.8) * 0.15

      // Drift ambient bokeh particles
      const bPositions = bokehGeo.attributes.position.array
      for (let i = 0; i < bokehCount; i++) {
        bPositions[i * 3 + 1] += bokehSpeeds[i]
        if (bPositions[i * 3 + 1] > 12) {
          bPositions[i * 3 + 1] = -12
        }
      }
      bokehGeo.attributes.position.needsUpdate = true

      // Timeline phases:
      // 0.0s - 0.4s: Materialize & Pulse
      // 0.4s - 0.7s: Hold & Resonate
      // 0.7s - 1.3s: Particle Dispersion & Dissolution
      // 1.35s: Finish & Reveal Demo

      if (elapsed < 0.4) {
        const p = elapsed / 0.4
        setProgressPercent(Math.round(p * 35))
        if (handMat) handMat.opacity = THREE.MathUtils.lerp(0, 0.95, p)
      } else if (elapsed < 0.7) {
        setPhaseText('SYNCHRONIZING SANDBOX ENGINE')
        setProgressPercent(Math.round(35 + ((elapsed - 0.4) / 0.3) * 30))
        // Subtle rhythmic shimmer
        if (handMat) {
          handMat.size = (isMobile ? 0.22 : 0.28) + Math.sin(elapsed * 12) * 0.04
        }
      } else if (elapsed <= 1.35) {
        setPhaseText('MATERIALIZING LIVE DEMO')
        const dissolveT = (elapsed - 0.7) / 0.65 // 0.0 -> 1.0
        setProgressPercent(Math.round(65 + dissolveT * 35))

        if (handGeo && currentPositions && velocities) {
          const posArray = handGeo.attributes.position.array
          const colArray = handGeo.attributes.color.array

          for (let i = 0; i < numHandParticles; i++) {
            const i3 = i * 3
            // Particles lift and swirl outward
            const ease = dissolveT * dissolveT
            posArray[i3] = initialPositions[i3] + velocities[i3] * ease * 1.8
            posArray[i3 + 1] = initialPositions[i3 + 1] + velocities[i3 + 1] * ease * 2.2
            posArray[i3 + 2] = initialPositions[i3 + 2] + velocities[i3 + 2] * ease * 1.8

            // Shift towards brilliant champagne gold as they dissolve
            colArray[i3] = Math.min(colArray[i3] + dissolveT * 0.5, 1.0)
            colArray[i3 + 1] = Math.min(colArray[i3 + 1] + dissolveT * 0.25, 0.95)
            colArray[i3 + 2] = Math.max(colArray[i3 + 2] - dissolveT * 0.3, 0.2)
          }

          handGeo.attributes.position.needsUpdate = true
          handGeo.attributes.color.needsUpdate = true
        }

        if (handMat) {
          handMat.opacity = THREE.MathUtils.lerp(0.95, 0.0, dissolveT)
        }
        bokehMat.opacity = THREE.MathUtils.lerp(0.6, 0.0, dissolveT)
      } else {
        if (!isFinished) {
          isFinished = true
          if (onComplete) onComplete()
        }
      }

      renderer.render(scene, camera)
    }

    animationFrameId = requestAnimationFrame(animate)

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || window.innerWidth
      height = container.clientHeight || window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Keyboard listener for instant skip (Esc or Space)
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault()
        if (onSkip) onSkip()
        else if (onComplete) onComplete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // 7. Cleanup & Resource Disposal (Zero Memory Leak)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)

      // Thorough WebGL disposal
      if (handGeo) handGeo.dispose()
      if (handMat) handMat.dispose()
      if (bokehGeo) bokehGeo.dispose()
      if (bokehMat) bokehMat.dispose()
      if (glowTexture) glowTexture.dispose()

      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [onComplete, onSkip, project])

  return (
    <div
      className="particle-hand-stage"
      onClick={onSkip || onComplete}
      title="Click or press Space / Esc to skip reveal"
    >
      <div ref={mountRef} className="particle-hand-canvas-wrap" />

      {/* Cybernetic Telemetry Overlay */}
      <div className="particle-hand-hud">
        <div className="particle-hand-badge">
          <span className="particle-hand-badge-pulse" />
          <span>CYBERNETIC RUNTIME // QUANTUM REVEAL</span>
        </div>

        <h3 className="particle-hand-title">
          {project?.title || 'Interactive System'}
        </h3>

        <div className="particle-hand-status-row">
          <span className="particle-hand-phase">{phaseText}</span>
          <span className="particle-hand-percent">{progressPercent}%</span>
        </div>

        <div className="particle-hand-progress-bar">
          <div
            className="particle-hand-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="particle-hand-skip-hint">
          <span>Click anywhere or press </span>
          <kbd>Space</kbd>
          <span> to skip directly</span>
        </div>
      </div>
    </div>
  )
}
