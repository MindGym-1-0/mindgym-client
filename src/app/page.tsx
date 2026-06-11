'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const router = useRouter();
  const scrollToSection = (id: string) => {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
  const faqs = [
    {
      q: 'How does the confidence tracking work?',
      a: 'Before every session, your coach asks you to rate your anxiety 1–10. After the session, they ask again. The difference is your anxiety reduction — tracked across every session so you can see your trend over time.',
    },
    {
      q: 'How long are sessions?',
      a: 'Sessions are typically 5–20 minutes, designed to fit into your schedule even on busy interview-prep days.',
    },
    {
      q: 'Is this therapy?',
      a: 'No. MindGym is performance coaching focused on interview readiness. If you need clinical support, we encourage you to seek a licensed therapist.',
    },
    {
      q: 'Does MindGym replace interview preparation?',
      a: 'No — it complements it. MindGym trains the mental and emotional layer so your preparation actually comes through when it matters.',
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F5F4F0', color: '#1a1a1a' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(245,244,240,0.92)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
      }}>
        {/* Logo from public/logo.png */}
        <Image src="/logo.png" alt="MindGym" width={120} height={32} style={{ objectFit: 'contain' }} />

        <div
  style={{
    display: 'flex',
    gap: '36px',
    fontSize: '14px',
    color: '#444',
  }}
>
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    style={{ background: "none", border: "none", cursor: "pointer" }}
  >
    Home
  </button>

  <button
    onClick={() => scrollToSection("about")}
    style={{ background: "none", border: "none", cursor: "pointer" }}
  >
    About
  </button>

  <button
    onClick={() => scrollToSection("reviews")}
    style={{ background: "none", border: "none", cursor: "pointer" }}
  >
    Reviews
  </button>

  <button
    onClick={() => scrollToSection("faq")}
    style={{ background: "none", border: "none", cursor: "pointer" }}
  >
    FAQ
  </button>
</div>
        <button onClick={() => router.push("/sign-up")}
        style={{
          background: '#1a3d32', color: '#fff', border: 'none',
          padding: '10px 22px', borderRadius: '100px', fontSize: '14px',
          fontWeight: 500, cursor: 'pointer',
        }}>Start free trial</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '760px', overflow: 'hidden' }}>
        {/* Background photo from public/landing.png */}
        <Image
          src="/landing.png"
          alt="Interview coaching session"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
        />
        {/* gradient overlay so text stays readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: "rgba(255,255,255,0.38)",
          zIndex: 1,
        }} />

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '760px', padding: '220px 24px 120px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(48px, 6vw, 72px)',
            fontWeight: 700, color: '#111111',
            lineHeight: 1.2, marginBottom: '20px',
            textShadow: 'none',
            maxWidth: '640px',
          }}>
            Interviews test your answers.<br />We train your mind.
          </h1>
          <p style={{
            fontSize: '15px', color: '#4B5563',
            maxWidth: '380px', lineHeight: 1.6, marginBottom: '36px',
          }}>
            MindGym helps you build confidence, stay calm, and perform at your best when it matters most.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => router.push("/sign-up")}
            style={{
              background: '#1a3d32', color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: '8px', fontSize: '15px',
              fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            }}>Start free trial →</button>
            <button onClick={() => router.push("/login")}
            style={{
              background: 'rgba(255,255,255,0.92)', color: '#1a1a1a', border: 'none',
              padding: '12px 28px', borderRadius: '8px', fontSize: '15px',
              fontWeight: 500, cursor: 'pointer',
            }}>Already have an account?</button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'relative', zIndex: 2,
          background: 'rgba(245,244,240,0.97)',
          display: 'flex', justifyContent: 'center', gap: '80px',
          padding: '28px 48px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          {[
            { val: '50k+', label: 'Practice sessions' },
            { val: '4.8 / 5', label: 'Confidence rating' },
            { val: '−3.2', label: 'Avg anxiety drop per session' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>{stat.val}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE GAP ── */}
      <section id="about" style={{ padding: '72px 48px', background: '#F5F4F0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '2px', background: '#2a7a5e' }} />
            <span style={{ fontSize: '12px', color: '#2a7a5e', fontWeight: 600, letterSpacing: '0.04em' }}>The Gap</span>
          </div>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 700, marginBottom: '40px', letterSpacing: '-0.5px',
          }}>Why good candidates still struggle</h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px', background: '#e0ddd5', borderRadius: '16px', overflow: 'hidden',
          }}>
            {[
              {
                icon: (
                  <Image src="/mindgym-icon.png" alt="MindGym icon" width={24} height={24} style={{ objectFit: 'contain' }} />
                ),
                iconBg: '#e8f4ef',
                title: 'Anxiety under pressure',
                body: 'Your mind blanks and everything you prepared evaporates the moment the stakes feel real.',
              },
              {
                icon: <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '-1px', color: '#fff' }}>B A</span>,
                iconBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                title: 'Thinking on the spot',
                body: 'When panellists push back, the mental load of real-time thinking under scrutiny overwhelms preparation.',
              },
              {
                icon: <span style={{ fontSize: '16px', color: '#2a7a5e' }}>↗</span>,
                iconBg: '#e8f4ef',
                title: 'Confidence erosion',
                body: "Repeated rejections erode the belief that you belong in the rooms you're applying for — a cycle that compounds.",
              },
            ].map((card) => (
              <div key={card.title} style={{ background: '#fff', padding: '32px 28px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: card.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#666', lineHeight: 1.65 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — AUDIENCE ── */}
      <section   id="how-it-works" style={{ padding: '72px 48px', background: '#F5F4F0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '2px', background: '#2a7a5e' }} />
                <span style={{ fontSize: '12px', color: '#2a7a5e', fontWeight: 600, letterSpacing: '0.04em' }}>How It Works</span>
              </div>
              <h2 style={{
                fontFamily: "'Georgia', serif", fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px',
              }}>Built for anyone facing high-pressure moments</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.75, paddingTop: '40px' }}>
              Whether you're interviewing for the first time or navigating a difficult conversation at senior level — the mental challenge is the same. MindGym trains the mind you'll need to perform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { icon: '👤', title: 'Job Seekers', body: 'Navigating a stressful search and want to show up at their best in every interview.' },
              { icon: '🎓', title: 'Students', body: 'Entering the job market and building confidence for their first high-stakes interviews.' },
              { icon: '💼', title: 'Professionals', body: 'Making a move after years in one role — rebuilding interview confidence from scratch.' },
              { icon: '👥', title: 'Leaders', body: 'Preparing for board presentations, difficult conversations, or high-stakes negotiations.' },
            ].map(card => (
              <div key={card.title} style={{ background: '#eeecea', borderRadius: '14px', padding: '28px 22px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#d4ebe3', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', marginBottom: '16px',
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{card.title}</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>{card.body}</p>
                <a href="#" style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 600, textDecoration: 'none' }}>Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERFORMANCE LOOP ── */}
      <section style={{ padding: '80px 48px', background: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '2px', background: '#2a7a5e' }} />
              <span style={{ fontSize: '12px', color: '#2a7a5e', fontWeight: 600, letterSpacing: '0.04em' }}>How It Works</span>
            </div>
            <h2 style={{
              fontFamily: "'Georgia', serif", fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '16px',
            }}>A performance loop designed to compound</h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>
              MindGym doesn't prep you once — it builds a cycle that gets stronger every time you use it.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '8px' }}>
            {[
              { n: '1', title: 'Strategy', body: 'Your coach identifies your mindset gap and hunting gap from onboarding. Every session is personalised to your specific pressure point.' },
              { n: '2', title: 'Action', body: "Short, focused sessions — breathing, visualisation, confidence anchoring — targeted to what you're actually facing right now." },
              { n: '3', title: 'Recovery', body: "After every session, your coach records your anxiety before and after. The data shows you it's working — which compounds confidence over time." },
            ].map((step, i) => (
              <div key={step.n} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: i < 2 ? '#1a3d32' : '#d4ebe3',
                  color: i < 2 ? '#fff' : '#2a7a5e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700,
                }}>{step.n}</div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{step.title}</h4>
                  <p style={{ fontSize: '13.5px', color: '#666', lineHeight: 1.65 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK STATS BAR ── */}
      <section style={{ background: '#1a3d32', padding: '56px 48px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { val: '−3.2', label: 'Average anxiety\nreduction per session' },
            { val: '89%', label: 'Feel more prepared\nafter 5 sessions' },
            { val: '4.8', label: 'Average confidence\nrating post-session' },
            { val: '50k+', label: 'Sessions completed\nby professionals' },
          ].map((stat, i) => (
            <div key={stat.val} style={{
              textAlign: 'center', padding: '0 24px',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>{stat.val}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '8px', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" style={{ padding: '80px 48px', background: '#F5F4F0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '48px', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '2px', background: '#2a7a5e' }} />
                <span style={{ fontSize: '12px', color: '#2a7a5e', fontWeight: 600, letterSpacing: '0.04em' }}>Testimonials</span>
              </div>
              <h2 style={{
                fontFamily: "'Georgia', serif", fontSize: '28px',
                fontWeight: 700, lineHeight: 1.25, marginBottom: '24px',
              }}>What our clients say</h2>
              <button style={{
                border: '1.5px solid #1a1a1a', background: 'transparent', padding: '10px 20px',
                borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}>View all reviews</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                {
                  text: '"I\'d bombed two final rounds before MindGym. Not because I didn\'t know my answers — because I froze. The visualisation session the morning of my Google interview changed everything."',
                  name: 'Adaora D.', meta: 'Product Designer · Hired at Google', initials: 'AD', featured: true,
                },
                {
                  text: "I was a career switcher trying to break into UX. Your coach's rejection recovery sessions kept me moving when I genuinely wanted to stop.",
                  name: 'James M.', meta: 'Career switcher · Now UX Lead', initials: 'JM', featured: false,
                },
                {
                  text: "I was a career switcher trying to break into UX. Your coach's rejection recovery sessions kept me moving when I genuinely wanted to stop.",
                  name: 'James M.', meta: 'Career switcher · Now UX Lead', initials: 'JM', featured: false,
                },
                {
                  text: "The pre/post anxiety scoring was what got me. I could see in numbers that it was actually working. By session 4, I stopped dreading final rounds.",
                  name: 'Priya O.', meta: 'Senior PM · Hired at Stripe', initials: 'PO', featured: false,
                },
              ].map((t, i) => (
                <div key={i} style={{
                  background: t.featured ? '#1a3d32' : '#fff',
                  borderRadius: '14px', padding: '24px',
                  color: t.featured ? '#fff' : '#1a1a1a',
                }}>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.7, marginBottom: '20px', color: t.featured ? 'rgba(255,255,255,0.9)' : '#333' }}>
                    {t.text}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: t.featured ? '#2a5a46' : '#e0ddd5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700,
                        color: t.featured ? '#fff' : '#666',
                      }}>{t.initials}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: '11px', color: t.featured ? 'rgba(255,255,255,0.6)' : '#999' }}>{t.meta}</div>
                      </div>
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '12px' }}>★★★★★</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '80px 48px', background: '#F5F4F0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
            <div style={{ width: '28px', height: '2px', background: '#2a7a5e' }} />
            <span style={{ fontSize: '12px', color: '#2a7a5e', fontWeight: 600, letterSpacing: '0.04em' }}>FAQ</span>
          </div>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 700, textAlign: 'center', marginBottom: '48px', letterSpacing: '-0.5px',
          }}>Questions we hear often</h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '15px', fontWeight: 600, textAlign: 'left', color: '#1a1a1a',
                  }}
                >
                  {faq.q}
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: '1.5px solid rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', flexShrink: 0, marginLeft: '16px', color: '#666',
                  }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, paddingBottom: '20px', paddingRight: '40px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: '#fff', padding: '80px 48px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
            <div style={{ width: '28px', height: '2px', background: '#2a7a5e' }} />
            <span style={{ fontSize: '12px', color: '#2a7a5e', fontWeight: 600, letterSpacing: '0.04em' }}>Start today</span>
          </div>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 700, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.5px',
          }}>The next interview shouldn't feel harder than it has to.</h2>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>
            Train your confidence before the pressure hits.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push("/sign-up")}
            style={{
              background: '#1a3d32', color: '#fff', border: 'none',
              padding: '13px 30px', borderRadius: '8px', fontSize: '15px',
              fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            }}>Start free trial →</button>
            <button onClick={() => router.push("/login")}
            style={{
              background: '#eeecea', color: '#1a1a1a', border: 'none',
              padding: '13px 30px', borderRadius: '8px', fontSize: '15px',
              fontWeight: 500, cursor: 'pointer',
            }}>Already have an account?</button>
          </div>
          <p style={{ fontSize: '12px', color: '#aaa', marginTop: '16px' }}>No credit card required · Cancel any time</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#1a3d32', padding: '28px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo in footer — white variant; falls back gracefully if logo has transparent bg */}
        <Image src="/logo.png" alt="MindGym" width={100} height={28} style={{ objectFit: 'contain', }} />
        <div style={{ display: 'flex', gap: '28px' }}>
          {['About', 'Privacy', 'Terms', 'Contact', 'FAQ'].map(item => (
            <a key={item} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}