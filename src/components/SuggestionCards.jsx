import React from 'react';
import { ChefHat, Landmark, Compass } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: "Golden Triangle Cultural Odyssey",
    description: "4-day historic circuit through Delhi, Agra (Taj Mahal), and the pink city of Jaipur.",
    icon: Landmark,
    color: "var(--color-saffron)",
    bg: "rgba(249, 115, 22, 0.08)",
    border: "rgba(249, 115, 22, 0.2)",
    prompt: "A 4-day historic itinerary of India's Golden Triangle covering Delhi, Agra (Taj Mahal sunrise visit), and Jaipur. Mid-range budget, focusing on massive Mughal forts, local bazaars, street shopping, and heritage tours."
  },
  {
    title: "Kerala Serenade & Backwaters",
    description: "6-day nature escape through tea gardens in Munnar and private houseboats in Alleppey backwaters.",
    icon: Compass,
    color: "var(--color-emerald)",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.2)",
    prompt: "A relaxing 6-day nature-focused itinerary in Kerala covering Munnar tea gardens, a spice plantation tour in Thekkady, and a private overnight houseboat cruise in Alleppey backwaters."
  },
  {
    title: "Goa Heritage & Sunsets",
    description: "5-day balanced getaway visiting Portuguese architecture, spice farms, and beach sunsets.",
    icon: ChefHat,
    color: "var(--color-peacock)",
    bg: "rgba(14, 165, 233, 0.08)",
    border: "rgba(14, 165, 233, 0.2)",
    prompt: "A vibrant 5-day itinerary in Goa. Mix of Old Goa Portuguese churches, local organic spice farms, delicious Konkani seafood tastings, and sunset viewings at Vagator and Palolem beaches."
  }
];

export default function SuggestionCards({ onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <h4 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        letterSpacing: '0.03em',
        marginBottom: '0.2rem'
      }}>
        Popular Indian circuits to try:
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="glass-panel"
              onClick={() => onSelect(item.prompt)}
              style={{
                textAlign: 'left',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                background: item.bg,
                borderColor: item.border,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.boxShadow = `0 8px 20px -5px ${item.border}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = item.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.6rem',
                borderRadius: '0.6rem',
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)'
                }}>
                  {item.title}
                </span>
                <span style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
