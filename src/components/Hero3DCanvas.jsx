import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Hero3DCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth <= 768

    let width = container.clientWidth || window.innerWidth
    let height = container.clientHeight || window.innerHeight

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 24

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 2. Lighting (Editorial Warm Gold + Ambient)
    const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.8)
    scene.add(ambientLight)

    const goldPointLight = new THREE.PointLight(0xc8a45d, 2.5, 50)
    goldPointLight.position.set(12, 10, 15)
    scene.add(goldPointLight)

    const softFillLight = new THREE.PointLight(0xd9b875, 1.5, 40)
    softFillLight.position.set(-14, -8, 10)
    scene.add(softFillLight)

    // 3. Gold Floating Particles
    const particleCount = isMobile ? 65 : 180
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleScales = new Float32Array(particleCount)
    const particleSpeeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 36
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 26
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20
      particleScales[i] = Math.random() * 0.8 + 0.3
      particleSpeeds[i] = Math.random() * 0.005 + 0.002
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1))

    // Canvas particle texture for smooth round gold dust
    const makeParticleTexture = () => {
      const c = document.createElement('canvas')
      c.width = 32
      c.height = 32
      const ctx = c.getContext('2d')
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, 'rgba(217, 184, 117, 1)')
      grad.addColorStop(0.4, 'rgba(200, 164, 93, 0.7)')
      grad.addColorStop(1, 'rgba(200, 164, 93, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 32, 32)
      return new THREE.CanvasTexture(c)
    }

    const particleTexture = makeParticleTexture()
    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // 4. Floating 3D Geometric Accents (Luxury Wireframe Icosahedron & Orbit Rings)
    const group = new THREE.Group()
    scene.add(group)

    // Wireframe Icosahedron (symbol of computational structure & multi-agent systems)
    const icoGeo = new THREE.IcosahedronGeometry(3.8, 1)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xc8a45d,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    })
    const icosahedron = new THREE.Mesh(icoGeo, icoMat)
    icosahedron.position.set(11.0, 3.2, -6)
    group.add(icosahedron)

    // Second smaller inner core
    const innerGeo = new THREE.OctahedronGeometry(2.0, 0)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xd9b875,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    })
    const innerOcta = new THREE.Mesh(innerGeo, innerMat)
    innerOcta.position.copy(icosahedron.position)
    group.add(innerOcta)

    // Elegant orbital rings
    const ringGeo1 = new THREE.TorusGeometry(5.8, 0.02, 16, 100)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xc8a45d,
      transparent: true,
      opacity: 0.3
    })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    ring1.position.copy(icosahedron.position)
    ring1.rotation.x = Math.PI / 3
    group.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(6.4, 0.015, 16, 100)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xd9b875,
      transparent: true,
      opacity: 0.2
    })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.position.copy(icosahedron.position)
    ring2.rotation.y = Math.PI / 4
    ring2.rotation.x = -Math.PI / 5
    group.add(ring2)

    // 5. Mouse Interaction & Parallax
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = -(e.clientY / window.innerHeight) * 2 + 1
      targetX = normX * 1.8
      targetY = normY * 1.2
    }

    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    // 6. Resize handler
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || window.innerWidth
      height = container.clientHeight || window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // 7. Visibility Observer (Pause when off-screen)
    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.05 })
    observer.observe(container)

    // 8. Animation Loop
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        // Smooth camera lerp towards mouse target
        currentX += (targetX - currentX) * 0.05
        currentY += (targetY - currentY) * 0.05
        camera.position.x = currentX * 1.5
        camera.position.y = currentY * 1.0
        camera.lookAt(0, 0, 0)

        // Rotate geometric shapes
        icosahedron.rotation.x += 0.12 * delta
        icosahedron.rotation.y += 0.18 * delta
        innerOcta.rotation.x -= 0.22 * delta
        innerOcta.rotation.y -= 0.15 * delta
        ring1.rotation.z += 0.08 * delta
        ring2.rotation.z -= 0.06 * delta

        // Subtle breathing float on group
        group.position.y = Math.sin(time * 0.8) * 0.35

        // Gently drift particles
        const posAttr = particleGeo.attributes.position
        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i)
          y += particleSpeeds[i]
          if (y > 14) y = -14
          posAttr.setY(i, y)
        }
        posAttr.needsUpdate = true
        particles.rotation.y = time * 0.02
      }

      renderer.render(scene, camera)
    }

    animate()

    // 9. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      // Dispose Three.js objects
      particleGeo.dispose()
      particleMat.dispose()
      particleTexture.dispose()
      icoGeo.dispose()
      icoMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      ringGeo1.dispose()
      ringMat1.dispose()
      ringGeo2.dispose()
      ringMat2.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="hero__3d-canvas"
      aria-hidden="true"
    />
  )
}

