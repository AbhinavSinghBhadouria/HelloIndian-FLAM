import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Edit2, Trash2, Check, X, 
  MapPin, Clock, DollarSign, Lightbulb, ArrowUp, ArrowDown, Move
} from 'lucide-react';

export default function StopCard({ 
  stop, 
  onUpdateStop, 
  onDeleteStop, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast,
  allDays,
  onMoveToDay,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [title, setTitle] = useState(stop.title || '');
  const [time, setTime] = useState(stop.time || '');
  const [duration, setDuration] = useState(stop.duration || '');
  const [location, setLocation] = useState(stop.location || '');
  const [description, setDescription] = useState(stop.description || '');
  const [cost, setCost] = useState(stop.cost || '');
  const [category, setCategory] = useState(stop.category || 'Sightseeing');
  const [tips, setTips] = useState(stop.tips || '');

  const handleSave = (e) => {
    e.stopPropagation();
    onUpdateStop({
      ...stop,
      title: title.trim(),
      time: time.trim(),
      duration: duration.trim(),
      location: location.trim(),
      description: description.trim(),
      cost: cost.trim(),
      category,
      tips: tips.trim()
    });
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    // Reset states
    setTitle(stop.title || '');
    setTime(stop.time || '');
    setDuration(stop.duration || '');
    setLocation(stop.location || '');
    setDescription(stop.description || '');
    setCost(stop.cost || '');
    setCategory(stop.category || 'Sightseeing');
    setTips(stop.tips || '');
    setIsEditing(false);
  };

  const getBadgeClass = (cat) => {
    const lowercaseCat = (cat || '').toLowerCase();
    if (lowercaseCat.includes('food') || lowercaseCat.includes('dine') || lowercaseCat.includes('restaurant')) return 'badge-food';
    if (lowercaseCat.includes('sight') || lowercaseCat.includes('landmark') || lowercaseCat.includes('visit')) return 'badge-sightseeing';
    if (lowercaseCat.includes('shopping') || lowercaseCat.includes('market') || lowercaseCat.includes('store')) return 'badge-shopping';
    if (lowercaseCat.includes('transit') || lowercaseCat.includes('train') || lowercaseCat.includes('bus') || lowercaseCat.includes('flight')) return 'badge-transit';
    if (lowercaseCat.includes('relax') || lowercaseCat.includes('spa') || lowercaseCat.includes('beach') || lowercaseCat.includes('hotel')) return 'badge-relaxing';
    return 'badge-activity'; // Default
  };

  return (
    <div 
      className="glass-panel animate-fade-in draggable-stop"
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, stop.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stop.id)}
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        borderLeft: `4px solid ${
          category.toLowerCase().includes('food') ? 'var(--color-gold)' :
          category.toLowerCase().includes('sight') ? 'var(--color-saffron)' :
          category.toLowerCase().includes('shop') ? 'var(--color-rose)' :
          category.toLowerCase().includes('transit') ? 'var(--color-peacock)' :
          category.toLowerCase().includes('relax') ? 'var(--color-emerald)' :
          'var(--color-purple)'
        }`,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        background: 'var(--bg-card)'
      }}
    >
      {isEditing ? (
        /* EDITING MODE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onClick={(e) => e.stopPropagation()}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-indigo)' }}>
            Edit Stop Details
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Stop Title</label>
              <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem' }} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Time</label>
              <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem' }} value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 09:00 AM" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Duration</label>
              <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem' }} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2 hours" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Estimated Cost</label>
              <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem' }} value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g. Free, $15" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Category</label>
              <select className="form-select" style={{ padding: '0.5rem 0.75rem' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Activity / Experience">Activity / Experience</option>
                <option value="Shopping">Shopping</option>
                <option value="Transit / Flight">Transit / Flight</option>
                <option value="Relaxing">Relaxing</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Location / Address</label>
              <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem' }} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Address or neighborhood" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Description</label>
            <textarea className="form-textarea" rows={2} style={{ padding: '0.5rem 0.75rem' }} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Insider Tips</label>
            <input type="text" className="form-input" style={{ padding: '0.5rem 0.75rem' }} value={tips} onChange={(e) => setTips(e.target.value)} placeholder="e.g. Best photo spots, booking online" />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
            <button className="btn btn-secondary" onClick={handleCancel} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <X size={14} /> Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <Check size={14} /> Save Changes
            </button>
          </div>
        </div>
      ) : (
        /* NORMAL VIEW MODE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          {/* Header Row (Summary) */}
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flexShrink: 0 }}>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  color: 'var(--color-indigo)' 
                }}>
                  <Clock size={12} /> {stop.time || 'Flexible'}
                </span>
                {stop.duration && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({stop.duration})
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0, flex: 1 }}>
                <h4 style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '0.98rem', 
                  fontWeight: 700, 
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {stop.title}
                </h4>
                <span className={`badge ${getBadgeClass(stop.category)}`} style={{ alignSelf: 'flex-start' }}>
                  {stop.category || 'Sightseeing'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              {/* Drag Handle Indicator */}
              <div style={{ color: 'var(--text-muted)', display: 'flex', padding: '0.25rem', cursor: 'grab' }} title="Drag to reorder">
                <Move size={14} />
              </div>
              
              <div style={{ color: 'var(--text-muted)' }}>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
          </div>

          {/* Expanded Content Details */}
          {isExpanded && (
            <div style={{ 
              marginTop: '0.6rem', 
              paddingTop: '0.8rem', 
              borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              animation: 'fadeIn 0.25s ease'
            }}>
              {/* Description */}
              {stop.description && (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {stop.description}
                </p>
              )}

              {/* Location & Cost Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {stop.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} style={{ color: 'var(--color-teal)' }} />
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dotted var(--text-muted)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {stop.location}
                    </a>
                  </span>
                )}
                {stop.cost && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <DollarSign size={13} style={{ color: 'var(--color-emerald)' }} />
                    Cost: {stop.cost}
                  </span>
                )}
              </div>

              {/* Action Tips */}
              {stop.tips && (
                <div style={{ 
                  background: 'rgba(124, 58, 237, 0.05)', 
                  border: '1px solid var(--border-glass)',
                  borderRadius: '0.6rem',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.4rem'
                }}>
                  <Lightbulb size={14} style={{ color: 'var(--color-saffron)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.82rem' }}>Tip: </strong>
                    {stop.tips}
                  </div>
                </div>
              )}

              {/* Edit, Move Day, Reordering Row */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '0.8rem',
                marginTop: '0.4rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                paddingTop: '0.8rem'
              }}>
                {/* Reorder Buttons (Up/Down) & Move to Day select */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                    disabled={isFirst}
                    style={{ padding: '0.35rem 0.6rem', borderRadius: '0.5rem' }}
                    title="Move stop earlier"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                    disabled={isLast}
                    style={{ padding: '0.35rem 0.6rem', borderRadius: '0.5rem' }}
                    title="Move stop later"
                  >
                    <ArrowDown size={13} />
                  </button>

                  {/* Day migration selector */}
                  {allDays && allDays.length > 1 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Move to:</span>
                      <select
                        className="form-select"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            onMoveToDay(parseInt(e.target.value));
                            e.target.value = "";
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                      >
                        <option value="" disabled>Day...</option>
                        {allDays.map(dayNum => (
                          <option key={dayNum} value={dayNum}>Day {dayNum}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Edit & Delete stop */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', borderRadius: '0.5rem' }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={(e) => { e.stopPropagation(); onDeleteStop(); }}
                    style={{ padding: '0.35rem 0.5rem', borderRadius: '0.5rem' }}
                    title="Delete Stop"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
