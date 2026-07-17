import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for development
app.use(cors());
app.use(express.json());

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-defined Indian Tour Mock Itinerary for Demo Fallback
const MOCK_ITINERARY = {
  tripTitle: "Golden Triangle Cultural Odyssey (Demo Mode)",
  destination: "Delhi, Agra, Jaipur (India)",
  durationDays: 4,
  summary: "A spectacular historical journey through India's Golden Triangle: Delhi, Agra (Taj Mahal), and Jaipur, exploring forts, local street food, and heritage sites.",
  days: [
    {
      dayNumber: 1,
      dayTitle: "Arrival in Delhi & Historic Old Delhi",
      stops: [
        {
          id: "stop-mock-1",
          title: "Jama Masjid Mosque",
          time: "09:30 AM",
          duration: "1.5 hours",
          location: "Old Delhi, Chandni Chowk",
          description: "Explore India's largest mosque, built by Shah Jahan. Climb the minaret for panoramic views of Old Delhi.",
          cost: "Free (Minaret climb ₹100)",
          category: "Sightseeing",
          tips: "Dress modestly. Robes are available at the entrance if needed."
        },
        {
          id: "stop-mock-2",
          title: "Chaat Walk at Chandni Chowk",
          time: "12:00 PM",
          duration: "2 hours",
          location: "Chandni Chowk Market, Old Delhi",
          description: "A street food adventure through paranthe wali gali. Try jalebis, dahi bhalla, and stuffed paranthas.",
          cost: "₹300 per person",
          category: "Food & Dining",
          tips: "Visit famous stalls like Natraj Dahi Bhalla and Old Famous Jalebi Wala."
        },
        {
          id: "stop-mock-3",
          title: "Red Fort (Lal Qila)",
          time: "02:30 PM",
          duration: "2 hours",
          location: "Netaji Subhash Marg, Old Delhi",
          description: "Visit the majestic red sandstone residence of the Mughal emperors.",
          cost: "₹50 (Indian), ₹600 (Foreigner)",
          category: "Sightseeing",
          tips: "Hire a certified guide or use the audio tour for rich history."
        }
      ]
    },
    {
      dayNumber: 2,
      dayTitle: "Taj Mahal & Agra Fort",
      stops: [
        {
          id: "stop-mock-4",
          title: "Sunrise at Taj Mahal",
          time: "05:30 AM",
          duration: "3 hours",
          location: "Taj East Gate Rd, Agra",
          description: "Experience the ultimate symbol of love as the morning sun casts a gold and pink glow over the white marble.",
          cost: "₹50 (Indian), ₹1100 (Foreigner)",
          category: "Sightseeing",
          tips: "Arrive 45 mins before sunrise to beat the security line. No big bags allowed."
        },
        {
          id: "stop-mock-5",
          title: "Agra Fort Palace Tour",
          time: "10:00 AM",
          duration: "2 hours",
          location: "Agra Fort, Rakabganj",
          description: "Tour the massive 16th-century red sandstone fortress where Shah Jahan was imprisoned.",
          cost: "₹50 (Indian), ₹650 (Foreigner)",
          category: "Sightseeing",
          tips: "Look through the octagonal tower window for a beautiful distant view of the Taj Mahal."
        }
      ]
    },
    {
      dayNumber: 3,
      dayTitle: "Enroute Jaipur via Fatehpur Sikri",
      stops: [
        {
          id: "stop-mock-6",
          title: "Fatehpur Sikri Complex",
          time: "09:00 AM",
          duration: "2.5 hours",
          location: "Fatehpur Sikri, Agra District",
          description: "Explore the ghost city of Emperor Akbar, featuring the massive Buland Darwaza.",
          cost: "₹50 (Indian), ₹610 (Foreigner)",
          category: "Sightseeing",
          tips: "Locals will offer guide services; it's best to hire an official ASI guide."
        },
        {
          id: "stop-mock-7",
          title: "Jaipur Local Shopping",
          time: "04:30 PM",
          duration: "3 hours",
          location: "Johari & Bapu Bazaar, Jaipur",
          description: "Browse traditional Rajasthani textiles, jewelry, puppets, and blue pottery.",
          cost: "Free entry",
          category: "Shopping",
          tips: "Bargaining is expected. Start at 50% of the quoted price."
        }
      ]
    },
    {
      dayNumber: 4,
      dayTitle: "Amber Fort & Palace Highlights",
      stops: [
        {
          id: "stop-mock-8",
          title: "Amber Fort hilltop Palace",
          time: "09:00 AM",
          duration: "3 hours",
          location: "Devisinghpura, Amer, Jaipur",
          description: "A stunning hilltop fort with Hindu-Mughal architectural synthesis. Visit the Mirror Palace.",
          cost: "₹100 (Indian), ₹550 (Foreigner)",
          category: "Sightseeing",
          tips: "Walk up the slope instead of taking an elephant ride to promote ethical tourism."
        },
        {
          id: "stop-mock-9",
          title: "Hawa Mahal (Palace of Winds)",
          time: "01:00 PM",
          duration: "1 hour",
          location: "Hawa Mahal Rd, Jaipur",
          description: "Photograph the iconic pink sandstone facade with 953 small windows.",
          cost: "₹50 (Indian), ₹200 (Foreigner)",
          category: "Sightseeing",
          tips: "Cross the street to Wind View Cafe for the best photo angle of the facade."
        }
      ]
    }
  ]
};

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint: POST /api/generate-itinerary
app.post('/api/generate-itinerary', async (req, res) => {
  const { prompt, duration, destination, style, useFallback } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Missing prompt",
      message: "Please describe your trip."
    });
  }

  // Check if we want to run in offline mock mode
  if (useFallback) {
    console.log("Serving offline mock itinerary for testing...");
    return res.json(MOCK_ITINERARY);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(401).json({
      error: "Missing API Key",
      message: "The Groq API key is missing. Please set the GROQ_API_KEY variable in your .env file."
    });
  }

  // Construct a clear and specific prompt for Groq
  const systemPrompt = `You are a professional Indian tour operator and travel guide expert.
You MUST generate a highly detailed day-by-day travel itinerary strictly within India.
You MUST return your response strictly as a JSON object matching this schema:
{
  "tripTitle": "Name of the trip",
  "destination": "Indian destination or region",
  "durationDays": 4,
  "summary": "Short overview of the trip",
  "days": [
    {
      "dayNumber": 1,
      "dayTitle": "Title of Day 1",
      "stops": [
        {
          "id": "stop-1",
          "title": "Attraction Name",
          "time": "09:00 AM",
          "duration": "2 hours",
          "location": "Specific location details",
          "description": "Details about the activity",
          "cost": "Estimated cost",
          "category": "Sightseeing / Food & Dining / Shopping / Adventure / Rest",
          "tips": "Practical tip for the visitor"
        }
      ]
    }
  ]
}

Rules:
1. Ensure all stops, sights, and activities are actual locations and attractions in India.
2. Suggest relevant Indian transit modes (such as Vande Bharat/Shatabdi express trains, auto-rickshaws, metro lines, local taxis, Shikara boats, or domestic flights).
3. Include specific local culinary recommendations (e.g., street food like chaat, regional delicacies like Dal Baati Churma, Konkani thali, or Appam).
4. Provide cultural tips (e.g., dress codes for temples, shoes off guidelines, best times to visit to beat crowds, bargaining hints).
5. Do NOT include any markdown code block formatting (such as \`\`\`json) or extra text. Output ONLY the raw JSON string.`;

  const userPrompt = `User Description: ${prompt}
${destination ? `Target Destination/Region in India: ${destination}` : ''}
${duration ? `Duration: ${duration} days` : ''}
${style ? `Travel Style/Vibe: ${style}` : ''}`;

  // Payload for Groq Chat Completion
  const payload = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errText}`);
    }

    const result = await response.json();
    const textContent = result?.choices?.[0]?.message?.content;
    
    if (!textContent) {
      throw new Error("Received empty response content from Groq API.");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(textContent);
    } catch (parseErr) {
      console.warn("Direct JSON parsing failed, attempting cleanup of code fences...");
      const cleaned = textContent.replace(/```json\s?|```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    if (!parsedData.tripTitle || !parsedData.days || !Array.isArray(parsedData.days)) {
      throw new Error("The AI returned a malformed response that does not contain 'tripTitle' or 'days'.");
    }

    let stopCounter = 1;
    parsedData.days = parsedData.days.map(day => {
      if (day.stops && Array.isArray(day.stops)) {
        day.stops = day.stops.map(stop => {
          if (!stop.id) {
            stop.id = `stop-auto-${stopCounter++}`;
          }
          return stop;
        });
      } else {
        day.stops = [];
      }
      return day;
    });

    res.json(parsedData);

  } catch (error) {
    console.error("API execution error:", error);
    
    let statusCode = 500;
    let errMessage = error.message || "Failed to communicate with AI model.";
    
    if (error.name === 'AbortError') {
      statusCode = 504;
      errMessage = "The AI model request timed out (took longer than 30 seconds). Please try a shorter or simpler description.";
    }

    res.status(statusCode).json({
      error: "Generation Failed",
      message: errMessage
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
