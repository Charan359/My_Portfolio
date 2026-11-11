import React, { useState, useEffect, useRef } from 'react'
import MarkovLatticeCanvas from './components/MarkovLatticeCanvas'
import Hero3DCanvas from './components/Hero3DCanvas'

export default function App() {
  const [preloaderProgress, setPreloaderProgress] = useState(0)
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)
  const [isNamePopping, setIsNamePopping] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeProjectIdx, setActiveProjectIdx] = useState(0)
  const [activeSkillCategory, setActiveSkillCategory] = useState('all')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sandboxProject, setSandboxProject] = useState(null)
  const [sandboxDevice, setSandboxDevice] = useState('desktop')
  const [sandboxKey, setSandboxKey] = useState(0)
  const [isSandboxLoading, setIsSandboxLoading] = useState(true)
  const [showPrivAgentViz, setShowPrivAgentViz] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Animated cycling designations for Hero section
  const designations = [
    'AI Engineer',
    'Data Science Developer',
    'Research Enthusiast',
    'Software Developer'
  ]
  const [designationIdx, setDesignationIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDesignationIdx((prev) => (prev + 1) % designations.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [designations.length])

  const handleOpenSandbox = (project) => {
    setSandboxProject(project)
    setSandboxDevice('desktop')
    setSandboxKey((prev) => prev + 1)
    setIsSandboxLoading(true)
  }

  const handleCloseSandbox = () => {
    setSandboxProject(null)
  }

  const handleDeviceChange = (device) => {
    setSandboxDevice(device)
  }

  const handleReloadSandbox = () => {
    setIsSandboxLoading(true)
    setSandboxKey((prev) => prev + 1)
  }

  const searchableItems = [
    { type: 'Section', title: 'About Me', desc: 'Background, Data Science degree & 8.41 CGPA', target: 'about' },
    { type: 'Section', title: 'Research & Publications', desc: 'Springer Nature Proceedings (ICMMDU 2026), Paper ID: 190, LRI* formulation', target: 'research' },
    { type: 'Section', title: 'Technical Skills', desc: 'Categorized matrix across 32 technologies', target: 'skills' },
    { type: 'Section', title: 'Featured Work', desc: '5 production projects & Springer Nature paper', target: 'work' },
    { type: 'Section', title: 'Education & Timeline', desc: 'Academic education, B.E. Data Science, Vibexathon & 6 certificates', target: 'timeline' },
    { type: 'Section', title: 'Get in Touch', desc: 'Direct email, contact form & verified socials', target: 'contact' },
    { type: 'Project', title: 'PrivAgentShield', desc: 'Policy-aware runtime mediation for multi-agent LLMs (Springer Nature)', target: 'privagentshield' },
    { type: 'Project', title: 'UrbanPulse AI', desc: 'Smart city platform with 15-language Voice AI & Leaflet overlays', target: 'urbanpulse' },
    { type: 'Project', title: 'WorldMonitor', desc: 'Automated cybersecurity vulnerability scanner (SIH 2026 Nominated)', target: 'worldmonitor' },
    { type: 'Project', title: 'DVR/NVR Forensic Analyzer', desc: 'Physical drive imaging & CCTV video carving (SIH 2026)', target: 'dvrnvr' },
    { type: 'Project', title: 'Blinkit Grocery Analytics', desc: 'Interactive Power BI performance & logistics dashboard ($1.20M analyzed)', target: 'groceryanalytics' },
    { type: 'Skill', title: 'Python & Machine Learning', desc: 'Data Science, Scikit-learn, Pandas, NumPy, Predictive Models', target: 'skills' },
    { type: 'Skill', title: 'React 19 & Full-Stack', desc: 'FastAPI, Flask, Tailwind CSS, Supabase, WebSockets', target: 'skills' },
    { type: 'Skill', title: 'Power BI & SQL', desc: 'DAX modeling, MySQL, MongoDB, Enterprise Dashboards', target: 'skills' },
    { type: 'Action', title: 'Download Resume (PDF)', desc: 'Official single-page PDF resume for Charan H S', action: () => window.open('/Charan_HS_Resume.pdf', '_blank') }
  ]

  const filteredSearchItems = searchableItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
  })

  const handleSelectSearchItem = (item) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    if (item.action) {
      item.action()
    } else if (item.target) {
      const el = document.getElementById(item.target)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('is-highlighted')
        setTimeout(() => el.classList.remove('is-highlighted'), 2200)
      }
    }
  }

  const copyEmailToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('charanhs359@gmail.com')
    }
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)
    const mailto = `mailto:charanhs359@gmail.com?subject=${encodeURIComponent(formState.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`From: ${formState.name} (${formState.email})\n\n${formState.message}`)}`
    window.location.href = mailto
    setTimeout(() => {
      setFormSubmitted(false)
      setFormState({ name: '', email: '', subject: '', message: '' })
    }, 4000)
  }

  const watermarkRef = useRef(null)
  const portraitWrapperRef = useRef(null)
  const tickerRef = useRef(null)

  // 1. Preloader logic
  useEffect(() => {
    let currentProgress = 0
    let timer

    const animateCounter = () => {
      const increment = Math.random() * 8 + 3
      currentProgress = Math.min(currentProgress + increment, 100)
      setPreloaderProgress(Math.floor(currentProgress))

      if (currentProgress < 100) {
        timer = setTimeout(animateCounter, 50 + Math.random() * 60)
      } else {
        setPreloaderProgress(100)
        setTimeout(() => {
          setIsPreloaderDone(true)
          document.body.classList.add('is-loaded')
          // Trigger name popping right as curtain reveals the hero section
          setTimeout(() => {
            setIsNamePopping(true)
          }, 350)
        }, 300)
      }
    }

    const initialDelay = setTimeout(animateCounter, 400)
    return () => {
      clearTimeout(initialDelay)
      clearTimeout(timer)
    }
  }, [])

  // Lock scroll when mobile menu, search dialog, or sandbox modal is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen || sandboxProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen, isSearchOpen, sandboxProject])

  // Global Ctrl+K / Cmd+K and Esc listener for Search Palette and Sandbox Modal
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMenuOpen(false)
        setSandboxProject(null)
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

  // Scrollspy & Back to Top listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 480)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const sections = [
      { id: 'hero-section', name: 'hero' },
      { id: 'about', name: 'about' },
      { id: 'research', name: 'research' },
      { id: 'skills', name: 'skills' },
      { id: 'work', name: 'work' },
      { id: 'timeline', name: 'timeline' },
      { id: 'contact', name: 'contact' }
    ]

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = sections.find((s) => s.id === entry.target.id)
          if (match) {
            setActiveSection(match.name)
          }
        }
      })
    }, {
      root: null,
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0.1
    })

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const replayNamePop = () => {
    setIsNamePopping(false)
    setTimeout(() => {
      setIsNamePopping(true)
    }, 60)
  }

  // 3. Parallax Watermark
  useEffect(() => {
    const handleWatermarkMove = (e) => {
      if (!watermarkRef.current) return
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2
      watermarkRef.current.style.transform = `translate(calc(-50% + ${xPercent * 20}px), calc(-50% + ${yPercent * 12}px))`
    }

    window.addEventListener('mousemove', handleWatermarkMove)
    return () => window.removeEventListener('mousemove', handleWatermarkMove)
  }, [])

  // 4. Portrait 3D tilt
  const handlePortraitMouseMove = (e) => {
    if (!portraitWrapperRef.current) return
    const rect = portraitWrapperRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * 8
    const tiltY = (x - 0.5) * -8

    portraitWrapperRef.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  }

  const handlePortraitMouseLeave = () => {
    if (!portraitWrapperRef.current) return
    portraitWrapperRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    portraitWrapperRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'
    setTimeout(() => {
      if (portraitWrapperRef.current) portraitWrapperRef.current.style.transition = ''
    }, 600)
  }

  // 5. Magnetic element effect
  const handleMagneticMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const strength = 0.3
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMagneticLeave = (e) => {
    const el = e.currentTarget
    el.style.transform = 'translate(0, 0)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    setTimeout(() => {
      el.style.transition = ''
    }, 500)
  }

  // 6. Ticker drag scroll
  useEffect(() => {
    const ticker = tickerRef.current
    if (!ticker) return

    let isDown = false
    let startX
    let scrollLeft

    const onMouseDown = (e) => {
      isDown = true
      startX = e.pageX - ticker.offsetLeft
      scrollLeft = ticker.scrollLeft
    }
    const onMouseLeave = () => { isDown = false }
    const onMouseUp = () => { isDown = false }
    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - ticker.offsetLeft
      const walk = (x - startX) * 1.5
      ticker.scrollLeft = scrollLeft - walk
    }

    ticker.addEventListener('mousedown', onMouseDown)
    ticker.addEventListener('mouseleave', onMouseLeave)
    ticker.addEventListener('mouseup', onMouseUp)
    ticker.addEventListener('mousemove', onMouseMove)

    return () => {
      ticker.removeEventListener('mousedown', onMouseDown)
      ticker.removeEventListener('mouseleave', onMouseLeave)
      ticker.removeEventListener('mouseup', onMouseUp)
      ticker.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  // 7. Arrow / Keyboard navigation & Ticker Projects (aligned with 5 featured projects)
  const tickerItems = [
    {
      id: "privagentshield",
      title: "PrivAgentShield",
      sub: "springer nature paper ›",
      img: "/privagentshield-screen.png"
    },
    {
      id: "urbanpulse",
      title: "UrbanPulse AI",
      sub: "smart city platform ›",
      img: "/urbanpulse-screen.png"
    },
    {
      id: "worldmonitor",
      title: "WorldMonitor",
      sub: "cybersecurity suite ›",
      img: "/worldmonitor-screen.png"
    },
    {
      id: "dvrnvr",
      title: "DVR/NVR Forensics",
      sub: "video carver (SIH) ›",
      img: "/dvrnvr-screen.png"
    },
    {
      id: "groceryanalytics",
      title: "Blinkit Analytics",
      sub: "power bi ($1.20M) ›",
      img: "/groceryanalytics-screen.png"
    }
  ]

  // Task 3: Projects & Research Showcase Data
  const projectsData = [
    {
      id: 'privagentshield',
      number: '01',
      category: 'Research Spotlight • Springer Nature',
      title: 'PrivAgentShield',
      tagline: 'Policy-Aware Runtime Mediation for Multi-Agent LLMs',
      role: 'First Author & Lead Architect',
      venue: 'Accepted for Springer Nature Proceedings • ICMMDU 2026 (Paper ID: 190)',
      description: 'Formulated non-compensatory minimax Leakage Risk Index (LRI*) unifying payload sensitivity, lattice clearance dominance, and absorbing Markov reachability for multi-agent LLM systems to mitigate sensitive data leakage without model retraining.',
      bullets: [
        'Achieved 65.0% privacy leakage prevention and 74.2% task completion preservation.',
        '1.66 ms mean runtime latency across 31 empirical benchmark execution traces.',
        'Dynamic Information Flow Control (IFC) coupled with Attribute-Based Access Control (ABAC).'
      ],
      tech: ['Python', 'IFC / ABAC', 'Markov Reachability', 'LLM Security', 'FastAPI'],
      liveUrl: 'https://priv-agent-shield-bice.vercel.app/',
      repoUrl: 'https://github.com/Charan359',
      screenshot: '/privagentshield-screen.png',
      featured: true,
      hasLiveSandbox: true,
      browserUrl: 'priv-agent-shield-bice.vercel.app',
      metrics: { primary: '1.66 ms', label: 'Runtime Latency', badge: 'Springer Nature' }
    },
    {
      id: 'urbanpulse',
      number: '02',
      category: 'Smart City & Voice AI Platform',
      title: 'UrbanPulse AI',
      tagline: 'Urban Intelligence & Accessible Multilingual Pedestrian Navigation',
      role: 'Team Lead • 13 Core Modules',
      venue: 'Production Smart City Infrastructure Platform',
      description: 'An AI-powered smart city platform engineered with 13 specialized modules addressing urban heat islands, air pollution, women safety, and accessibility navigation.',
      bullets: [
        'Multi-factor 6-way route optimization evaluating 14 parameters (thermal comfort, AQI, pedestrian safety).',
        'Engineered voice-first talkback navigation in 15 Indian & global languages via Web Speech API & Groq Llama 3.1.',
        'Interactive sensor fusion dashboards with zero-external-key live Leaflet & OpenStreetMap overlays.'
      ],
      tech: ['React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Groq (Llama 3.1)', 'Leaflet'],
      liveUrl: 'https://urbanpulse-ai.netlify.app/',
      repoUrl: 'https://github.com/Charan359/UrbanPulse_AI',
      screenshot: '/urbanpulse-screen.png',
      featured: false,
      hasLiveSandbox: true,
      browserUrl: 'urbanpulse-ai.netlify.app',
      metrics: { primary: '15 Langs', label: 'Voice AI Engine', badge: '13 Live Modules' }
    },
    {
      id: 'worldmonitor',
      number: '03',
      category: 'Cybersecurity Assessment Platform',
      title: 'WorldMonitor',
      tagline: 'Automated Vulnerability Scanner & Security Correlation Engine',
      role: 'Full-Stack Developer • SIH 2026 Nominated Solution',
      venue: 'Smart India Hackathon 2026 Selection Track',
      description: 'Full-stack vulnerability assessment platform comprising 7 specialized security scanning engines inspecting authentication, authorization (BOLA/IDOR), API endpoints, and database privacy controls.',
      bullets: [
        'Engineered hybrid SAST + DAST correlation using Semgrep AST parsing and differential response analysis.',
        'Cryptographic SHA-256 evidence hashing guaranteeing tamper-proof chain of custody on test logs.',
        'Real-time scan event streaming over WebSockets with automated remediation recommendations.'
      ],
      tech: ['FastAPI', 'Python', 'React', 'Semgrep AST', 'WebSockets', 'SHA-256', 'REST APIs'],
      liveUrl: 'https://securix-world-monitor.vercel.app/',
      repoUrl: 'https://github.com/Charan359/WorldMonitor',
      screenshot: '/worldmonitor-screen.png',
      featured: false,
      hasLiveSandbox: true,
      browserUrl: 'securix-world-monitor.vercel.app',
      metrics: { primary: '7 Engines', label: 'SAST + DAST', badge: 'SIH 2026 Finalist' }
    },
    {
      id: 'dvrnvr',
      number: '04',
      category: 'Digital Forensics & Video Carving',
      title: 'DVR/NVR Forensic Analyzer',
      tagline: 'Physical Disk Imaging & Proprietary CCTV Video Stream Carving',
      role: 'Lead Developer • Problem Statement SIH26150',
      venue: 'Smart India Hackathon 2026 Nominated Solution',
      description: 'Interactive digital forensics suite simulating physical drive acquisition, software write-blocking, bit-by-bit imaging, and proprietary CCTV file system parsing (DHFS, WFS, RSFS).',
      bullets: [
        'Automated video carving algorithms recovering fragmented H.264/H.265 streams from unallocated disk space.',
        'Timestamp timeline reconstruction and automated hash validation following ISO/IEC 27037 standards.',
        'Forensic report generation with tamper-evident audit trails.'
      ],
      tech: ['JavaScript', 'HTML5', 'CSS3', 'Forensic Data Structures', 'SHA-256 Hashing', 'ISO/IEC 27037'],
      liveUrl: 'https://dvr-nvr-forensic-analyzer.vercel.app/',
      repoUrl: 'https://github.com/Charan359/DVR-NVR-Forensic-Analyzer',
      screenshot: '/dvrnvr-screen.png',
      featured: false,
      hasLiveSandbox: true,
      browserUrl: 'dvr-nvr-forensic-analyzer.vercel.app',
      metrics: { primary: 'ISO/IEC 27037', label: 'Chain of Custody', badge: 'SIH26150 Nominee' }
    },
    {
      id: 'groceryanalytics',
      number: '05',
      category: 'Business Intelligence & Operations',
      title: 'Blinkit Grocery Analytics',
      tagline: 'Interactive Retail Performance & Quick Commerce Logistics Intelligence',
      role: 'Data Analyst & BI Developer',
      venue: 'Enterprise Data Modeling Case Study',
      description: 'Developed an end-to-end interactive Power BI dashboard analyzing $1.20M (Rs. 12.01 Lakhs) in cumulative sales across 1,559 items to optimize inventory distribution, outlet tiers (Tier 1-3), and fulfillment logistics.',
      bullets: [
        'Designed comprehensive DAX data models tracking outlet sizes (Medium, Small, High), location tiers (Tier 1-3), and revenue.',
        'Evaluated item category profitability across fruits & vegetables, snacks, household essentials, and dairy.',
        'Built executive KPI summaries with average sales ($140.99) and satisfaction ratings (3.92 / 5.0).'
      ],
      tech: ['Power BI', 'Microsoft Excel', 'Data Analytics', 'DAX Formulas', 'Data Modeling & Visualization'],
      liveUrl: 'https://github.com/Charan359/Grocery-Delivery-Analytics',
      repoUrl: 'https://github.com/Charan359/Grocery-Delivery-Analytics',
      screenshot: '/groceryanalytics-screen.png',
      featured: false,
      hasLiveSandbox: false,
      browserUrl: 'github.com/Charan359/Grocery-Delivery-Analytics',
      metrics: { primary: '$1.20M', label: 'Total Sales', badge: '1,559 Items • 3.92★' }
    }
  ]

  // Task 4: Education, Leadership & Certifications
  const educationData = [
    {
      period: '2024 — 2028 (Expected)',
      degree: 'Bachelor of Engineering — Computer Science (Data Science)',
      institution: 'Nagarjuna College of Engineering and Technology, Bengaluru',
      score: '8.41 CGPA (4th Semester)',
      description: 'Specializing in machine learning systems, database architectures, and algorithmic optimization. Actively involved in campus research and state hackathons.',
      highlights: ['Data Structures & Algorithms', 'Database Systems (SQL & NoSQL)', 'Machine Learning', 'Computer Networks']
    },
    {
      period: '2022 — 2024',
      degree: 'Senior Secondary (12th Grade) — CBSE',
      institution: 'Sri Chaitanya Techno School, Karnataka',
      score: '80.8%',
      description: 'Pre-university grounding in Computer Science, Mathematics, Physics, and Chemistry with rigorous analytical training.',
      highlights: ['Computer Science', 'Mathematics', 'Physics', 'Problem Solving']
    }
  ]

  const leadershipData = [
    {
      title: 'Coordinator — Vibexathon 1.0 (State-Level Hackathon)',
      org: 'Dept. of CSE (Data Science) & IEEE NCET',
      date: '16–17 March 2026',
      badge: 'Official Recognition',
      desc: 'Recognized with official Certificate of Appreciation for leadership and end-to-end event management of a 24-hour State-Level Hackathon with 200+ participants.'
    },
    {
      title: 'Nominated Finalist — Smart India Hackathon (SIH 2026)',
      org: 'Ministry of Education & NCET Innovation Cell',
      date: 'National Selection',
      badge: 'Dual-Track Nominee',
      desc: 'Qualified internal selection rounds and nominated across two distinct problem statements: Automated Web Security Scanner and Forensic Video Carving.'
    },
    {
      title: 'First-Author International Research Acceptance',
      org: 'ICMMDU 2026 • Springer Nature Proceedings',
      date: 'Paper ID: 190',
      badge: 'Springer Nature Accepted',
      desc: 'Original research paper on runtime privacy mediation for multi-agent LLM systems accepted for publication in Springer Nature conference proceedings.'
    }
  ]

  const certificationsData = [
    {
      title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations',
      issuer: 'Oracle Cloud',
      code: 'OCI-AI-2025',
      desc: 'Validated core competence in AI architectures, ML workloads, generative models, and OCI infrastructure services.'
    },
    {
      title: '30 Days MasterClass in Data Analytics',
      issuer: 'NoviTech R&D',
      code: 'Industry Training',
      desc: 'Hands-on training in exploratory data analysis (EDA), business intelligence metrics, and visual analytics.'
    },
    {
      title: 'Applied Database Systems 23ai',
      issuer: 'Oracle Academy',
      code: 'Database 23ai',
      desc: 'Proficiency in modern AI-integrated relational and JSON database schemas, query optimization, and advanced SQL.'
    },
    {
      title: 'Python Essentials 1',
      issuer: 'Cisco Networking Academy',
      code: 'Cisco Certified',
      desc: 'Mastery of core procedural Python, algorithmic problem solving, string manipulation, and data structures.'
    },
    {
      title: 'Software Engineering & ALM / Agile & DevOps',
      issuer: 'Infosys Springboard',
      code: 'Infosys Enterprise',
      desc: 'Enterprise training in software development lifecycle (SDLC), Agile Scrum methodologies, and CI/CD workflows.'
    },
    {
      title: 'Java Fundamentals',
      issuer: 'Oracle Academy',
      code: 'Java Foundations',
      desc: 'Comprehensive grounding in object-oriented programming, inheritance, polymorphism, and Java standard libraries.'
    }
  ]

  // Task 2: Categorized Skill Matrix with Contextual Verification & Project Proof
  const skillCategories = [
    {
      id: 'languages',
      title: 'Programming & Core Foundations',
      subtitle: 'Algorithmic problem-solving and systems design',
      iconType: 'code',
      badge: 'Core Languages',
      skills: [
        { name: 'Python', proof: 'PrivAgentShield & LRI*', tag: 'Research Math & FastAPI' },
        { name: 'Java', proof: 'Oracle Certified', tag: 'OOP & Modular Architecture' },
        { name: 'C', proof: 'Systems Programming', tag: 'Memory & Bitwise Operations' },
        { name: 'C++', proof: 'NCET Data Science', tag: 'DSA & Algorithmic Optimization' },
        { name: 'JavaScript (ES6+)', proof: 'UrbanPulse AI', tag: 'Async Engine & Reactive State' },
        { name: 'SQL', proof: 'Oracle 23ai Certified', tag: 'Relational Modeling & Query Tuning' },
        { name: 'Data Structures & Algorithms', proof: '8.41 CGPA Core', tag: 'O(n log n) Complexity Tuning' },
        { name: 'Object-Oriented Design', proof: 'Production Architect', tag: 'Design Patterns & Clean Code' },
      ]
    },
    {
      id: 'ai',
      title: 'AI, Machine Learning & Analytics',
      subtitle: 'Predictive modeling, statistical insights and LLM engineering',
      iconType: 'ai',
      badge: 'AI & Data Intelligence',
      skills: [
        { name: 'Machine Learning', proof: 'Springer Nature Paper', tag: 'Minimax & Predictive Modeling' },
        { name: 'Scikit-learn', proof: 'Empirical Benchmark', tag: '31 Traces Baseline Evaluation' },
        { name: 'Pandas', proof: 'Data Science Core', tag: 'High-Volume Trace Wrangling' },
        { name: 'NumPy', proof: 'LRI* Math Formulation', tag: 'Vectorized Matrix Computing' },
        { name: 'Power BI', proof: 'Enterprise Analytics', tag: '₹ 12.01L Sales Data Modeling' },
        { name: 'DAX & Data Modeling', proof: 'BI Case Study', tag: 'Star Schema & 1,559 SKUs KPIs' },
        { name: 'Matplotlib & Seaborn', proof: 'Research Spotlight', tag: 'Statistical EDA & Visual Analytics' },
        { name: 'Advanced Excel', proof: 'NoviTech MasterClass', tag: 'Financial Slicers & Regression' },
        { name: 'Groq & LLM APIs', proof: 'UrbanPulse Voice AI', tag: 'Llama 3.1 & 15-Lang Inference' },
      ]
    },
    {
      id: 'web',
      title: 'Full-Stack & Web Engineering',
      subtitle: 'Modern reactive interfaces and robust backend microservices',
      iconType: 'web',
      badge: 'Web & API Stacks',
      skills: [
        { name: 'React 19', proof: 'Production Deployed', tag: 'UrbanPulse AI & Modern SPAs' },
        { name: 'FastAPI', proof: 'WorldMonitor Suite', tag: 'Async REST & OpenAPI Schema' },
        { name: 'Flask', proof: 'Microservice Core', tag: 'Lightweight Backend Microservices' },
        { name: 'Tailwind CSS', proof: 'Luxe UI Systems', tag: 'Responsive Design & Dynamic Themes' },
        { name: 'HTML5 & CSS3', proof: 'Pixel Precision', tag: 'CSS 3D Transforms & Web Standards' },
        { name: 'RESTful API Architecture', proof: 'Enterprise Standard', tag: 'JSON Endpoint Specification' },
        { name: 'WebSockets', proof: 'WorldMonitor Realtime', tag: 'Bidirectional Scan Streaming' },
      ]
    },
    {
      id: 'tools',
      title: 'Databases, Cloud & Security',
      subtitle: 'Resilient data persistence, cloud infrastructure and verification',
      iconType: 'security',
      badge: 'Infra & Forensic Tools',
      skills: [
        { name: 'MySQL', proof: 'ACID Relational', tag: 'Relational Schemas & Indexing' },
        { name: 'MongoDB', proof: 'Document Store', tag: 'Aggregation & JSON Pipelines' },
        { name: 'Supabase', proof: 'Live UrbanPulse DB', tag: 'PostgreSQL Realtime & Auth' },
        { name: 'Oracle Cloud (OCI)', proof: 'Certified 2025', tag: 'OCI AI Foundations & Infrastructure' },
        { name: 'Git & GitHub', proof: 'Daily Open Source', tag: 'Version Control & GitHub Actions' },
        { name: 'Linux & Bash', proof: 'Terminal Native', tag: 'CLI Scripting & Disk Forensic Env' },
        { name: 'Jupyter Notebook', proof: 'EDA & Prototyping', tag: 'Interactive Data Science Sandbox' },
        { name: 'SHA-256 Forensics', proof: 'SIH 2026 Nominated', tag: 'ISO/IEC 27037 Evidence Integrity' },
      ]
    }
  ]

  const handlePrev = () => {
    setActiveProjectIdx((prev) => (prev > 0 ? prev - 1 : tickerItems.length - 1))
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: -220, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    setActiveProjectIdx((prev) => (prev < tickerItems.length - 1 ? prev + 1 : 0))
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: 220, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleTickerClick = (index, projectId) => {
    setActiveProjectIdx(index)
    if (projectId) {
      const el = document.getElementById(projectId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('is-highlighted')
        setTimeout(() => el.classList.remove('is-highlighted'), 2200)
      }
    }
  }

  const handleScrollClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const renderCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'code':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        )
      case 'ai':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        )
      case 'web':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        )
      case 'security':
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        )
    }
  }

  return (
    <>
      {/* 1. Cinematic Preloader */}
      <div className={`preloader ${isPreloaderDone ? 'is-done' : ''}`} id="preloader">
        <div className="preloader__inner">
          <div className="preloader__text">
            {['W', 'E', 'L', 'C', 'O', 'M', 'E'].map((char, i) => (
              <span key={i} className="preloader__letter" style={{ '--i': i }}>
                {char}
              </span>
            ))}
          </div>
          <div className="preloader__line"></div>
          <div className="preloader__counter" id="preloader-counter">
            {preloaderProgress}
          </div>
        </div>
      </div>

      {/* 3. Film Grain Overlay */}
      <div className="grain" aria-hidden="true"></div>

      {/* 4. Main Hero Section */}
      <main className="hero" id="hero-section">
        {/* Navigation */}
        <nav className="nav" id="main-nav">
          <div className="nav__logo" id="nav-logo">
            <span className="nav__logo-text" data-reveal>charan</span>
            <span className="nav__logo-dot"></span>
          </div>
          <div className="nav__center" id="nav-center">
            <a
              href="#about"
              className={`nav__link ${activeSection === 'about' ? 'is-active' : ''}`}
              data-magnetic
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              About
            </a>
            <a
              href="#research"
              className={`nav__link nav__link--research ${activeSection === 'research' ? 'is-active' : ''}`}
              data-magnetic
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              Research
            </a>
            <a
              href="#skills"
              className={`nav__link ${activeSection === 'skills' ? 'is-active' : ''}`}
              data-magnetic
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              Skills
            </a>
            <a
              href="#work"
              className={`nav__link ${activeSection === 'work' ? 'is-active' : ''}`}
              data-magnetic
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              Work
            </a>
            <a
              href="#timeline"
              className={`nav__link ${activeSection === 'timeline' ? 'is-active' : ''}`}
              data-magnetic
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              Education &amp; Timeline
            </a>
            <a
              href="#contact"
              className={`nav__link ${activeSection === 'contact' ? 'is-active' : ''}`}
              data-magnetic
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              Contact
            </a>
          </div>
          <div className="nav__right">
            <div className="nav__search" id="nav-search" onClick={() => setIsSearchOpen(true)} title="Quick Search (Ctrl + K)">
              <span className="nav__search-text">Search</span>
              <button
                className="nav__search-btn"
                id="search-btn"
                aria-label="Search"
                data-magnetic
                onClick={(e) => { e.stopPropagation(); setIsSearchOpen(true); }}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
            <button
              className="nav__menu-btn"
              id="menu-btn"
              aria-label="Menu"
              data-magnetic
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span style={isMenuOpen ? { transform: 'rotate(45deg) translate(2px, 2px)', width: '18px' } : {}}></span>
              <span style={isMenuOpen ? { transform: 'rotate(-45deg) translate(2px, -2px)', width: '18px' } : {}}></span>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer Overlay */}
        <div className={`mobile-nav ${isMenuOpen ? 'is-open' : ''}`} id="mobile-nav" aria-hidden={!isMenuOpen}>
          <div className="mobile-nav__backdrop" onClick={() => setIsMenuOpen(false)}></div>
          <div className="mobile-nav__panel">
            <div className="mobile-nav__header">
              <div className="mobile-nav__logo">
                <span className="mobile-nav__logo-text">charan</span>
                <span className="mobile-nav__logo-dot"></span>
              </div>
              <button
                className="mobile-nav__close"
                aria-label="Close Navigation"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mobile-nav__links">
              <a href="#hero-section" className={`mobile-nav__link ${activeSection === 'hero' ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav__num">00</span>
                <span className="mobile-nav__label">Home</span>
              </a>
              <a href="#about" className={`mobile-nav__link ${activeSection === 'about' ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav__num">01</span>
                <span className="mobile-nav__label">About Me</span>
              </a>
              <a href="#research" className={`mobile-nav__link ${activeSection === 'research' ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav__num">02</span>
                <span className="mobile-nav__label">Research &amp; Publications</span>
              </a>
              <a href="#skills" className={`mobile-nav__link ${activeSection === 'skills' ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav__num">03</span>
                <span className="mobile-nav__label">Technical Skills</span>
              </a>
              <a href="#work" className={`mobile-nav__link ${activeSection === 'work' ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav__num">04</span>
                <span className="mobile-nav__label">Featured Work</span>
              </a>
              <a href="#timeline" className={`mobile-nav__link ${activeSection === 'timeline' ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav__num">05</span>
                <span className="mobile-nav__label">Education &amp; Timeline</span>
              </a>
              <a href="#contact" className={`mobile-nav__link ${activeSection === 'contact' ? 'is-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="mobile-nav__num">06</span>
                <span className="mobile-nav__label">Get in Touch</span>
              </a>
            </div>

            <div className="mobile-nav__footer">
              <a
                href="/Charan_HS_Resume.pdf"
                download="Charan_HS_Resume.pdf"
                className="mobile-nav__resume-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download Resume (PDF)</span>
              </a>
              <div className="mobile-nav__socials">
                <a href="https://github.com/Charan359" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/charan-hs-4bbb9232b" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="mailto:charanhs359@gmail.com">Email</a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Command & Search Palette Modal */}
        <div className={`search-modal ${isSearchOpen ? 'is-open' : ''}`} id="search-modal" aria-hidden={!isSearchOpen}>
          <div className="search-modal__backdrop" onClick={() => setIsSearchOpen(false)}></div>
          <div className="search-modal__box">
            <div className="search-modal__input-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-modal__input"
                placeholder="Search projects, skills, research, or press Esc to close..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
              <span className="search-modal__kbd">ESC</span>
            </div>

            <div className="search-modal__results">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="search-modal__item"
                    onClick={() => handleSelectSearchItem(item)}
                  >
                    <span className={`search-modal__tag search-modal__tag--${item.type.toLowerCase()}`}>
                      {item.type}
                    </span>
                    <div className="search-modal__item-info">
                      <span className="search-modal__item-title">{item.title}</span>
                      <span className="search-modal__item-desc">{item.desc}</span>
                    </div>
                    <span className="search-modal__item-arrow">↵</span>
                  </div>
                ))
              ) : (
                <div className="search-modal__empty">
                  No matching results found for "{searchQuery}". Try searching for "Python", "Forensics", "SIH", or "Paper".
                </div>
              )}
            </div>

            <div className="search-modal__footer">
              <span>Tip: Press <strong>Ctrl + K</strong> anywhere to toggle quick search.</span>
            </div>
          </div>
        </div>

        {/* Three.js Interactive 3D Gold Particle & Geometry Environment */}
        <Hero3DCanvas />

        {/* Watermark Text Behind */}
        <div className="hero__watermark" aria-hidden="true" id="watermark" ref={watermarkRef}>
          Charan
        </div>

        {/* Floating Shapes */}
        <div className="hero__shapes" aria-hidden="true">
          <div className="hero__shape hero__shape--1"></div>
          <div className="hero__shape hero__shape--2"></div>
          <div className="hero__shape hero__shape--3"></div>
        </div>

        {/* Hero Content */}
        <div className="hero__content">
          <div className="hero__left">
            {/* Springer Nature Acceptance Spotlight Line */}
            <div className="hero__paper-spotlight" data-reveal>
              <span className="hero__paper-dot"></span>
              <span className="hero__paper-text">First Author &bull; Springer Nature (ICMMDU 2026)</span>
              <div className="hero__paper-links">
                <a
                  href="https://orcid.org/0009-0007-0553-6192"
                  target="_blank"
                  rel="noreferrer"
                  className="hero__paper-link"
                  title="Verified Author ORCID Record"
                >
                  ORCID ↗
                </a>
                <a
                  href="#privagentshield"
                  className="hero__paper-link hero__paper-link--gold"
                  title="View PrivAgentShield Paper ID: 190"
                >
                  Paper #190 ‹
                </a>
              </div>
            </div>

            <span className="hero__number" data-reveal>
              {String(activeProjectIdx + 1).padStart(2, '0')}
            </span>
            <h1 
              className={`hero__name ${isNamePopping ? 'is-popping' : ''}`} 
              id="hero-name"
              onClick={replayNamePop}
              title="Click to replay popping animation"
            >
              <span className="hero__name-line">
                <span className="hero__name-word">
                  {'Charan'.split('').map((char, i) => (
                    <span
                      key={i}
                      className="hero__name-char"
                      style={{ '--char-index': i }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>
              <span className="hero__name-line">
                <span className="hero__name-word">
                  {'H S'.split('').map((char, i) => (
                    <span
                      key={i}
                      className="hero__name-char"
                      style={{ '--char-index': i + 7 }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              </span>
            </h1>
            
            <div className="hero__headline-wrap" data-reveal>
              <h2 className="hero__headline">
                Engineering Intelligent Systems. <br className="hero__headline-break" />
                <span className="hero__headline-accent">Protecting What Matters.</span>
              </h2>
            </div>

            <div className="hero__designation" data-reveal>
              <span className="hero__designation-dot"></span>
              <span className="hero__designation-prefix">Lead Focus //</span>
              <span className="hero__designation-pill" key={designationIdx}>
                {designations[designationIdx]}
              </span>
            </div>

            {/* Resume Download & Social Links */}
            <div className="hero__actions-row" id="hero-socials">
              <a
                href="/Charan_HS_Resume.pdf"
                download="Charan_HS_Resume.pdf"
                className="hero__cv-btn"
                data-magnetic
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                title="Download Charan H S Official Single-Page Resume (PDF)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download CV</span>
              </a>

              <div className="hero__socials">
                <a
                  href="https://github.com/Charan359"
                  target="_blank"
                  rel="noreferrer"
                  className="hero__social"
                  data-magnetic
                  aria-label="GitHub Profile"
                  title="GitHub: Charan359"
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/charan-hs-4bbb9232b"
                  target="_blank"
                  rel="noreferrer"
                  className="hero__social"
                  data-magnetic
                  aria-label="LinkedIn Profile"
                  title="LinkedIn: Charan H S"
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="mailto:charanhs359@gmail.com"
                  className="hero__social"
                  data-magnetic
                  aria-label="Direct Email"
                  title="Direct Email: charanhs359@gmail.com"
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Arrows with clear context */}
            <div className="hero__arrows" id="hero-arrows">
              <button
                className="hero__arrow hero__arrow--prev"
                id="prev-btn"
                aria-label="Previous Featured Project"
                data-magnetic
                onClick={handlePrev}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                title="Previous Featured Project (Left Arrow)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>project</span>
              </button>
              <button
                className="hero__arrow hero__arrow--next"
                id="next-btn"
                aria-label="Next Featured Project"
                data-magnetic
                onClick={handleNext}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                title="Next Featured Project (Right Arrow)"
              >
                <span>project</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <div className="hero__right">
            {/* Real Research Hook instead of filler */}
            <div className="hero__greeting" id="hero-greeting">
              <span className="hero__greeting-line"></span>
              <p>65.0% privacy leakage prevention in multi-agent LLMs &bull; Springer Nature Accepted</p>
            </div>

            {/* Portrait Image with 3D tilt — half-page layout */}
            <div
              className="hero__portrait-wrapper"
              id="hero-portrait-wrapper"
              ref={portraitWrapperRef}
              onMouseMove={handlePortraitMouseMove}
              onMouseLeave={handlePortraitMouseLeave}
            >
              {/* Description — slides in from left on hover */}
              <div className="hero__description" id="hero-description">
                <div className="hero__desc-line"></div>
                <p>Formulating rigorous runtime policy mediation for LLM architectures and building production-grade web systems. First Author in Springer Nature proceedings.</p>
              </div>

              <div className="hero__portrait" id="hero-portrait">
                <div className="hero__portrait-overlay"></div>
                <img src="/charan-photo.png?v=2" alt="Charan H S Portrait" id="portrait-img" />
              </div>
              <div className="hero__portrait-frame"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero__scroll" id="scroll-indicator" onClick={handleScrollClick}>
          <div className="hero__scroll-line"></div>
          <span>scroll</span>
        </div>

        {/* Bottom Ticker / Carousel (Cleaned up duplicate 'more') */}
        <div className="hero__bottom" id="hero-bottom">
          <div className="hero__bottom-label">
            <span>Featured Work</span>
            <span className="hero__bottom-dot">&bull;</span>
          </div>
          <div className="hero__ticker" id="ticker" ref={tickerRef}>
            {tickerItems.map((item, index) => (
              <div
                key={index}
                className={`hero__ticker-item ${activeProjectIdx === index ? 'is-active' : ''}`}
                data-magnetic
                onClick={() => handleTickerClick(index, item.id)}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                title={`Jump to ${item.title}`}
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: `opacity 0.6s ${3.8 + index * 0.12}s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ${3.8 + index * 0.12}s cubic-bezier(0.16, 1, 0.3, 1)`
                }}
              >
                <div className="hero__ticker-avatar">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="hero__ticker-info">
                  <span className="hero__ticker-title">{item.title}</span>
                  <span className="hero__ticker-sub">{item.sub}</span>
                </div>
              </div>
            ))}
            <div className="hero__ticker-more" onClick={handleNext}>
              <span>more</span>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================
          5. ABOUT ME & BIO SECTION (#about)
          ======================================== */}
      <section className="about" id="about">
        <div className="about__container">
          <div className="about__header">
            <div className="about__eyebrow-wrapper">
              <span className="about__eyebrow-line"></span>
              <span className="about__eyebrow">// 01 &bull; ABOUT ME</span>
            </div>
            <h2 className="about__title">
              Crafting intelligent AI systems, data intelligence &amp; scalable web solutions.
            </h2>
          </div>

          <div className="about__grid">
            {/* Left Narrative Column */}
            <div className="about__story">
              <p className="about__lead">
                I am <span className="about__highlight">Charan H S</span>, a Computer Science (Data Science) undergraduate at <strong>Nagarjuna College of Engineering and Technology</strong>, Bengaluru, maintaining an <strong>8.41 CGPA</strong>.
              </p>
              <p className="about__text">
                My work bridges high-performance web engineering with artificial intelligence and digital security. As the <strong>First Author</strong> of <em>PrivAgentShield</em> &mdash; accepted for publication in <strong>Springer Nature</strong> proceedings (ICMMDU 2026) &mdash; I focus on solving real-world privacy leakage and policy runtime mediation in multi-agent LLM systems.
              </p>
              <p className="about__text">
                From engineering accessibility-first smart city platforms featuring multilingual Voice AI to building digital forensics video recovery suites for the Smart India Hackathon (SIH 2026), I thrive on transforming complex algorithms into intuitive, high-impact digital experiences.
              </p>

              {/* Achievement Badges */}
              <div className="about__badges">
                <span className="about__badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                  <span>B.E. CSE (Data Science)</span>
                </span>
                <span className="about__badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>SIH 2026 Dual Track Nominee (Web Security &amp; CCTV Forensics)</span>
                </span>
                <span className="about__badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>Springer Nature 1st Author (ICMMDU 2026)</span>
                </span>
                <span className="about__badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                  <span>Vibexathon 1.0 State Hackathon Coordinator</span>
                </span>
              </div>

              {/* Actions */}
              <div className="about__actions">
                <a
                  href="/Charan_HS_Resume.pdf"
                  download="Charan_HS_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="about__btn about__btn--primary"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download Resume (PDF)</span>
                </a>
                <a
                  href="#contact"
                  className="about__btn about__btn--ghost"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <span>Get in Touch</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Metric Cards Column */}
            <div className="about__stats">
              <div className="about__stat-card" data-magnetic onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                <div className="about__stat-card-glow"></div>
                <span className="about__stat-number">8.41</span>
                <span className="about__stat-label">Academic CGPA</span>
                <p className="about__stat-desc">4th Sem B.E. Data Science at NCET Bengaluru (2024–2028 batch).</p>
              </div>

              <div className="about__stat-card" data-magnetic onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                <div className="about__stat-card-glow"></div>
                <span className="about__stat-number">4+</span>
                <span className="about__stat-label">Production Platforms</span>
                <p className="about__stat-desc">Full-stack, AI, and digital forensic suites with live public deployments.</p>
              </div>

              <div className="about__stat-card" data-magnetic onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                <div className="about__stat-card-glow"></div>
                <span className="about__stat-number">1st</span>
                <span className="about__stat-label">Author Paper</span>
                <p className="about__stat-desc">Peer-reviewed research paper accepted in Springer Nature proceedings.</p>
              </div>

              <div className="about__stat-card" data-magnetic onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                <div className="about__stat-card-glow"></div>
                <span className="about__stat-number">32+</span>
                <span className="about__stat-label">Core Technologies</span>
                <p className="about__stat-desc">Across AI/ML, Full-Stack, Forensics &amp; Cloud databases.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          6. RESEARCH & PUBLICATIONS (#research)
          ======================================== */}
      <section className="research" id="research">
        <div className="research__container">
          <div className="research__header">
            <div className="research__eyebrow-wrapper">
              <span className="research__eyebrow-line"></span>
              <span className="research__eyebrow">// 02 &bull; RESEARCH &amp; PUBLICATIONS</span>
            </div>
            <h2 className="research__title">
              Theoretical Foundations &amp; Runtime Security for Multi-Agent AI Systems.
            </h2>
            <p className="research__subtitle">
              Original peer-reviewed research accepted for publication in Springer Nature conference proceedings (ICMMDU 2026, Paper ID: 190), formulating non-compensatory minimax privacy mediation.
            </p>
          </div>

          {/* Research Spotlight Bento Card */}
          <div className="research__bento">
            <div className="research__card research__card--primary">
              <div className="research__card-header">
                <div className="research__meta-badge">
                  <span className="research__meta-dot"></span>
                  <span>Springer Nature Proceedings &bull; ICMMDU 2026</span>
                </div>
                <span className="research__paper-id">Paper ID: 190</span>
              </div>

              <h3 className="research__card-title">
                PrivAgentShield: Policy-Aware Runtime Mediation for Multi-Agent LLMs
              </h3>

              <div className="research__author-row">
                <div className="research__author-badge">
                  <strong>First Author &amp; Lead Architect:</strong> Charan H S
                </div>
                <a
                  href="https://orcid.org/0009-0007-0553-6192"
                  target="_blank"
                  rel="noreferrer"
                  className="research__orcid-link"
                  title="Verify Author ORCID: 0009-0007-0553-6192"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.844-1.406 3.844-3.722 0-2.141-1.425-3.722-3.806-3.722h-2.335z"/>
                  </svg>
                  <span>ORCID: 0009-0007-0553-6192 ↗</span>
                </a>
              </div>

              <p className="research__abstract">
                <strong>Abstract &amp; Problem Overview:</strong> Multi-agent Large Language Model (LLM) architectures risk catastrophic sensitive data leakage when autonomous sub-agents communicate across heterogeneous privilege boundaries. We formulate the <em>Leakage Risk Index (LRI*)</em> &mdash; a non-compensatory minimax risk metric unifying payload sensitivity, lattice clearance dominance, and absorbing Markov reachability &mdash; enforcing dynamic runtime policy mediation without model retraining.
              </p>

              {/* Mathematical Formulation Highlight */}
              <div className="research__formula-card">
                <span className="research__formula-tag">MATHEMATICAL FORMULATION</span>
                <div className="research__formula-math">
                  <code>LRI* = min_M max_i [ S(x_i) &bull; I(L(A_i) &#8816; L(R)) &bull; P(&Omega; | A_i) ]</code>
                </div>
                <p className="research__formula-caption">
                  Non-compensatory minimax evaluation ensures high sensitivity dominates average utility, preventing statistical masking of confidential tokens.
                </p>
              </div>

              {/* Research Empirical Metrics */}
              <div className="research__metrics-grid">
                <div className="research__metric-box">
                  <span className="research__metric-value">65.0%</span>
                  <span className="research__metric-label">Privacy Leak Prevention</span>
                  <span className="research__metric-sub">Empirical Benchmark</span>
                </div>
                <div className="research__metric-box">
                  <span className="research__metric-value">74.2%</span>
                  <span className="research__metric-label">Task Preservation</span>
                  <span className="research__metric-sub">Utility Retained</span>
                </div>
                <div className="research__metric-box">
                  <span className="research__metric-value">1.66 ms</span>
                  <span className="research__metric-label">Runtime Latency</span>
                  <span className="research__metric-sub">Zero Model Retraining</span>
                </div>
                <div className="research__metric-box">
                  <span className="research__metric-value">31</span>
                  <span className="research__metric-label">Execution Traces</span>
                  <span className="research__metric-sub">Empirical Corpus</span>
                </div>
              </div>

              {/* Interactive 3D Markov Reachability Visualization Embedded */}
              <div className="research__viz-block">
                <div className="research__viz-header">
                  <div className="research__viz-title">
                    <span className="research__viz-pulse"></span>
                    <strong>Interactive 3D Multi-Agent Policy Lattice &amp; Markov Reachability Model</strong>
                  </div>
                  <span className="research__viz-note">Drag / Hover nodes to inspect policy lattice</span>
                </div>
                <MarkovLatticeCanvas />
              </div>

              {/* Research Milestones Timeline with Champagne Gold Lines */}
              <div className="research__timeline">
                <h4 className="research__timeline-title">Peer-Reviewed Acceptance &amp; Engineering Timeline</h4>
                <div className="research__timeline-items">
                  <div className="research__timeline-item">
                    <div className="research__timeline-dot"></div>
                    <div className="research__timeline-content">
                      <span className="research__timeline-phase">Phase I &bull; Theory</span>
                      <h5>Non-Compensatory Minimax Derivation</h5>
                      <p>Formulated mathematical proof that average-case risk metrics fail under adversarial privilege escalation. Established lattice dominance clearance rules.</p>
                    </div>
                  </div>

                  <div className="research__timeline-item">
                    <div className="research__timeline-dot"></div>
                    <div className="research__timeline-content">
                      <span className="research__timeline-phase">Phase II &bull; Benchmark</span>
                      <h5>31 Empirical Workflow Trace Evaluations</h5>
                      <p>Benchmarked dynamic Information Flow Control (IFC) and ABAC over synthetic and production multi-agent conversational workloads.</p>
                    </div>
                  </div>

                  <div className="research__timeline-item">
                    <div className="research__timeline-dot research__timeline-dot--active"></div>
                    <div className="research__timeline-content">
                      <span className="research__timeline-phase">Phase III &bull; Acceptance</span>
                      <h5>Springer Nature Proceedings (ICMMDU 2026)</h5>
                      <p>Paper ID 190 accepted following rigorous double-blind international peer review for publication in Springer Nature series.</p>
                    </div>
                  </div>

                  <div className="research__timeline-item">
                    <div className="research__timeline-dot"></div>
                    <div className="research__timeline-content">
                      <span className="research__timeline-phase">Phase IV &bull; Production</span>
                      <h5>Open Interactive Verification Sandbox</h5>
                      <p>Deployed live public runtime mediation harness with multi-viewport testing and real-time policy clearance inspection.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Action Buttons */}
              <div className="research__actions">
                <button
                  type="button"
                  onClick={() => handleOpenSandbox(projectsData[0])}
                  className="research__btn research__btn--primary"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <span className="research__btn-pulse"></span>
                  <span>Launch Live Verification Sandbox</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
                <a
                  href="https://orcid.org/0009-0007-0553-6192"
                  target="_blank"
                  rel="noreferrer"
                  className="research__btn research__btn--ghost"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <span>Verified ORCID Profile</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
                <a
                  href="#work"
                  className="research__btn research__btn--link"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <span>View in Project Showcase ↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          7. SKILLS & TECH STACK MATRIX (#skills)
          ======================================== */}
      <section className="skills" id="skills">
        <div className="skills__container">
          <div className="skills__header">
            <div className="skills__eyebrow-wrapper">
              <span className="skills__eyebrow-line"></span>
              <span className="skills__eyebrow">// 03 &bull; TECHNICAL PROFICIENCY</span>
            </div>
            <h2 className="skills__title">
              Engineered with modern frameworks, data intelligence &amp; architectural precision.
            </h2>
            <p className="skills__subtitle">
              A curated breakdown of the technologies, tools, and methodologies I leverage across production web development, machine learning pipelines, and systems security.
            </p>

            {/* Filter Pills */}
            <div className="skills__filters">
              <button
                className={`skills__filter-btn ${activeSkillCategory === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveSkillCategory('all')}
                data-magnetic
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                All Domains (32)
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`skills__filter-btn ${activeSkillCategory === cat.id ? 'is-active' : ''}`}
                  onClick={() => setActiveSkillCategory(cat.id)}
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <span className="skills__filter-icon">{renderCategoryIcon(cat.iconType)}</span>
                  <span>{cat.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid */}
          <div className="skills__grid">
            {skillCategories
              .filter((cat) => activeSkillCategory === 'all' || activeSkillCategory === cat.id)
              .map((cat) => (
                <div key={cat.id} className="skills__card" data-magnetic onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                  <div className="skills__card-top">
                    <div className="skills__card-icon-wrap">
                      <span className="skills__card-icon">{renderCategoryIcon(cat.iconType)}</span>
                    </div>
                    <div className="skills__card-meta">
                      <span className="skills__card-badge">{cat.badge}</span>
                      <h3 className="skills__card-title">{cat.title}</h3>
                      <p className="skills__card-desc">{cat.subtitle}</p>
                    </div>
                  </div>

                  <div className="skills__list">
                    {cat.skills.map((skill, idx) => (
                      <div key={idx} className="skills__pill">
                        <div className="skills__pill-header">
                          <span className="skills__pill-name">{skill.name}</span>
                          <span className="skills__pill-proof">{skill.proof}</span>
                        </div>
                        <span className="skills__pill-tag">{skill.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Certifications Banner */}
          <div className="skills__cert-banner">
            <div className="skills__cert-content">
              <span className="skills__cert-tag">CERTIFIED CREDENTIALS</span>
              <h4 className="skills__cert-title">Industry-Validated Competence &amp; Coursework</h4>
              <p className="skills__cert-text">
                Certified in <strong>Oracle Cloud AI Foundations (OCI 2025)</strong>, <strong>Cisco Python Essentials</strong>, <strong>Applied Database Systems 23ai</strong>, and <strong>NoviTech 30-Day Data Analytics MasterClass</strong>.
              </p>
            </div>
            <a
              href="#about"
              className="skills__cert-btn"
              data-magnetic
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span>View Academic Bio</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================
          8. SELECTED WORKS & RESEARCH SHOWCASE (#work)
          ======================================== */}
      <section className="work" id="work">
        <div className="work__container">
          <div className="work__header">
            <div className="work__eyebrow-wrapper">
              <span className="work__eyebrow-line"></span>
              <span className="work__eyebrow">// 04 &bull; FEATURED PROJECTS &amp; RESEARCH</span>
            </div>
            <h2 className="work__title">
              Architecting solutions that solve critical challenges in AI security, forensics &amp; urbanization.
            </h2>
            <p className="work__subtitle">
              A deep-dive into my top software platforms, hackathon-nominated architectures, and peer-reviewed research accepted in international proceedings.
            </p>
          </div>

          <div className="work__grid">
            {projectsData.map((project) => (
              <article key={project.id} id={project.id} className={`work__card ${project.featured ? 'work__card--featured' : ''}`}>
                <div className="work__card-header">
                  <span className="work__card-number">{project.number}</span>
                  <span className="work__card-category">{project.category}</span>
                </div>

                <div className="work__card-body">
                  <h3 className="work__card-title">{project.title}</h3>
                  <p className="work__card-tagline">{project.tagline}</p>
                  
                  <div className="work__card-meta">
                    <span className="work__meta-item"><strong>Role:</strong> {project.role}</span>
                    <span className="work__meta-item"><strong>Context:</strong> {project.venue}</span>
                  </div>

                  <p className="work__card-desc">{project.description}</p>

                  <ul className="work__card-bullets">
                    {project.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>

                  <div className="work__card-tech">
                    {project.tech.map((t, tIdx) => (
                      <span key={tIdx} className="work__tech-badge">{t}</span>
                    ))}
                  </div>

                  <div className="work__card-actions">
                    {project.hasLiveSandbox ? (
                      <button
                        type="button"
                        onClick={() => handleOpenSandbox(project)}
                        className="work__btn work__btn--live"
                        data-magnetic
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        title={`Launch interactive sandbox of ${project.title}`}
                      >
                        <span className="work__btn-pulse"></span>
                        <span>Live Demo</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                    ) : project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="work__btn work__btn--live"
                        data-magnetic
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        title={`Open live project in new tab`}
                      >
                        <span>Live Demo</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </a>
                    ) : null}

                    {project.id === 'privagentshield' && (
                      <button
                        type="button"
                        onClick={() => setShowPrivAgentViz((prev) => !prev)}
                        className={`work__btn work__btn--viz ${showPrivAgentViz ? 'is-active' : ''}`}
                        data-magnetic
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        title="Toggle interactive 3D Markov Reachability & Lattice graph"
                      >
                        <span className="work__btn-spark">⚡</span>
                        <span>{showPrivAgentViz ? 'Hide 3D Research Graph' : '3D Markov Model'}</span>
                      </button>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="work__btn work__btn--repo"
                        data-magnetic
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        title={`Inspect source repository on GitHub`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>

                  {/* Interactive 3D Markov Reachability & Lattice Visual (Exclusive to PrivAgentShield) */}
                  {project.id === 'privagentshield' && showPrivAgentViz && (
                    <div className="work__markov-wrapper">
                      <MarkovLatticeCanvas />
                    </div>
                  )}

                  {/* Interactive City Intelligence & Environmental HUD (Exclusive to UrbanPulse AI) */}
                  {project.id === 'urbanpulse' && (
                    <div className="work__urban-telemetry">
                      <div className="work__telemetry-badge">
                        <span className="work__telemetry-dot"></span>
                        <span>Live Smart City Sensory Overlays (13 Modules)</span>
                      </div>
                      <div className="work__telemetry-grid">
                        <div className="work__telemetry-item">
                          <span className="work__telemetry-label">Thermal Comfort</span>
                          <span className="work__telemetry-val">28.4°C &bull; Safe Zone</span>
                        </div>
                        <div className="work__telemetry-item">
                          <span className="work__telemetry-label">Air Quality Index</span>
                          <span className="work__telemetry-val">AQI 42 &bull; Good</span>
                        </div>
                        <div className="work__telemetry-item">
                          <span className="work__telemetry-label">Voice AI Talkback</span>
                          <span className="work__telemetry-val">15 Indian &amp; Global Langs</span>
                        </div>
                        <div className="work__telemetry-item">
                          <span className="work__telemetry-label">Routing Engine</span>
                          <span className="work__telemetry-val">14 Factors &bull; 6-Way Opt</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* macOS 3D Tilt Browser Bezel Preview */}
                <div
                  className="work__bezel-wrapper"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = (e.clientX - rect.left) / rect.width
                    const y = (e.clientY - rect.top) / rect.height
                    const tiltX = (y - 0.5) * -12
                    const tiltY = (x - 0.5) * 16
                    e.currentTarget.style.setProperty('--tilt-x', `${tiltX}deg`)
                    e.currentTarget.style.setProperty('--tilt-y', `${tiltY}deg`)
                    e.currentTarget.style.setProperty('--sheen-x', `${x * 100}%`)
                    e.currentTarget.style.setProperty('--sheen-y', `${y * 100}%`)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--tilt-x', '0deg')
                    e.currentTarget.style.setProperty('--tilt-y', '0deg')
                    e.currentTarget.style.setProperty('--sheen-x', '50%')
                    e.currentTarget.style.setProperty('--sheen-y', '50%')
                  }}
                >
                  <div className="work__bezel">
                    {/* Browser Chrome Header */}
                    <div className="work__bezel-header">
                      <div className="work__bezel-dots">
                        <span className="work__bezel-dot work__bezel-dot--red"></span>
                        <span className="work__bezel-dot work__bezel-dot--yellow"></span>
                        <span className="work__bezel-dot work__bezel-dot--green"></span>
                      </div>

                      <div className="work__bezel-urlbar">
                        <svg className="work__bezel-lock" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span className="work__bezel-url">{project.browserUrl}</span>
                      </div>

                      <div className="work__bezel-chips">
                        <span className="work__bezel-livechip">
                          <span className="work__bezel-livepulse"></span>
                          LIVE
                        </span>
                      </div>
                    </div>

                    {/* Interactive Display Screen with Tilt Sheen */}
                    <div className="work__bezel-screen">
                      <div className="work__bezel-sheen"></div>
                      
                      {/* Metric HUD Floating Pills */}
                      <div className="work__bezel-hud">
                        <div className="work__bezel-stat">
                          <span className="work__bezel-stat-num">{project.metrics.primary}</span>
                          <span className="work__bezel-stat-lbl">{project.metrics.label}</span>
                        </div>
                        <div className="work__bezel-badge">{project.metrics.badge}</div>
                      </div>

                      {/* Real Deployed Application Screenshot */}
                      <div className="work__bezel-screen-media">
                        <img
                          src={project.screenshot}
                          alt={`${project.title} live interface preview`}
                          className="work__bezel-img"
                          loading="lazy"
                        />
                      </div>

                      {/* Interactive Hover Trigger Overlay */}
                      <div className="work__bezel-overlay">
                        {project.hasLiveSandbox ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSandbox(project)}
                            className="work__bezel-launch-btn"
                          >
                            <span className="work__bezel-launch-icon">⚡</span>
                            <span>Launch Live Demo</span>
                          </button>
                        ) : (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="work__bezel-launch-btn"
                          >
                            <span>Open Project ↗</span>
                          </a>
                        )}
                        <p className="work__bezel-overlay-note">
                          {project.hasLiveSandbox ? 'Interactive in-portfolio sandbox' : 'Direct case study & source'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          9. EDUCATION, LEADERSHIP & CERTIFICATIONS (#timeline)
          ======================================== */}
      <section className="timeline" id="timeline">
        <div className="timeline__container">
          <div className="timeline__header">
            <div className="timeline__eyebrow-wrapper">
              <span className="timeline__eyebrow-line"></span>
              <span className="timeline__eyebrow">// 05 &bull; EDUCATION &amp; TIMELINE JOURNEY</span>
            </div>
            <h2 className="timeline__title">
              Formative milestones, hackathon leadership &amp; industry certifications.
            </h2>
            <p className="timeline__subtitle">
              A chronological overview of my computer science education, student governance &amp; hackathon coordination, alongside industry-recognized technical accreditations.
            </p>
          </div>

          <div className="timeline__layout">
            {/* Left Column: Education & Leadership */}
            <div className="timeline__column">
              <h3 className="timeline__column-title">
                <span className="timeline__column-icon">🎓</span>
                <span>Academic Education</span>
              </h3>

              <div className="timeline__items">
                {educationData.map((edu, idx) => (
                  <div key={idx} className="timeline__item">
                    <div className="timeline__item-dot"></div>
                    <div className="timeline__item-card">
                      <span className="timeline__item-period">{edu.period}</span>
                      <h4 className="timeline__item-degree">{edu.degree}</h4>
                      <p className="timeline__item-inst">{edu.institution}</p>
                      <div className="timeline__item-score">
                        <span className="timeline__score-badge">{edu.score}</span>
                      </div>
                      <p className="timeline__item-desc">{edu.description}</p>
                      <div className="timeline__item-highlights">
                        {edu.highlights.map((hl, hIdx) => (
                          <span key={hIdx} className="timeline__hl-pill">{hl}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="timeline__column-title timeline__column-title--spaced">
                <span className="timeline__column-icon">🏆</span>
                <span>Leadership &amp; Honors</span>
              </h3>

              <div className="timeline__items">
                {leadershipData.map((lead, idx) => (
                  <div key={idx} className="timeline__item">
                    <div className="timeline__item-dot timeline__item-dot--accent"></div>
                    <div className="timeline__item-card">
                      <div className="timeline__lead-header">
                        <span className="timeline__lead-badge">{lead.badge}</span>
                        <span className="timeline__lead-date">{lead.date}</span>
                      </div>
                      <h4 className="timeline__item-degree">{lead.title}</h4>
                      <p className="timeline__item-inst">{lead.org}</p>
                      <p className="timeline__item-desc">{lead.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Industry Certifications */}
            <div className="timeline__column">
              <h3 className="timeline__column-title">
                <span className="timeline__column-icon">📜</span>
                <span>Verified Certifications</span>
              </h3>

              <div className="timeline__certs-grid">
                {certificationsData.map((cert, idx) => (
                  <div key={idx} className="timeline__cert-card" data-magnetic onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                    <div className="timeline__cert-top">
                      <span className="timeline__cert-issuer">{cert.issuer}</span>
                      <span className="timeline__cert-code">{cert.code}</span>
                    </div>
                    <h4 className="timeline__cert-title">{cert.title}</h4>
                    <p className="timeline__cert-desc">{cert.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          10. INTERACTIVE CONTACT & FOOTER (#contact)
          ======================================== */}
      <section className="contact" id="contact">
        <div className="contact__container">
          <div className="contact__header">
            <div className="contact__eyebrow-wrapper">
              <span className="contact__eyebrow-line"></span>
              <span className="contact__eyebrow">// 06 &bull; GET IN TOUCH</span>
            </div>
            <h2 className="contact__title">
              Let's engineer something extraordinary together.
            </h2>
            <p className="contact__subtitle">
              Whether you have an ambitious software idea, a research collaboration, hackathon opportunity, or an engineering role &mdash; I'd love to connect.
            </p>
          </div>

          <div className="contact__grid">
            {/* Left Column: Direct Info & Quick Channels */}
            <div className="contact__info">
              {/* Availability Badge */}
              <div className="contact__status">
                <span className="contact__status-pulse"></span>
                <span className="contact__status-text">Available for Software &amp; AI/ML Roles</span>
              </div>

              {/* Direct Channels */}
              <div className="contact__channels">
                <div className="contact__channel-card">
                  <span className="contact__channel-label">Direct Email</span>
                  <div className="contact__channel-value-row">
                    <a href="mailto:charanhs359@gmail.com" className="contact__channel-link">
                      charanhs359@gmail.com
                    </a>
                    <button
                      type="button"
                      className="contact__copy-btn"
                      onClick={copyEmailToClipboard}
                      data-magnetic
                      onMouseMove={handleMagneticMove}
                      onMouseLeave={handleMagneticLeave}
                      title="Copy email to clipboard"
                    >
                      {copiedEmail ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="contact__channel-card">
                  <span className="contact__channel-label">Phone &amp; WhatsApp</span>
                  <a href="tel:+918296536615" className="contact__channel-link">
                    +91 8296536615
                  </a>
                </div>

                <div className="contact__channel-card">
                  <span className="contact__channel-label">Current Location</span>
                  <span className="contact__channel-text">
                    Bengaluru, Karnataka, India
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="contact__social-grid">
                <a
                  href="https://github.com/Charan359"
                  target="_blank"
                  rel="noreferrer"
                  className="contact__social-card"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                  <span className="contact__social-arrow">↗</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/charan-hs-4bbb9232b"
                  target="_blank"
                  rel="noreferrer"
                  className="contact__social-card"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                  <span className="contact__social-arrow">↗</span>
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact__form-wrapper">
              <form className="contact__form" onSubmit={handleFormSubmit}>
                <div className="contact__field-group">
                  <label htmlFor="name" className="contact__label">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="contact__input"
                  />
                </div>

                <div className="contact__field-group">
                  <label htmlFor="email" className="contact__label">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="e.g. alex@company.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="contact__input"
                  />
                </div>

                <div className="contact__field-group">
                  <label htmlFor="subject" className="contact__label">Subject / Topic</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="e.g. Software Role / Hackathon / Collaboration"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="contact__input"
                  />
                </div>

                <div className="contact__field-group">
                  <label htmlFor="message" className="contact__label">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    placeholder="Tell me about your project, problem statement, or opportunity..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="contact__textarea"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="contact__submit-btn"
                  data-magnetic
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  <span>{formSubmitted ? 'Opening Email Client...' : 'Send Message'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>

                {formSubmitted && (
                  <p className="contact__success-note">
                    ✓ Your mail client is opening with pre-filled details! I typically respond within 24 hours.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          11. LUXURY FOOTER
          ======================================== */}
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="footer__logo">
                <span className="footer__logo-text">charan</span>
                <span className="footer__logo-dot"></span>
              </div>
              <p className="footer__tagline">
                AI researcher, data science developer &amp; full-stack engineer based in Bengaluru.
              </p>
            </div>

            <div className="footer__nav">
              <a href="#hero-section" className={`footer__link ${activeSection === 'hero' ? 'is-active' : ''}`}>Top</a>
              <a href="#about" className={`footer__link ${activeSection === 'about' ? 'is-active' : ''}`}>About</a>
              <a href="#research" className={`footer__link ${activeSection === 'research' ? 'is-active' : ''}`}>Research</a>
              <a href="#skills" className={`footer__link ${activeSection === 'skills' ? 'is-active' : ''}`}>Skills</a>
              <a href="#work" className={`footer__link ${activeSection === 'work' ? 'is-active' : ''}`}>Work</a>
              <a href="#timeline" className={`footer__link ${activeSection === 'timeline' ? 'is-active' : ''}`}>Education &amp; Timeline</a>
              <a href="#contact" className={`footer__link ${activeSection === 'contact' ? 'is-active' : ''}`}>Contact</a>
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copy">
              &copy; {new Date().getFullYear()} Charan H S. All rights reserved.
            </p>
            <p className="footer__credit">
              Designed &amp; built with React 19, Vite &amp; precision engineering.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button
        type="button"
        className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        onClick={() => {
          document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
        aria-label="Back to Top"
        title="Scroll to Top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* ========================================
          11. INTERACTIVE LIVE SANDBOX MODAL (Zero-lag on-demand iframe)
          ======================================== */}
      {sandboxProject && (
        <div className="sandbox-modal" role="dialog" aria-modal="true" aria-label={`Live Demo of ${sandboxProject.title}`}>
          <div className="sandbox-modal__backdrop" onClick={handleCloseSandbox}></div>

          <div className={`sandbox-modal__window sandbox-modal__window--${sandboxDevice}`}>
            {/* macOS Chrome Header */}
            <div className="sandbox-modal__header">
              <div className="sandbox-modal__header-left">
                <div className="sandbox-modal__traffic-lights">
                  <button
                    type="button"
                    className="sandbox-modal__traffic-dot sandbox-modal__traffic-dot--close"
                    onClick={handleCloseSandbox}
                    title="Close Sandbox (Esc)"
                    aria-label="Close"
                  >
                    <span>&times;</span>
                  </button>
                  <button
                    type="button"
                    className="sandbox-modal__traffic-dot sandbox-modal__traffic-dot--min"
                    onClick={handleCloseSandbox}
                    title="Minimize"
                    aria-label="Minimize"
                  ></button>
                  <button
                    type="button"
                    className="sandbox-modal__traffic-dot sandbox-modal__traffic-dot--max"
                    onClick={() => setSandboxDevice(sandboxDevice === 'desktop' ? 'tablet' : 'desktop')}
                    title="Toggle Dimensions"
                    aria-label="Toggle Dimensions"
                  ></button>
                </div>

                <div className="sandbox-modal__project-meta">
                  <span className="sandbox-modal__badge">{sandboxProject.category}</span>
                  <strong className="sandbox-modal__title">{sandboxProject.title}</strong>
                </div>
              </div>

              {/* Viewport Device Switcher */}
              <div className="sandbox-modal__device-switcher">
                <button
                  type="button"
                  className={`sandbox-modal__device-btn ${sandboxDevice === 'desktop' ? 'is-active' : ''}`}
                  onClick={() => handleDeviceChange('desktop')}
                  title="Desktop View (100% responsive)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  className={`sandbox-modal__device-btn ${sandboxDevice === 'tablet' ? 'is-active' : ''}`}
                  onClick={() => handleDeviceChange('tablet')}
                  title="Tablet View (768px)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  className={`sandbox-modal__device-btn ${sandboxDevice === 'mobile' ? 'is-active' : ''}`}
                  onClick={() => handleDeviceChange('mobile')}
                  title="Mobile View (390px)"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  <span>Mobile</span>
                </button>
              </div>

              {/* Address Bar & Sandbox Actions */}
              <div className="sandbox-modal__header-right">
                <div className="sandbox-modal__urlbar">
                  <svg className="sandbox-modal__lock" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span className="sandbox-modal__url">{sandboxProject.browserUrl}</span>
                </div>

                <button
                  type="button"
                  onClick={handleReloadSandbox}
                  className="sandbox-modal__action-btn"
                  title="Reload Live App"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                </button>

                <a
                  href={sandboxProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="sandbox-modal__action-btn"
                  title="Open in Full Browser Tab"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>

                <button
                  type="button"
                  onClick={handleCloseSandbox}
                  className="sandbox-modal__close-btn"
                  title="Close (Esc)"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Viewport Frame with On-Demand Live Iframe */}
            <div className="sandbox-modal__viewport-wrap">
              {isSandboxLoading && (
                <div className="sandbox-modal__loader">
                  <div className="sandbox-modal__spinner"></div>
                  <div className="sandbox-modal__loader-info">
                    <strong>Connecting to Live Platform...</strong>
                    <span>{sandboxProject.title} &bull; {sandboxProject.browserUrl}</span>
                  </div>
                </div>
              )}

              <iframe
                key={sandboxKey}
                src={sandboxProject.liveUrl}
                title={`Live Demo of ${sandboxProject.title}`}
                className="sandbox-modal__iframe"
                loading="eager"
                allow="geolocation; microphone; camera; midi; encrypted-media; clipboard-read; clipboard-write;"
                onLoad={() => setIsSandboxLoading(false)}
              ></iframe>
            </div>

            {/* Sandbox Footer Bar */}
            <div className="sandbox-modal__footer">
              <div className="sandbox-modal__footer-left">
                <span className="sandbox-modal__status-dot"></span>
                <span>Active Live Instance &bull; Full Interaction Enabled</span>
              </div>
              <div className="sandbox-modal__footer-right">
                <span className="sandbox-modal__esc-tip">Press <kbd>Esc</kbd> to return to portfolio</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
