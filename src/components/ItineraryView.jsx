import React, { useState } from 'react';
import { Bookmark, Plus, RefreshCw, Trash2, Calendar, MapPin, Compass } from 'lucide-react';
import StopCard from './StopCard';

export default function ItineraryView({ 
  itinerary, 
  onUpdateStop, 
  onDeleteStop, 
  onMoveStop, 
  onMoveStopToDay,
  onAddStop,
  onReorderStops,
  onSavePlan,
  isSaved,
  onReset
}) {
  const [activeDay, setActiveDay] = useState(1);
  const [draggedStopId, setDraggedStopId] = useState(null);

  const activeDayData = itinerary.days.find(d => d.dayNumber === activeDay) || itinerary.days[0];
  const allDays = itinerary.days.map(d => d.dayNumber);

  // Drag & Drop handlers
  const handleDragStart = (e, stopId) => {
    e.dataTransfer.setData('text/plain', stopId);
    setDraggedStopId(stopId);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    setDraggedStopId(null);
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStopId) => {
    e.preventDefault();
    const sourceStopId = e.dataTransfer.getData('text/plain');
    if (sourceStopId === targetStopId) return;
    onReorderStops(activeDay, sourceStopId, targetStopId);
  };

  const handleCreateCustomStop = () => {
    const newStop = {
      id: `stop-custom-${Date.now()}`,
      title: "New Custom Activity",
      time: "12:00 PM",
      duration: "1 hour",
      location: "",
      description: "Click edit to describe this activity.",
      cost: "Free",
      category: "Activity",
      tips: ""
    };
    onAddStop(activeDay, newStop);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Title Panel */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {itinerary.tripTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '0.8rem' }}>
            {itinerary.summary}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <MapPin size={15} style={{ color: 'var(--color-teal)' }} />
              <strong>Destination:</strong> {itinerary.destination}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <Calendar size={15} style={{ color: 'var(--color-indigo)' }} />
              <strong>Duration:</strong> {itinerary.durationDays} Days
            </span>
          </div>
        </div>

        {/* Global actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={onReset}
            style={{ fontSize: '0.9rem' }}
          >
            <RefreshCw size={15} /> Plan Another
          </button>
          
          <button 
            className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
            onClick={onSavePlan}
            disabled={isSaved}
            style={{ fontSize: '0.9rem' }}
          >
            <Bookmark size={15} />
            {isSaved ? "Saved to History" : "Save Itinerary"}
          </button>
        </div>
      </div>

      {/* Days Tabs Selection */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        {itinerary.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(day.dayNumber)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              border: '1px solid transparent',
              outline: 'none',
              background: activeDay === day.dayNumber ? 'linear-gradient(135deg, var(--color-indigo) 0%, var(--color-purple) 100%)' : 'rgba(255, 255, 255, 0.03)',
              color: activeDay === day.dayNumber ? '#fff' : 'var(--text-secondary)',
              borderColor: activeDay === day.dayNumber ? 'transparent' : 'var(--border-glass)',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s ease'
            }}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Active Day Detail Timeline */}
      {activeDayData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
              {activeDayData.dayTitle || `Day ${activeDay}`}
            </h3>
            
            <button 
              className="btn btn-secondary"
              onClick={handleCreateCustomStop}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', borderRadius: '0.6rem' }}
            >
              <Plus size={14} /> Add Custom Stop
            </button>
          </div>

          {activeDayData.stops.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Compass size={32} style={{ strokeWidth: 1.5, marginBottom: '0.75rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No stops for this day. Click "Add Custom Stop" above to insert one!</p>
            </div>
          ) : (
            <div className="timeline">
              {activeDayData.stops.map((stop, idx) => (
                <div 
                  key={stop.id} 
                  style={{ marginBottom: '1.25rem', position: 'relative' }}
                >
                  {/* Timeline point indicator */}
                  <div style={{
                    position: 'absolute',
                    left: '-28px',
                    top: '20px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'var(--bg-main)',
                    border: '3px solid var(--color-indigo)',
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)',
                    zIndex: 2
                  }} />

                  <StopCard 
                    stop={stop}
                    isFirst={idx === 0}
                    isLast={idx === activeDayData.stops.length - 1}
                    allDays={allDays}
                    onUpdateStop={(updatedStop) => onUpdateStop(activeDay, updatedStop)}
                    onDeleteStop={() => onDeleteStop(activeDay, stop.id)}
                    onMoveUp={() => onMoveStop(activeDay, idx, 'up')}
                    onMoveDown={() => onMoveStop(activeDay, idx, 'down')}
                    onMoveToDay={(toDay) => onMoveToDay(activeDay, stop.id, toDay)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
