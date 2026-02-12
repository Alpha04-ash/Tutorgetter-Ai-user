'use client';

import { useState, useEffect } from 'react';
import UserRegistration from '../components/UserRegistration';
import { useRouter } from 'next/navigation';
import HoloButton from '../components/HoloButton';
import GlassCard from '../components/GlassCard';
import { Sparkles, ArrowRight, Briefcase, ChevronRight, Code, Terminal, Cpu } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<'landing' | 'vacancies' | 'registration'>('landing');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    if (step === 'vacancies') {
      fetch('/api/categories') // Using relative path
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error(err));
    }
  }, [step]);

  const handleRegistrationComplete = (user: any) => {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    router.push(selectedCategory ? `/user/assessment/${selectedCategory.id}` : '/user');
  };

  const handleVacancySelect = (category: any) => {
    setSelectedCategory(category);
    setStep('registration');
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'transparent' }}> {/* Transparent to let layout 3D bg show */}

      {/* Step 1: Landing View */}
      {step === 'landing' && (
        <div style={{
          margin: 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.5rem',
          maxWidth: '900px',
          width: '100%',
          zIndex: 10,
          animation: 'fadeIn 0.6s ease-out'
        }}>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '200px', height: '200px', background: 'rgba(56, 189, 248, 0.2)', filter: 'blur(80px)', borderRadius: '50%', zIndex: -1
            }} />
            <h1 className="cosmic-text-gradient" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
              Do you want to work <br /> in Softclub?
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Prove your skills. Join the elite. <br />
              Our AI-powered assessment identifies true talent.
            </p>
          </div>

          <HoloButton
            onClick={() => setStep('vacancies')}
            style={{
              marginTop: '1.5rem',
              padding: '1.2rem 3.5rem',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderRadius: '50px'
            }}
          >
            Start Your Journey <ArrowRight size={24} />
          </HoloButton>

        </div>
      )}

      {/* Step 2: Vacancy List */}
      {step === 'vacancies' && (
        <div style={{
          width: '100%', maxWidth: '1000px', margin: 'auto', zIndex: 10, animation: 'fadeIn 0.5s ease-out',
          display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 className="cosmic-text-gradient" style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Open Positions</h2>
            <p style={{ color: '#cbd5e1' }}>Select a role to begin your assessment.</p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%'
          }}>
            {categories.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading vacancies...</div>
            ) : (
              categories.map((cat) => (
                <GlassCard
                  key={cat.id}
                  className="group"
                  style={{
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onClick={() => handleVacancySelect(cat)}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                    background: 'linear-gradient(to bottom, #38bdf8, #818cf8)', opacity: 0, transition: '0.3s'
                  }} className="group-hover:opacity-100" />

                  <div style={{
                    width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', marginBottom: '0.5rem'
                  }}>
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      {cat.description || "Join our team as a " + cat.name + " developer."}
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.9rem', fontWeight: 500 }}>
                    Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              ))
            )}
          </div>

          <button
            onClick={() => setStep('landing')}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '2rem', fontSize: '0.9rem', textDecoration: 'underline' }}
          >
            ← Back to Home
          </button>
        </div>
      )}

      {/* Step 3: Registration */}
      {step === 'registration' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s ease-out', zIndex: 10 }}>
          {selectedCategory && (
            <div style={{
              marginBottom: '2rem', padding: '0.75rem 1.5rem', background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '30px', color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              Applying for: <span style={{ fontWeight: 600, color: '#38bdf8' }}>{selectedCategory.name}</span>
            </div>
          )}
          <UserRegistration onComplete={handleRegistrationComplete} />

          <button
            onClick={() => setStep('vacancies')}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '1.5rem', fontSize: '0.9rem' }}
          >
            Change Position
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .group-hover\\:opacity-100:hover { opacity: 1 !important; }
        .group-hover\\:translate-x-1:hover { transform: translateX(4px); }
      `}</style>
    </main>
  );
}
