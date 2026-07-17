import React from 'react';
import { Bookmark, X, Trash2, Map, MapPin, Calendar, Eye } from 'lucide-react';

export default function SavePlansSidebar({ savedPlans, onLoadPlan, onDeletePlan, isOpen, onClose }) {
  return (
    <>
      {/* Backdrop overlay for mobile & tablet */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Sidebar Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '320px',
          maxWidth: '85vw',
          background: 'rgba(252, 251, 254, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid var(--border-glass)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            <Bookmark size={18} style={{ color: 'var(--color-indigo)' }} />
            Saved Itineraries
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Saved plans list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {savedPlans.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Map size={36} style={{ strokeWidth: 1.5, opacity: 0.5 }} />
              <span>No saved trips yet. Generate a trip and save it to review here!</span>
            </div>
          ) : (
            savedPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '0.8rem',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    paddingRight: '2rem',
                    lineHeight: '1.3'
                  }}>
                    {plan.tripTitle}
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.25rem'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <MapPin size={12} style={{ color: 'var(--color-teal)' }} /> {plan.destination || "Multiple Locations"}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Calendar size={12} style={{ color: 'var(--color-indigo)' }} /> {plan.durationDays} days
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.4rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                  paddingTop: '0.6rem'
                }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      onLoadPlan(plan);
                      onClose();
                    }}
                    style={{
                      flex: 1,
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <Eye size={12} /> View
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDeletePlan(plan.id)}
                    style={{
                      padding: '0.4rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete Saved Trip"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
