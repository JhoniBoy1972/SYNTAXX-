import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDownRight, ArrowUpRight, Menu, X, Code2, GraduationCap, Network,
  ShieldCheck, Sparkles, Award, BriefcaseBusiness, MoveUpRight, Layers3, Zap
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const profile = {
  name: 'Jonathan Imalsh',
  role: 'ICT Educator · Web & Software Engineer',
  location: 'Sri Lanka',
  intro: 'I work where technology, education and creative problem-solving meet.',
}

function Scene3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    mount.appendChild(renderer.domElement)

    const world = new THREE.Group()
    scene.add(world)

    const coreGeometry = new THREE.TorusKnotGeometry(1.28, 0.36, 220, 32, 2, 5)
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8c4cff, metalness: 0.82, roughness: 0.17,
      clearcoat: 1, clearcoatRoughness: 0.08,
      emissive: 0x26005b, emissiveIntensity: 0.8,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    world.add(core)

    const shellGeometry = new THREE.IcosahedronGeometry(2.0, 2)
    const shellMaterial = new THREE.MeshBasicMaterial({ color: 0xc5a4ff, wireframe: true, transparent: true, opacity: 0.2 })
    const shell = new THREE.Mesh(shellGeometry, shellMaterial)
    world.add(shell)

    const rings = []
    ;[
      { radius: 2.55, tube: 0.012, color: 0x9e65ff, opacity: 0.8, rotation: [1.1, 0.2, 0.3] },
      { radius: 2.95, tube: 0.008, color: 0x42d8ff, opacity: 0.62, rotation: [0.2, 1.25, 0.8] },
      { radius: 2.18, tube: 0.006, color: 0xf35bff, opacity: 0.5, rotation: [1.8, 0.7, 1.2] },
    ].forEach((item) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(item.radius, item.tube, 10, 240),
        new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: item.opacity })
      )
      mesh.rotation.set(...item.rotation)
      world.add(mesh)
      rings.push(mesh)
    })

    const particleCount = 1050
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const colorA = new THREE.Color(0x9c5dff)
    const colorB = new THREE.Color(0x39d9ff)
    for (let i = 0; i < particleCount; i++) {
      const radius = 3.1 + Math.random() * 4.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      const c = colorA.clone().lerp(colorB, Math.random() * 0.75)
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const particleMaterial = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    scene.add(new THREE.AmbientLight(0x9e85ff, 1.8))
    const violetLight = new THREE.PointLight(0x8b3dff, 110, 30)
    violetLight.position.set(4, 3, 5)
    scene.add(violetLight)
    const cyanLight = new THREE.PointLight(0x27cfff, 95, 26)
    cyanLight.position.set(-4, -2, 3)
    scene.add(cyanLight)
    const pinkLight = new THREE.PointLight(0xf14bff, 55, 20)
    pinkLight.position.set(0, 4, -3)
    scene.add(pinkLight)

    let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0
    const onPointer = (event) => {
      const rect = mount.getBoundingClientRect()
      aimX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7
      aimY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5
    }
    mount.addEventListener('pointermove', onPointer)

    const clock = new THREE.Clock()
    let frame
    let active = true
    const animate = () => {
      if (!active) return
      frame = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      pointerX += (aimX - pointerX) * 0.035
      pointerY += (aimY - pointerY) * 0.035
      world.rotation.y = t * 0.16 + pointerX
      world.rotation.x = Math.sin(t * 0.3) * 0.1 + pointerY
      core.rotation.x = t * 0.12
      core.rotation.z = Math.sin(t * 0.22) * 0.16
      shell.rotation.y = -t * 0.1
      shell.rotation.x = t * 0.055
      rings[0].rotation.z = t * 0.1
      rings[1].rotation.y += 0.0014
      rings[2].rotation.x -= 0.001
      particles.rotation.y = t * 0.018
      particles.rotation.x = Math.sin(t * 0.12) * 0.08
      renderer.render(scene, camera)
    }
    animate()

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1)
      const height = Math.max(mount.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)

    return () => {
      active = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      mount.removeEventListener('pointermove', onPointer)
      coreGeometry.dispose(); coreMaterial.dispose()
      shellGeometry.dispose(); shellMaterial.dispose()
      rings.forEach((ring) => { ring.geometry.dispose(); ring.material.dispose() })
      particleGeometry.dispose(); particleMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="scene3d" ref={mountRef} aria-label="Animated violet and cyan 3D sculpture" />
}

const skills = [
  { icon: Code2, index: '01', title: 'Web & Software', text: 'Responsive interfaces and practical web applications using HTML, CSS, JavaScript, Tailwind CSS and Firebase.', tags: ['HTML / CSS', 'JavaScript', 'Firebase'] },
  { icon: Network, index: '02', title: 'Networking', text: 'Networking foundations, infrastructure concepts, connectivity and practical troubleshooting.', tags: ['Networking', 'IoT', 'Infrastructure'] },
  { icon: ShieldCheck, index: '03', title: 'Cybersecurity', text: 'Building knowledge in cybersecurity, secure systems and responsible technology through ongoing study.', tags: ['Security', 'Systems', 'Learning'] },
  { icon: GraduationCap, index: '04', title: 'ICT Education', text: 'Making technical ideas clear through structured lessons, learning resources and hands-on examples.', tags: ['Teaching', 'Learning design', 'ICT'] },
]

const projects = [
  { number: '01', name: 'VOYO LANKA', type: 'TRAVEL · DIGITAL EXPERIENCE', description: 'A Sri Lankan tours and private-transfer brand, supported by a custom booking and payment experience.', tags: ['Web development', 'Firebase', 'Digital product'], link: 'https://voyolanka.com', className: 'project-voyo', mark: 'VL' },
  { number: '02', name: 'PNEUMA', type: 'EDUCATION · CREATIVE DIRECTION', description: 'An education initiative bringing teachers and lecturers together to support learners across school levels and subjects.', tags: ['Education', 'Brand direction', 'Learning'], link: null, className: 'project-pneuma', mark: 'P.' },
]

function SectionHeading({ number, eyebrow, title, description }) {
  return (
    <div className="section-heading reveal">
      <div className="heading-overline"><span>{number}</span><span>{eyebrow}</span></div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [year] = useState(new Date().getFullYear())
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
      intro.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7, delay: 0.15 })
        .from('.hero-title .line-inner', { yPercent: 115, rotate: 2, duration: 1.1, stagger: 0.13 }, '-=0.35')
        .from('.hero-description, .hero-actions, .hero-footnote', { y: 24, opacity: 0, duration: 0.75, stagger: 0.12 }, '-=0.55')
        .from('.hero-art', { scale: 0.88, opacity: 0, duration: 1.25 }, '-=1')

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element, { y: 54, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true }
        })
      })
      gsap.utils.toArray('.expertise-card').forEach((element, index) => {
        gsap.fromTo(element, { y: 65, opacity: 0, rotateX: 7 }, {
          y: 0, opacity: 1, rotateX: 0, duration: 0.9, delay: index * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 91%', once: true }
        })
      })
      gsap.utils.toArray('.project-card').forEach((element, index) => {
        gsap.fromTo(element, { y: 70, opacity: 0, scale: 0.97 }, {
          y: 0, opacity: 1, scale: 1, duration: 1, delay: index * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true }
        })
      })
      gsap.to('.hero-glow', { scale: 1.18, opacity: 0.85, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.floating-orb.orb-one', { y: -22, x: 12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.floating-orb.orb-two', { y: 18, x: -10, duration: 6.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    })
    return () => ctx.revert()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const navItems = [['About', '#about'], ['Expertise', '#expertise'], ['Journey', '#journey'], ['Work', '#work']]

  return (
    <div className="app-shell">
      <div className="noise-layer" />
      <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="ambient ambient-three" />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu}>SYNTAXX<span>®</span><i>.</i></a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {navItems.map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}</a>)}
        </nav>
        <a className="header-cta" href="#work">SELECTED WORK <ArrowUpRight size={14} /></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-eyebrow"><span className="eyebrow-mark"><span /></span> INDEPENDENT MIND · SRI LANKA</div>
              <p className="hero-kicker">HELLO, I'M {profile.name.toUpperCase()}</p>
              <h1 className="hero-title"><span className="line-mask"><span className="line-inner">Curiosity</span></span><span className="line-mask"><span className="line-inner">into <em>creation.</em></span></span></h1>
              <p className="hero-description">{profile.intro} <strong>{profile.role}.</strong></p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">Explore selected work <MoveUpRight size={16} /></a>
                <a className="button button-ghost" href="#about">A little about me <ArrowDownRight size={16} /></a>
              </div>
              <div className="hero-footnote"><span>01 / 04</span><span>EDUCATION <i>✳</i> TECHNOLOGY <i>✳</i> CREATION</span></div>
            </div>

            <div className="hero-art">
              <div className="hero-glow" />
              <div className="floating-orb orb-one" /><div className="floating-orb orb-two" />
              <div className="art-corner corner-tl">S—001 <span>FIGURE / 01</span></div>
              <Scene3D />
              <div className="art-side-label">THINK / BUILD / EVOLVE</div>
              <div className="art-bottom"><span>FORM FOLLOWS CURIOSITY</span><span className="art-live"><i /> LIVE RENDER</span></div>
            </div>
          </div>
          <a href="#about" className="scroll-cue"><span className="scroll-line" /> SCROLL TO EXPLORE <ArrowDownRight size={13} /></a>
          <div className="hero-index">S<span>.</span>X / 2026</div>
        </section>

        <section className="intro-strip" aria-label="Areas of interest">
          <div className="strip-track">
            {[0, 1].map((copy) => <div className="strip-inner" key={copy} aria-hidden={copy === 1}>
              <span>CURIOUS BY NATURE</span><b>✳</b><span>BUILT THROUGH LEARNING</span><b>✳</b><span>DRIVEN BY POSSIBILITY</span><b>✳</b><span>ALWAYS EVOLVING</span><b>✳</b>
            </div>)}
          </div>
        </section>

        <section className="section-wrap about-section" id="about">
          <SectionHeading number="01" eyebrow="THE PERSON BEHIND THE PIXELS" title={<>A mind for systems.<br /><em>A heart for learning.</em></>} description="Technology is the medium. Curiosity is the constant." />
          <div className="about-grid">
            <div className="about-visual reveal">
              <div className="visual-frame">
                <div className="visual-grid" />
                <div className="visual-rings"><span /><span /><span /></div>
                <div className="visual-monogram">J<span>I</span><i>.</i></div>
                <div className="visual-coordinate coordinate-a">SYSTEM<br />01 / PERSONAL</div>
                <div className="visual-coordinate coordinate-b">THOUGHT<br />IN MOTION</div>
                <div className="visual-crosshair">+</div>
                <div className="visual-footer"><span>JONATHAN IMALSH</span><span>PERSONAL ARCHIVE / 001</span></div>
              </div>
              <div className="visual-caption"><span>IDENTITY / IN PROGRESS</span><span>EST. THROUGH EXPERIENCE</span></div>
            </div>
            <div className="about-copy reveal">
              <span className="small-index">THE PERSON / THE PURPOSE</span>
              <h3>Hey, I'm Jonathan<span>.</span></h3>
              <p className="lead">An ICT educator and technology enthusiast who enjoys bringing ideas to life — whether that's in a classroom or through a line of code.</p>
              <p>My interests span web and software development, networking, IoT and cybersecurity. I enjoy making complex ideas easier to understand and creating digital experiences that are useful, thoughtful and memorable.</p>
              <p>I'm continually learning, building and refining my craft. This portfolio brings together the work, milestones and ideas that shape that journey.</p>
              <div className="about-facts">
                <div><span>BASED IN</span><strong>Sri Lanka</strong></div>
                <div><span>WORKING ACROSS</span><strong>Education + Technology</strong></div>
                <div><span>APPROACH</span><strong>Curiosity first</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="expertise-section" id="expertise">
          <div className="section-wrap">
            <SectionHeading number="02" eyebrow="AREAS OF FOCUS" title={<>Different disciplines.<br /><em>One curious mind.</em></>} description="A multidisciplinary foundation shaped by teaching, experimentation and continuous learning." />
            <div className="expertise-grid">
              {skills.map((skill) => {
                const Icon = skill.icon
                return <article className="expertise-card" key={skill.title}>
                  <div className="card-top"><span>{skill.index} / DISCIPLINE</span><Icon size={22} /></div>
                  <h3>{skill.title}</h3><p>{skill.text}</p>
                  <div className="skill-tags">{skill.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  <div className="card-line" />
                </article>
              })}
            </div>
            <div className="toolkit-line reveal"><span>TOOLS & TECHNOLOGIES</span><div><b>HTML</b><b>CSS</b><b>JAVASCRIPT</b><b>TAILWIND</b><b>FIREBASE</b><b>CLOUDINARY</b><b>GITHUB</b></div><Layers3 size={18} /></div>
          </div>
        </section>

        <section className="section-wrap journey-section" id="journey">
          <SectionHeading number="03" eyebrow="THE JOURNEY SO FAR" title={<>Built one step<br /><em>at a time.</em></>} description="Experience and learning milestones that have helped shape my path." />
          <div className="journey-grid">
            <div className="journey-column reveal">
              <div className="column-heading"><BriefcaseBusiness size={18} /><span>EXPERIENCE</span><i>01</i></div>
              <div className="timeline-item"><span className="timeline-dot" /><span className="timeline-date">LATE 2024 — 2026</span><h3>Assistant ICT Instructor</h3><p>Republican International School</p><small>Teaching support and ICT-related responsibilities, alongside exposure to network administration.</small></div>
              <div className="timeline-item"><span className="timeline-dot" /><span className="timeline-date">ONGOING</span><h3>ICT Education & Independent Work</h3><p>Teaching · Web · Creative projects</p><small>Developing learning materials, supporting students and building digital projects.</small></div>
            </div>
            <div className="journey-column reveal">
              <div className="column-heading"><Award size={18} /><span>LEARNING & CERTIFICATIONS</span><i>02</i></div>
              <div className="timeline-item"><span className="timeline-dot" /><span className="timeline-date">COMPLETED</span><h3>Cisco Networking Basics</h3><p>Cisco Networking Academy</p><small>Completed the course and earned a certificate and digital badge.</small></div>
              <div className="timeline-item"><span className="timeline-dot" /><span className="timeline-date">ONGOING STUDIES</span><h3>Cybersecurity</h3><p>Degree studies</p><small>Developing a deeper foundation in cybersecurity and related technologies.</small></div>
            </div>
          </div>
          <div className="journey-end reveal"><span className="journey-end-mark"><Zap size={15} /></span><p>Not a finished story. Just the next version.</p><span>CONTINUOUSLY ITERATING</span></div>
        </section>

        <section className="work-section" id="work">
          <div className="section-wrap">
            <SectionHeading number="04" eyebrow="SELECTED WORK & INITIATIVES" title={<>Ideas, given<br /><em>a digital life.</em></>} description="A selection of projects and initiatives connected to technology, learning and building." />
            <div className="projects-list">
              {projects.map((project) => <article className={`project-card ${project.className}`} key={project.number}>
                <div className="project-art"><div className="project-art-grid" /><span className="project-art-mark">{project.mark}</span><span className="project-art-index">{project.number} / SELECTED</span><span className="project-art-corner">↗</span></div>
                <div className="project-content">
                  <div className="project-meta"><span>{project.type}</span><span>0{project.number}</span></div>
                  <h3>{project.name}</h3><p>{project.description}</p>
                  <div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  {project.link && <a className="project-open" href={project.link} target="_blank" rel="noreferrer">VISIT PROJECT <ArrowUpRight size={15} /></a>}
                </div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="closing-section section-wrap">
          <div className="closing-panel reveal">
            <div className="closing-orbit"><span /><span /><span /></div>
            <div className="closing-content"><span className="eyebrow"><Sparkles size={14} /> THE PHILOSOPHY</span><h2>Stay curious.<br /><em>Make meaningful things.</em></h2><p>I believe technology matters most when it helps people learn, solve problems and see new possibilities. The best work starts with curiosity — and gets better through consistency.</p></div>
            <div className="closing-symbol">S<span>.</span></div>
            <a href="#home" className="closing-back" aria-label="Back to top"><ArrowUpRight size={22} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap"><a className="brand" href="#home">SYNTAXX<span>®</span><i>.</i></a><span>DESIGNED TO EVOLVE · © {year} JONATHAN IMALSH</span><a href="#home" className="back-top">BACK TO TOP ↑</a></footer>
    </div>
  )
}

export default App
