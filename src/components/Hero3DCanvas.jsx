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
    const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.9)
    scene.add(ambientLight)

    const goldPointLight = new THREE.PointLight(0xc8a45d, 2.8, 60)
    goldPointLight.position.set(12, 10, 15)
    scene.add(goldPointLight)

    const softFillLight = new THREE.PointLight(0xd9b875, 1.8, 50)
    softFillLight.position.set(-14, -8, 10)
    scene.add(softFillLight)

    // 3. Gold Floating Dust & Ambient Particles (Across entire first page)
    const particleCount = isMobile ? 70 : 200
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleScales = new Float32Array(particleCount)
    const particleSpeeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 44
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 24
      particleScales[i] = Math.random() * 0.8 + 0.3
      particleSpeeds[i] = Math.random() * 0.005 + 0.002
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1))

    // Round radial gold gradient texture
    const makeParticleTexture = () => {
      const c = document.createElement('canvas')
      c.width = 32
      c.height = 32
      const ctx = c.getContext('2d')
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, 'rgba(217, 184, 117, 1)')
      grad.addColorStop(0.4, 'rgba(200, 164, 93, 0.75)')
      grad.addColorStop(1, 'rgba(200, 164, 93, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 32, 32)
      return new THREE.CanvasTexture(c)
    }

    const particleTexture = makeParticleTexture()
    const particleMat = new THREE.PointsMaterial({
      size: 0.48,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.78
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // 4. FLOATING 3D GEOMETRIC ELEMENTS (Floating all over the first page)
    
    // Group 1: Primary Floating Wireframe Core (Drifting across right/center)
    const primaryGroup = new THREE.Group()
    scene.add(primaryGroup)

    const icoGeo = new THREE.IcosahedronGeometry(3.6, 1)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xc8a45d,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    })
    const icosahedron = new THREE.Mesh(icoGeo, icoMat)
    primaryGroup.add(icosahedron)

    const innerGeo = new THREE.OctahedronGeometry(1.8, 0)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xd9b875,
      wireframe: true,
      transparent: true,
      opacity: 0.38
    })
    const innerOcta = new THREE.Mesh(innerGeo, innerMat)
    primaryGroup.add(innerOcta)

    const ringGeo1 = new THREE.TorusGeometry(5.2, 0.02, 16, 100)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xc8a45d,
      transparent: true,
      opacity: 0.32
    })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    ring1.rotation.x = Math.PI / 3
    primaryGroup.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(5.8, 0.015, 16, 100)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xd9b875,
      transparent: true,
      opacity: 0.22
    })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.rotation.y = Math.PI / 4
    ring2.rotation.x = -Math.PI / 5
    primaryGroup.add(ring2)

    // Group 2: Secondary Floating Wireframe Node (Drifting across left area)
    const secondaryGroup = new THREE.Group()
    scene.add(secondaryGroup)

    const dodecGeo = new THREE.DodecahedronGeometry(2.4, 0)
    const dodecMat = new THREE.MeshBasicMaterial({
      color: 0xc8a45d,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    })
    const dodecahedron = new THREE.Mesh(dodecGeo, dodecMat)
    secondaryGroup.add(dodecahedron)

    const secInnerGeo = new THREE.TetrahedronGeometry(1.2, 0)
    const secInnerMat = new THREE.MeshBasicMaterial({
      color: 0xd9b875,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    })
    const secInner = new THREE.Mesh(secInnerGeo, secInnerMat)
    secondaryGroup.add(secInner)

    const secRingGeo = new THREE.TorusGeometry(3.6, 0.015, 16, 80)
    const secRingMat = new THREE.MeshBasicMaterial({
      color: 0xc8a45d,
      transparent: true,
      opacity: 0.22
    })
    const secRing = new THREE.Mesh(secRingGeo, secRingMat)
    secRing.rotation.x = Math.PI / 2.5
    secondaryGroup.add(secRing)

    // Satellites: Floating crystalline polyhedra roaming across the first page
    const satellites = []
    const satGeos = [
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.TetrahedronGeometry(1.3, 0),
      new THREE.IcosahedronGeometry(1.0, 0),
      new THREE.OctahedronGeometry(0.8, 0)
    ]
    const satMat = new THREE.MeshBasicMaterial({
      color: 0xd9b875,
      wireframe: true,
      transparent: true,
      opacity: 0.24
    })

    const satConfigs = [
      { baseX: -14, baseY: 6, baseZ: -6, speed: 0.38, offset: 0.5, rotSpeed: 0.15 },
      { baseX: 13, baseY: -5, baseZ: -4, speed: 0.45, offset: 1.8, rotSpeed: 0.22 },
      { baseX: -8, baseY: -7, baseZ: -8, speed: 0.32, offset: 3.2, rotSpeed: 0.18 },
      { baseX: 8, baseY: 8, baseZ: -7, speed: 0.42, offset: 4.5, rotSpeed: 0.25 }
    ]

    satConfigs.forEach((cfg, idx) => {
      const satMesh = new THREE.Mesh(satGeos[idx % satGeos.length], satMat)
      satMesh.position.set(cfg.baseX, cfg.baseY, cfg.baseZ)
      scene.add(satMesh)
      satellites.push({ mesh: satMesh, ...cfg })
    })

    // 5. Mouse Interaction & Responsive Parallax
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = -(e.clientY / window.innerHeight) * 2 + 1
      targetX = normX * 2.2
      targetY = normY * 1.5
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

    // 7. Visibility Observer (Strictly pauses when off-screen / beyond first page)
    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.05 })
    observer.observe(container)

    // 8. Animation Loop — Floating all over the first page
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        // Smooth camera lerp with mouse movement
        currentX += (targetX - currentX) * 0.04
        currentY += (targetY - currentY) * 0.04
        camera.position.x = currentX * 1.6
        camera.position.y = currentY * 1.1
        camera.lookAt(0, 0, 0)

        // FLOAT 1: Primary Group floats all over right/center/top/bottom
        primaryGroup.position.x = 7 + Math.sin(time * 0.32) * 6 + Math.cos(time * 0.18) * 3
        primaryGroup.position.y = 1.5 + Math.cos(time * 0.42) * 3.8 + Math.sin(time * 0.22) * 1.5
        primaryGroup.position.z = -5 + Math.sin(time * 0.28) * 2.5

        icosahedron.rotation.x += 0.14 * delta
        icosahedron.rotation.y += 0.20 * delta
        innerOcta.rotation.x -= 0.24 * delta
        innerOcta.rotation.y -= 0.16 * delta
        ring1.rotation.z += 0.09 * delta
        ring2.rotation.z -= 0.07 * delta

        // FLOAT 2: Secondary Group floats all over left/center area
        secondaryGroup.position.x = -8 + Math.cos(time * 0.26) * 5 + Math.sin(time * 0.14) * 2.5
        secondaryGroup.position.y = -0.5 + Math.sin(time * 0.36) * 3.2 + Math.cos(time * 0.20) * 1.2
        secondaryGroup.position.z = -7 + Math.cos(time * 0.24) * 2.2

        dodecahedron.rotation.x -= 0.12 * delta
        dodecahedron.rotation.y += 0.18 * delta
        secInner.rotation.x += 0.22 * delta
        secRing.rotation.z += 0.08 * delta

        // FLOAT 3: Satellite Crystalline Nodes roaming across the first page
        satellites.forEach((sat) => {
          sat.mesh.position.y = sat.baseY + Math.sin(time * sat.speed + sat.offset) * 2.4
          sat.mesh.position.x = sat.baseX + Math.cos(time * sat.speed * 0.75 + sat.offset) * 1.8
          sat.mesh.position.z = sat.baseZ + Math.sin(time * sat.speed * 0.5 + sat.offset) * 1.5
          sat.mesh.rotation.x += sat.rotSpeed * delta
          sat.mesh.rotation.y += sat.rotSpeed * 1.4 * delta
        })

        // Drift gold dust particles across the entire first page
        const posAttr = particleGeo.attributes.position
        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i)
          y += particleSpeeds[i]
          if (y > 15) y = -15
          posAttr.setY(i, y)
        }
        posAttr.needsUpdate = true
        particles.rotation.y = time * 0.018
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

      // Dispose all Three.js geometries & materials cleanly
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

      dodecGeo.dispose()
      dodecMat.dispose()
      secInnerGeo.dispose()
      secInnerMat.dispose()
      secRingGeo.dispose()
      secRingMat.dispose()

      satGeos.forEach((g) => g.dispose())
      satMat.dispose()

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
