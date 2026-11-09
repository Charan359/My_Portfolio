import React, { useRef, useEffect, useState } from 'react'

export default function MarkovLatticeCanvas() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [isInteractive, setIsInteractive] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth <= 768

    const ctx = canvas.getContext('2d')
    let animId
    let isVisible = true
    let width = container.clientWidth || 600
    let height = container.clientHeight || 320

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      if (!container || !canvas) return
      width = container.clientWidth || 600
      height = container.clientHeight || 320
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    }, { threshold: 0.1 })
    observer.observe(container)

    window.addEventListener('resize', resize)

    // 3D Nodes Definition
    const nodes = [
      { id: 'A0', label: 'User Agent (A₀)', role: 'Prompt Ingestion', level: 'L₀ Public', x: -160, y: -30, z: 0, color: '#c9a96e', radius: 10 },
      { id: 'A1', label: 'Reasoning LLM (A₁)', role: 'Multi-Agent Core', level: 'L₁ Internal', x: -60, y: 50, z: 50, color: '#e0c594', radius: 11 },
      { id: 'A2', label: 'Tool Caller (A₂)', role: 'API / Environment', level: 'L₁ Internal', x: 60, y: -60, z: -40, color: '#c9a96e', radius: 10 },
      { id: 'MED', label: 'PrivAgentShield (LRI*)', role: 'Runtime Policy Mediator', level: 'Minimax Clearance', x: 0, y: 5, z: 0, color: '#00e676', radius: 14, isMediator: true },
      { id: 'SINK', label: 'Absorbing Leak Sink (Ω)', role: 'Mitigated Attack Vector', level: 'L₂ Restricted', x: 160, y: 65, z: 60, color: '#ff5252', radius: 12, isSink: true },
      { id: 'SAFE', label: 'Sanitized Output (τ)', role: 'Safe Goal Completion', level: 'Egress Verified', x: 170, y: -65, z: -30, color: '#4caf50', radius: 12, isSafe: true }
    ]

    const edges = [
      { from: 'A0', to: 'A1', label: 'P₀₁ = 0.95', weight: 1.5, color: 'rgba(201, 169, 110, 0.45)' },
      { from: 'A1', to: 'MED', label: 'P₁ₘ = 1.00', weight: 2.2, color: 'rgba(0, 230, 118, 0.65)' },
      { from: 'MED', to: 'A2', label: 'Pₘ₂ = 0.88', weight: 1.8, color: 'rgba(201, 169, 110, 0.55)' },
      { from: 'A2', to: 'MED', label: 'Feedback', weight: 1.2, color: 'rgba(201, 169, 110, 0.35)' },
      { from: 'MED', to: 'SINK', label: 'P(Ω) Blocked (65.0%)', weight: 2.0, color: 'rgba(255, 82, 82, 0.65)' },
      { from: 'MED', to: 'SAFE', label: 'P(τ) Preserved (74.2%)', weight: 2.0, color: 'rgba(76, 175, 80, 0.65)' }
    ]

    // Flowing packets
    const packets = [
      { edgeIdx: 0, progress: 0.1, speed: 0.008, color: '#c9a96e' },
      { edgeIdx: 1, progress: 0.6, speed: 0.012, color: '#00e676' },
      { edgeIdx: 2, progress: 0.3, speed: 0.009, color: '#c9a96e' },
      { edgeIdx: 4, progress: 0.8, speed: 0.014, color: '#ff5252' },
      { edgeIdx: 5, progress: 0.4, speed: 0.011, color: '#4caf50' }
    ]

    let rotY = 0
    let rotX = 0.1
    let targetRotY = 0
    let targetRotX = 0.1
    let mouseX = 0
    let mouseY = 0
    let isHovering = false

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseX = e.clientX - rect.left - width / 2
      mouseY = e.clientY - rect.top - height / 2
      isHovering = true
      targetRotY = (mouseX / (width / 2)) * 0.45
      targetRotX = -(mouseY / (height / 2)) * 0.3
    }

    const handleMouseLeave = () => {
      isHovering = false
      targetRotX = 0.1
      setHoveredNode(null)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Render loop
    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      // Perspective projection
      if (!prefersReducedMotion && !isMobile) {
        if (!isHovering) {
          targetRotY += 0.0025
        }
        rotY += (targetRotY - rotY) * 0.06
        rotX += (targetRotX - rotX) * 0.06
      }

      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      const fov = 380
      const centerX = width / 2
      const centerY = height / 2

      // Project nodes
      const projected = nodes.map((node) => {
        // Rotate around Y
        let x1 = node.x * cosY - node.z * sinY
        let z1 = node.z * cosY + node.x * sinY
        // Rotate around X
        let y1 = node.y * cosX - z1 * sinX
        let z2 = z1 * cosX + node.y * sinX

        const scale = fov / (fov + z2 + 100)
        const projX = centerX + x1 * scale
        const projY = centerY + y1 * scale

        return {
          ...node,
          projX,
          projY,
          projScale: scale,
          depth: z2
        }
      })

      // Sort by depth (painter's algorithm)
      const nodeMap = {}
      projected.forEach((p) => { nodeMap[p.id] = p })

      // Check hover
      if (isHovering) {
        let found = null
        for (const p of projected) {
          const dx = mouseX + centerX - p.projX
          const dy = mouseY + centerY - p.projY
          if (Math.hypot(dx, dy) < p.radius * p.projScale * 1.6) {
            found = p
            break
          }
        }
        setHoveredNode(found)
      }

      // 1. Draw clearance lattice backdrop grid lines
      ctx.save()
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.08)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      ;[-80, 0, 80].forEach((yOffset) => {
        ctx.beginPath()
        ctx.moveTo(centerX - 240, centerY + yOffset)
        ctx.lineTo(centerX + 240, centerY + yOffset)
        ctx.stroke()
      })
      ctx.restore()

      // 2. Draw Edges
      edges.forEach((edge) => {
        const from = nodeMap[edge.from]
        const to = nodeMap[edge.to]
        if (!from || !to) return

        ctx.save()
        ctx.strokeStyle = edge.color
        ctx.lineWidth = edge.weight * Math.min(from.projScale, to.projScale)
        ctx.beginPath()
        ctx.moveTo(from.projX, from.projY)
        ctx.lineTo(to.projX, to.projY)
        ctx.stroke()

        // Edge label (subtle)
        if (width > 480 && !prefersReducedMotion) {
          const midX = (from.projX + to.projX) / 2
          const midY = (from.projY + to.projY) / 2
          ctx.font = '9px monospace'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
          ctx.textAlign = 'center'
          ctx.fillText(edge.label, midX, midY - 4)
        }
        ctx.restore()
      })

      // 3. Draw Moving Packets
      if (!prefersReducedMotion) {
        packets.forEach((pkt) => {
          const edge = edges[pkt.edgeIdx]
          const from = nodeMap[edge.from]
          const to = nodeMap[edge.to]
          if (!from || !to) return

          pkt.progress += pkt.speed
          if (pkt.progress > 1) pkt.progress = 0

          const curX = from.projX + (to.projX - from.projX) * pkt.progress
          const curY = from.projY + (to.projY - from.projY) * pkt.progress

          ctx.save()
          ctx.fillStyle = pkt.color
          ctx.shadowColor = pkt.color
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(curX, curY, 3 * from.projScale, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })
      }

      // 4. Draw Nodes
      projected.sort((a, b) => a.depth - b.depth)
      projected.forEach((node) => {
        const r = node.radius * node.projScale
        const isHovered = hoveredNode && hoveredNode.id === node.id

        ctx.save()

        // Node Glow Ring
        ctx.beginPath()
        ctx.arc(node.projX, node.projY, r * (isHovered ? 2.2 : 1.6), 0, Math.PI * 2)
        ctx.fillStyle = node.color.replace(')', ', 0.15)').replace('rgb', 'rgba').replace('#c9a96e', 'rgba(201,169,110,0.18)').replace('#00e676', 'rgba(0,230,118,0.22)').replace('#ff5252', 'rgba(255,82,82,0.2)').replace('#4caf50', 'rgba(76,175,80,0.2)').replace('#e0c594', 'rgba(224,197,148,0.18)')
        ctx.fill()

        // Core Circle
        ctx.beginPath()
        ctx.arc(node.projX, node.projY, r, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.shadowColor = node.color
        ctx.shadowBlur = isHovered ? 16 : 8
        ctx.fill()

        // Stroke ring
        ctx.lineWidth = 1.5
        ctx.strokeStyle = '#ffffff'
        ctx.stroke()

        // Node Text Labels
        ctx.shadowBlur = 0
        ctx.font = `${Math.max(10, Math.floor(11 * node.projScale))}px -apple-system, sans-serif`
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.projX, node.projY + r + 14)

        ctx.font = '9px monospace'
        ctx.fillStyle = 'rgba(201, 169, 110, 0.85)'
        ctx.fillText(node.level, node.projX, node.projY + r + 25)

        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="markov-viz" ref={containerRef}>
      <div className="markov-viz__hud">
        <div className="markov-viz__badge">
          <span className="markov-viz__pulse"></span>
          <span>Springer Nature Research Model &bull; ICMMDU 2026 (ID: 190)</span>
        </div>
        <div className="markov-viz__formula">
          <code>LRI* = min max [ &Phi;(x) &bull; (1 - P(Sink|Mediator)) ]</code>
        </div>
      </div>

      <canvas ref={canvasRef} className="markov-viz__canvas" />

      {hoveredNode ? (
        <div className="markov-viz__tooltip">
          <div className="markov-viz__tooltip-header">
            <strong>{hoveredNode.label}</strong>
            <span className="markov-viz__tooltip-level">{hoveredNode.level}</span>
          </div>
          <div className="markov-viz__tooltip-desc">{hoveredNode.role}</div>
          <div className="markov-viz__tooltip-metric">
            {hoveredNode.isMediator && 'Latency: 1.66 ms | Minimax Clearance Dominance'}
            {hoveredNode.isSink && 'Leakage Mitigated: 65.0% Risk Reduction'}
            {hoveredNode.isSafe && 'Task Preservation: 74.2% Execution Verified'}
            {!hoveredNode.isMediator && !hoveredNode.isSink && !hoveredNode.isSafe && 'Dynamic Information Flow Control (IFC)'}
          </div>
        </div>
      ) : (
        <div className="markov-viz__hint">
          <span>Interactive Markov Reachability &bull; Drag / Hover nodes to inspect policy lattice</span>
        </div>
      )}

      <div className="markov-viz__metrics-bar">
        <div className="markov-viz__metric-item">
          <span className="markov-viz__metric-num">65.0%</span>
          <span className="markov-viz__metric-lbl">Privacy Leak Prevention</span>
        </div>
        <div className="markov-viz__metric-item">
          <span className="markov-viz__metric-num">74.2%</span>
          <span className="markov-viz__metric-lbl">Task Completion Kept</span>
        </div>
        <div className="markov-viz__metric-item">
          <span className="markov-viz__metric-num">1.66 ms</span>
          <span className="markov-viz__metric-lbl">Mean Runtime Latency</span>
        </div>
        <div className="markov-viz__metric-item">
          <span className="markov-viz__metric-num">31</span>
          <span className="markov-viz__metric-lbl">Benchmark Traces</span>
        </div>
      </div>
    </div>
  )
}

