import React, { useState, useEffect, useRef } from 'react';
import { Compass, Bookmark, Menu, X, Landmark, PlaneTakeoff, Info } from 'lucide-react';
import InputForm from './components/InputForm';
import SuggestionCards from './components/SuggestionCards';
import StatusMessage from './components/StatusMessage';
import ItineraryView from './components/ItineraryView';
import SavePlansSidebar from './components/SavePlansSidebar';

const BACKGROUNDS = ['/kashmir.jpg', '/taj.png', '/kerala.jpg', '/puri.jpg'];

export default function App() {
  // App primary states
  const [promptInput, setPromptInput] = useState('');
  const [status, setStatus] = useState('empty'); // 'empty', 'loading', 'error', 'success'
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [bgImage, setBgImage] = useState('/kashmir.jpg');
  
  // LocalStorage Saved Trips
  const [savedPlans, setSavedPlans] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-cycle backgrounds every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgImage((prev) => {
        const currentIndex = BACKGROUNDS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % BACKGROUNDS.length;
        return BACKGROUNDS[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // References to prevent race conditions & control requests
  const currentRequestId = useRef(0);
  const activeControllerRef = useRef(null);

  // Load saved plans from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hello_indian_plans');
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load saved plans from localStorage:", err);
    }
  }, []);

  // Save changes to localStorage
  const updateSavedPlans = (newPlans) => {
    setSavedPlans(newPlans);
    try {
      localStorage.setItem('hello_indian_plans', JSON.stringify(newPlans));
    } catch (err) {
      console.error("Failed to save plans to localStorage:", err);
    }
  };

  // Generate Itinerary API call
  const handleGenerateItinerary = async (formData) => {
    currentRequestId.current += 1;
    const reqId = currentRequestId.current;

    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;

    setStatus('loading');
    setError(null);
    setErrorMsg('');
    setItinerary(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      if (reqId !== currentRequestId.current) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Server error: ${response.status}`);
      }

      const enrichedItinerary = {
        ...data,
        id: `plan-${Date.now()}`,
        promptConfig: formData
      };

      setItinerary(enrichedItinerary);
      setStatus('success');
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`Request ID ${reqId} aborted.`);
        return;
      }
      
      if (reqId === currentRequestId.current) {
        console.error("Failed to generate itinerary:", err);
        setError(err.name);
        setErrorMsg(err.message || "Failed to generate itinerary. Please try again.");
        setStatus('error');
      }
    } finally {
      if (reqId === currentRequestId.current) {
        activeControllerRef.current = null;
      }
    }
  };

  // Pre-fill prompt from suggestion card
  const handleSelectSuggestion = (prompt) => {
    setPromptInput(prompt);
    document.getElementById('prompt')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update Stop details (save edited stop in state)
  const handleUpdateStop = (dayNumber, updatedStop) => {
    if (!itinerary) return;

    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          stops: day.stops.map((stop) => (stop.id === updatedStop.id ? updatedStop : stop)),
        };
      }
      return day;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    setIsSaved(false);
  };

  // Delete Stop from itinerary
  const handleDeleteStop = (dayNumber, stopId) => {
    if (!itinerary) return;

    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          stops: day.stops.filter((stop) => stop.id !== stopId),
        };
      }
      return day;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    setIsSaved(false);
  };

  // Add a new empty custom stop
  const handleAddStop = (dayNumber, newStop) => {
    if (!itinerary) return;

    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          stops: [...day.stops, newStop],
        };
      }
      return day;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    setIsSaved(false);
  };

  // Move Stop Up/Down in index
  const handleMoveStop = (dayNumber, index, direction) => {
    if (!itinerary) return;

    const activeDayIndex = itinerary.days.findIndex((d) => d.dayNumber === dayNumber);
    if (activeDayIndex === -1) return;

    const day = itinerary.days[activeDayIndex];
    const stops = [...day.stops];

    if (direction === 'up' && index > 0) {
      [stops[index], stops[index - 1]] = [stops[index - 1], stops[index]];
    } else if (direction === 'down' && index < stops.length - 1) {
      [stops[index], stops[index + 1]] = [stops[index + 1], stops[index]];
    }

    const updatedDays = itinerary.days.map((d) => {
      if (d.dayNumber === dayNumber) {
        return { ...d, stops };
      }
      return d;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    setIsSaved(false);
  };

  // Move Stop to another day completely
  const handleMoveStopToDay = (fromDayNumber, stopId, toDayNumber) => {
    if (!itinerary) return;

    const sourceDay = itinerary.days.find((d) => d.dayNumber === fromDayNumber);
    const targetDay = itinerary.days.find((d) => d.dayNumber === toDayNumber);
    if (!sourceDay || !targetDay) return;

    const stopToMove = sourceDay.stops.find((s) => s.id === stopId);
    if (!stopToMove) return;

    const updatedSourceStops = sourceDay.stops.filter((s) => s.id !== stopId);
    const updatedTargetStops = [...targetDay.stops, stopToMove];

    const updatedDays = itinerary.days.map((d) => {
      if (d.dayNumber === fromDayNumber) {
        return { ...d, stops: updatedSourceStops };
      }
      if (d.dayNumber === toDayNumber) {
        return { ...d, stops: updatedTargetStops };
      }
      return d;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    setIsSaved(false);
  };

  // Drag & drop reordering handler
  const handleReorderStops = (dayNumber, sourceStopId, targetStopId) => {
    if (!itinerary) return;

    const activeDayIndex = itinerary.days.findIndex((d) => d.dayNumber === dayNumber);
    if (activeDayIndex === -1) return;

    const day = itinerary.days[activeDayIndex];
    const stops = [...day.stops];

    const sourceIdx = stops.findIndex((s) => s.id === sourceStopId);
    const targetIdx = stops.findIndex((s) => s.id === targetStopId);

    if (sourceIdx === -1 || targetIdx === -1) return;

    const [removed] = stops.splice(sourceIdx, 1);
    stops.splice(targetIdx, 0, removed);

    const updatedDays = itinerary.days.map((d) => {
      if (d.dayNumber === dayNumber) {
        return { ...d, stops };
      }
      return d;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    setIsSaved(false);
  };

  // Save current itinerary to history
  const handleSavePlan = () => {
    if (!itinerary) return;
    
    const exists = savedPlans.some((p) => p.id === itinerary.id);
    if (exists) return;

    const updated = [itinerary, ...savedPlans];
    updateSavedPlans(updated);
    setIsSaved(true);
  };

  // Delete saved plan from history
  const handleDeleteSavedPlan = (planId) => {
    const updated = savedPlans.filter((p) => p.id !== planId);
    updateSavedPlans(updated);
    
    if (itinerary && itinerary.id === planId) {
      setIsSaved(false);
    }
  };

  // Load a plan from saved history
  const handleLoadPlan = (plan) => {
    setItinerary(plan);
    setStatus('success');
    setIsSaved(true);
    setPromptInput(plan.promptConfig?.prompt || '');
  };

  const handleReset = () => {
    setStatus('empty');
    setError(null);
    setItinerary(null);
    setIsSaved(false);
  };

  return (
    <div className="app-container">
      {/* Dynamic Background Image Wrapper */}
      <div className="bg-overlay-wrapper" style={{ backgroundImage: `url(${bgImage})` }} />

      {/* Drawer Sidebar for Saved Plans */}
      <SavePlansSidebar
        savedPlans={savedPlans}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={handleDeleteSavedPlan}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="main-content">
        
        {/* Header navigation bar */}
        <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <div style={{ textAlign: 'left' }}>
            <div className="app-logo">
              <Compass size={32} style={{ color: 'var(--color-saffron)', strokeWidth: 2.5 }} />
              HelloIndian
            </div>
            <p className="app-subtitle" style={{ margin: 0, textAlign: 'left' }}>
              Your ultimate day-by-day Indian travel itinerary planner.
            </p>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setIsSidebarOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Bookmark size={16} />
            Saved Plans ({savedPlans.length})
          </button>
        </header>

        {/* Input Form Panel */}
        <section>
          <InputForm
            onSubmit={handleGenerateItinerary}
            loading={status === 'loading'}
            initialPrompt={promptInput}
          />
        </section>

        {/* Core State Display: Empty Suggestions, Loading, Error, Success */}
        <main style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <StatusMessage
            status={status}
            error={error}
            message={errorMsg}
            onRetry={() => {
              const promptConfig = itinerary?.promptConfig || {
                prompt: promptInput || "Golden Triangle India trip",
                duration: 4,
                destination: "Delhi, Agra, Jaipur",
                style: "Balanced"
              };
              handleGenerateItinerary(promptConfig);
            }}
            onDemoFallback={() => {
              const promptConfig = {
                prompt: promptInput || "Golden Triangle Tour",
                duration: 4,
                destination: "Delhi, Agra, Jaipur",
                style: "Balanced",
                useFallback: true
              };
              handleGenerateItinerary(promptConfig);
            }}
          />

          {status === 'empty' && (
            <SuggestionCards onSelect={handleSelectSuggestion} />
          )}

          {status === 'success' && itinerary && (
            <ItineraryView
              itinerary={itinerary}
              isSaved={isSaved}
              onUpdateStop={handleUpdateStop}
              onDeleteStop={handleDeleteStop}
              onMoveStop={handleMoveStop}
              onMoveStopToDay={handleMoveStopToDay}
              onAddStop={handleAddStop}
              onReorderStops={handleReorderStops}
              onSavePlan={handleSavePlan}
              onReset={handleReset}
            />
          )}
        </main>

        {/* App Footer */}
        <footer style={{ 
          marginTop: 'auto', 
          paddingTop: '2rem', 
          borderTop: '1px solid var(--border-glass)', 
          textAlign: 'center', 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <div>HelloIndian • Created using React 19 & Gemini AI</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Info size={12} />
            <span>Interactive Drag & Drop: Drag handles or cards within a day to reorder stops!</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
