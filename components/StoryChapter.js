import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

export default function StoryChapter({
  index,
  number,
  kicker,
  title,
  body,
  align = 'left',
  isFirst,
  isLast,
}) {
  const root = useRef(null)

  useEffect(() => {
    if (!root.current) return
    gsap.registerPlugin(ScrollTrigger)

    const el = root.current
    const kickerEl = el.querySelector('[data-kicker]')
    const numEl = el.querySelector('[data-number]')
    const titleEl = el.querySelector('[data-title]')
    const bodyEl = el.querySelector('[data-body]')
    const rule = el.querySelector('[data-rule]')

    // Cinematic entry: each element drifts in like a film shot
    const enter = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        end: 'top 20%',
        scrub: 0.8,
      },
    })
    enter
      .fromTo(numEl, { yPercent: 60, opacity: 0, scale: 0.9 }, { yPercent: 0, opacity: 1, scale: 1, ease: 'power3.out' }, 0)
      .fromTo(kickerEl, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'power3.out' }, 0.05)
      .fromTo(rule, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, ease: 'power2.out' }, 0.05)
      .fromTo(titleEl, { yPercent: 80, opacity: 0, letterSpacing: '0.2em' }, { yPercent: 0, opacity: 1, letterSpacing: '0em', ease: 'power3.out' }, 0.1)
      .fromTo(bodyEl, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0.15)

    // Parallax drift while in view
    const drift = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    drift
      .to(numEl, { yPercent: -45, ease: 'none' }, 0)
      .to(titleEl, { yPercent: -18, ease: 'none' }, 0)
      .to(bodyEl, { yPercent: -8, ease: 'none' }, 0)

    // Exit fade as section leaves
    const exit = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'bottom 80%',
        end: 'bottom 30%',
        scrub: 0.6,
      },
    })
    exit.to([kickerEl, titleEl, bodyEl, numEl, rule], { opacity: 0.0, ease: 'power2.in', stagger: 0.05 })

    // Notify background of chapter activation
    const activator = ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => window.dispatchEvent(new CustomEvent('chapter:change', { detail: { index } })),
      onEnterBack: () => window.dispatchEvent(new CustomEvent('chapter:change', { detail: { index } })),
    })

    return () => {
      enter.scrollTrigger && enter.scrollTrigger.kill()
      drift.scrollTrigger && drift.scrollTrigger.kill()
      exit.scrollTrigger && exit.scrollTrigger.kill()
      activator.kill()
      enter.kill()
      drift.kill()
      exit.kill()
    }
  }, [index])

  return (
    <section
      ref={root}
      data-chapter={index}
      style={{
        position: 'relative',
        minHeight: isFirst || isLast ? '100vh' : '110vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
        padding: '0 8vw',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          color: '#f6efe3',
          textAlign: align,
          textShadow: '0 2px 30px rgba(0,0,0,0.35)',
          mixBlendMode: 'normal',
        }}
      >
        <div
          data-number
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(56px, 9vw, 140px)',
            lineHeight: 1,
            opacity: 0.55,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
          }}
        >
          {number}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start', marginBottom: '1rem' }}>
          {align !== 'right' && <span data-rule style={{ display: 'inline-block', width: 60, height: 1, background: 'currentColor', opacity: 0.7 }} />}
          <span
            data-kicker
            style={{
              display: 'inline-block',
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
              fontSize: '12px',
              opacity: 0.9,
            }}
          >
            {kicker}
          </span>
          {align === 'right' && <span data-rule style={{ display: 'inline-block', width: 60, height: 1, background: 'currentColor', opacity: 0.7 }} />}
        </div>
        <h2
          data-title
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 400,
            fontSize: 'clamp(40px, 6.2vw, 92px)',
            lineHeight: 1.05,
            margin: '0 0 1.5rem 0',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h2>
        <p
          data-body
          style={{
            fontSize: 'clamp(15px, 1.15vw, 19px)',
            lineHeight: 1.7,
            opacity: 0.88,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </section>
  )
}
