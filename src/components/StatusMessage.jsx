import React, { useState, useEffect } from 'react';
import { Compass, AlertTriangle, Sparkles, RefreshCw, Key } from 'lucide-react';

const LOADING_TIPS = [
  "Mapping the best Indian travel routes...",
  "Consulting local guides & regional experts...",
  "Checking Shatabdi and Vande Bharat timetables...",
  "Searching local bazaars and shopping recommendations...",
  "Sourcing local culinary thali spots...",
  "Double checking safety guidelines & monument timings...",
  "Preparing your custom interactive itinerary..."
];

export default function StatusMessage({ status, error, onRetry, onDemoFallback, message }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (status !== 'loading') return;
    
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % LOADING_TIPS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(249, 115, 22, 0.1)',
            borderTopColor: 'var(--color-saffron)',
            animation: 'spin 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite'
          }} />
          <div style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            border: '3px solid rgba(16, 185, 129, 0.1)',
            borderBottomColor: 'var(--color-emerald)',
            animation: 'spin 1.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite reverse'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--color-saffron)'
          }}>
            <Compass size={32} style={{ animation: 'pulse-ring 2s infinite' }} />
          </div>
        </div>
        
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            Designing Your Indian Journey
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', minHeight: '1.5rem', transition: 'all 0.3s ease' }}>
            {LOADING_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    const isApiKeyError = error?.includes('API key') || error?.includes('401') || message?.includes('API key') || message?.includes('API Key');

    return (
      <div className="glass-panel animate-fade-in" style={{
        padding: '2.5rem 2rem',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        background: 'rgba(244, 63, 94, 0.04)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-rose)'
        }}>
          {isApiKeyError ? <Key size={26} /> : <AlertTriangle size={26} />}
        </div>

        <div style={{ maxWidth: '500px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            {isApiKeyError ? "Missing or Invalid API Key" : "Failed to Plan Trip"}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '1rem' }}>
            {message || error || "An unexpected error occurred during trip generation."}
          </p>

          {isApiKeyError && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              borderRadius: '0.75rem',
              padding: '1rem',
              textAlign: 'left',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '1.25rem'
            }}>
              <strong>How to fix this:</strong>
              <ol style={{ paddingLeft: '1.25rem', marginTop: '0.4rem' }}>
                <li>Create a <code>.env</code> file in your project root.</li>
                <li>Add your key like this: <code>GROQ_API_KEY=your_key_here</code></li>
                <li>Restart the server (run <code>npm run dev</code> again).</li>
              </ol>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onRetry}>
            <RefreshCw size={16} />
            {isApiKeyError ? "Try Reconnecting" : "Retry Generation"}
          </button>
          
          <button className="btn btn-primary" onClick={onDemoFallback}>
            <Sparkles size={16} />
            Explore in Offline Demo Mode
          </button>
        </div>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="glass-panel animate-fade-in" style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(249, 115, 22, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-saffron)'
        }}>
          <Sparkles size={28} />
        </div>
        
        <div style={{ maxWidth: '450px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Where in India to next?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Enter your destination details above or choose one of our curated trip circuits below to generate your custom interactive itinerary.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
