import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import StoryChapter from '../components/StoryChapter'

const PaintedBackground = dynamic(() => import('../components/PaintedBackground'), { ssr: false })
const SmoothScroll = dynamic(() => import('../components/SmoothScroll'), { ssr: false })

const CHAPTERS = [
  {
    number: 'I',
    kicker: 'Prologue',
    title: 'Before the first light',
    body:
      'In the hush that precedes every great story, the world holds its breath. Ink pools on parchment. A hand hovers, uncertain. Somewhere beyond the dark, a single colour begins to wake.',
    align: 'left',
    palette: { a: '#0b1224', b: '#1b2a55', c: '#d68a4c' },
  },
  {
    number: 'II',
    kicker: 'Chapter One',
    title: 'The slow bloom of dawn',
    body:
      'Light spills like watercolour across the hills. Orange surrenders to amber, amber to honey. The first chapter is not loud — it is the soft insistence of a world choosing to begin again.',
    align: 'right',
    palette: { a: '#3a1f2b', b: '#c1582e', c: '#f2c66d' },
  },
  {
    number: 'III',
    kicker: 'Chapter Two',
    title: 'A storm of strange colour',
    body:
      'Then the sky turns mood. Plum bruises into crimson; the wind drags violet across the horizon. Every brushstroke trembles, as if the painter were arguing with their own hand.',
    align: 'left',
    palette: { a: '#2a0a3a', b: '#7a1e63', c: '#e34b5f' },
  },
  {
    number: 'IV',
    kicker: 'Chapter Three',
    title: 'The room beneath the sea',
    body:
      'Below the storm, a stillness. Teal opens like a held note. Schools of light hang suspended in the dark, and the page itself seems to breathe in cool, patient blue.',
    align: 'right',
    palette: { a: '#03202b', b: '#0c5c70', c: '#9fe4d6' },
  },
  {
    number: 'V',
    kicker: 'Chapter Four',
    title: 'A garden remembered',
    body:
      'Memory paints in softer pigment. Rose-gold petals, the green of an old courtyard, dust drifting in a forgotten beam of afternoon. The story slows so that you can hear it.',
    align: 'left',
    palette: { a: '#1f0f1a', b: '#a8557a', c: '#f3c4a4' },
  },
  {
    number: 'VI',
    kicker: 'Epilogue',
    title: 'And then, the quiet',
    body:
      'The last colour is almost no colour at all — the warm grey of a closed book on a windowsill, the page still humming. The story does not end. It waits, patient, for the next reader to scroll.',
    align: 'center',
    palette: { a: '#1a1a1f', b: '#4a4453', c: '#e7d8c0' },
  },
]

const PALETTES = CHAPTERS.map((c) => c.palette)

export default function Home() {
  const progressRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <Head>
        <title>Six Colours — a scrolling story</title>
        <meta name="description" content="A storytelling website where each scroll reveals a new chapter, painted in living colour." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SmoothScroll />
      <PaintedBackground palette={PALETTES} />

      {/* Scroll progress rule */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'rgba(255,255,255,0.08)',
          zIndex: 10,
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #f6efe3, #f3c4a4)',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
      </div>

      {/* Fixed wordmark */}
      <header
        style={{
          position: 'fixed',
          top: 24,
          left: 32,
          zIndex: 10,
          color: '#f6efe3',
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontSize: 12,
          opacity: 0.85,
          mixBlendMode: 'difference',
        }}
      >
        Six&nbsp;Colours
      </header>

      <nav
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 10,
          color: '#f6efe3',
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontSize: 12,
          opacity: 0.85,
          mixBlendMode: 'difference',
        }}
      >
        scroll&nbsp;to&nbsp;turn&nbsp;the&nbsp;page
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Title scene */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#f6efe3',
            padding: '0 6vw',
          }}
        >
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.42em',
              fontSize: 12,
              opacity: 0.7,
              marginBottom: '1.5rem',
            }}
          >
            A scrolling story in six colours
          </span>
          <h1
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 400,
              fontSize: 'clamp(56px, 10vw, 168px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              margin: 0,
              textShadow: '0 4px 40px rgba(0,0,0,0.35)',
            }}
          >
            Painted&nbsp;in
            <br />
            <em style={{ fontStyle: 'italic' }}>motion.</em>
          </h1>
          <p
            style={{
              maxWidth: 560,
              opacity: 0.78,
              marginTop: '1.75rem',
              lineHeight: 1.7,
              fontSize: 16,
            }}
          >
            Move your cursor across the canvas. Each chapter below is a new scene —
            a new colour, a new mood, a new breath in a story that paints itself as you scroll.
          </p>

          <div style={{ position: 'absolute', bottom: 36, color: '#f6efe3', opacity: 0.7, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            ↓&nbsp;&nbsp;Begin
          </div>
        </section>

        {CHAPTERS.map((c, i) => (
          <StoryChapter
            key={i}
            index={i}
            number={c.number}
            kicker={c.kicker}
            title={c.title}
            body={c.body}
            align={c.align}
            isFirst={i === 0}
            isLast={i === CHAPTERS.length - 1}
          />
        ))}

        <footer
          style={{
            minHeight: '40vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f6efe3',
            opacity: 0.7,
            fontFamily: 'Georgia, "Times New Roman", serif',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontSize: 11,
            position: 'relative',
            zIndex: 1,
          }}
        >
          The end · scroll up to read again
        </footer>
      </main>
    </>
  )
}
