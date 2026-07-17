import React, { useState } from 'react';
import { Send, MapPin, Calendar, Compass, Sparkles } from 'lucide-react';

export default function InputForm({ onSubmit, loading, initialPrompt }) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('4');
  const [style, setStyle] = useState('Balanced');

  // If a suggestion card overrides the initialPrompt:
  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onSubmit({
      prompt: prompt.trim(),
      destination: destination.trim(),
      duration: parseInt(duration),
      style
    });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          
          {/* Destination input */}
          <div className="form-group">
            <label className="form-label" htmlFor="destination">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} style={{ color: 'var(--color-saffron)' }} /> Indian Destination (Optional)
              </span>
            </label>
            <input
              id="destination"
              type="text"
              className="form-input"
              placeholder="e.g. Rajasthan, Kerala, Ladakh, Varanasi"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Duration picker */}
          <div className="form-group">
            <label className="form-label" htmlFor="duration">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} style={{ color: 'var(--color-saffron)' }} /> Duration (Days)
              </span>
            </label>
            <select
              id="duration"
              className="form-select"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={loading}
            >
              {[...Array(14)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'Day' : 'Days'}
                </option>
              ))}
            </select>
          </div>

          {/* Style select */}
          <div className="form-group">
            <label className="form-label" htmlFor="style">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Compass size={15} style={{ color: 'var(--color-saffron)' }} /> Travel Vibe
              </span>
            </label>
            <select
              id="style"
              className="form-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={loading}
            >
              <option value="Balanced">Balanced (Sightseeing & Rest)</option>
              <option value="Budget-Friendly">Budget-Friendly</option>
              <option value="Luxury / Premium">Luxury / Premium</option>
              <option value="Adventure & Active">Adventure & Active</option>
              <option value="Relaxed & Slow-paced">Relaxed & Slow-paced</option>
              <option value="Food & Culture Focus">Food & Culture Focus</option>
            </select>
          </div>
        </div>

        {/* Free-form text description */}
        <div className="form-group">
          <label className="form-label" htmlFor="prompt">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} style={{ color: 'var(--color-saffron)' }} /> Describe your dream Indian trip
            </span>
          </label>
          <textarea
            id="prompt"
            className="form-textarea"
            rows={3}
            placeholder="e.g. A 5-day cultural trip to Rajasthan. I want to visit historic palaces in Jaipur, go boating on Udaipur's lakes, try local Dal Baati Churma thalis, and enjoy a desert sunset."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            required
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'flex-end', marginTop: '2px' }}>
            {prompt.length} characters (minimum 10 recommended)
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !prompt.trim()}
          style={{ padding: '0.9rem', fontSize: '1rem', width: '100%' }}
        >
          <Send size={18} />
          {loading ? "Designing Your Indian Journey..." : "Generate Custom Itinerary"}
        </button>
      </form>
    </div>
  );
}
