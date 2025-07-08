# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server on port 3000
npm run dev

# Build for production (outputs to ../backend/src/main/resources/static)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

This is a Transportation Management System (TMS) frontend built with React, TypeScript, and Vite. The application uses a component-based architecture with recent refactoring that reduced file sizes by 80%+.

### Key Technologies
- **React 18.2** with TypeScript for UI
- **Vite** for fast development and building
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling (with custom Poppins font)
- **ApexCharts** for data visualization
- **React PDF** for document generation
- **Leaflet** for maps
- **Axios** for API calls

### Project Structure

The codebase follows a modular structure:
- **Pages** (`/src/pages/`): Route-level components
- **Components** (`/src/components/`): Reusable UI components organized by type
  - Generic `DataTable` component uses TypeScript generics for type-safe tables
  - Components are grouped by function (charts, dashboard, filters, forms, etc.)
- **Services** (`/src/services/`): API and business logic
- **Context** (`/src/context/`): React Context providers for global state
- **Hooks** (`/src/hooks/`): Custom hooks for complex state management
- **Types** (`/src/types/`): TypeScript type definitions

### Important Configuration

**API Proxy**: Development server proxies `/api` requests to `http://localhost:8080`

**Build Output**: Production builds are placed in `../backend/src/main/resources/static` for Spring Boot integration

**Authentication**: Uses mock authentication with role-based access:
- Roles: Operator, Dispatcher, Supervisor, Admin
- AuthContext manages authentication state

### Recent Refactoring Patterns

When modifying code, follow these established patterns:
1. Extract reusable components from large pages
2. Use custom hooks for complex state management (see `useSupervisorDashboard`)
3. Leverage the generic `DataTable` component for tables
4. Keep components focused and single-purpose
5. Use TypeScript strictly with proper type definitions


🎯 Feature: Smart Load Match Notification & Broker Contact Flow

Goal:
Simulate a real-time load matching experience with a responsive, modern UI that mimics “calling a broker” — increasing user immersion and confidence.

✅ User Flow (Mock Implementation)
1.	User Inputs Search Parameters
•	Origin, Destination, Equipment, Min Rate, Date
•	Clicks “Search Loads”
2.	System Simulates Real-time Matching
•	Show a 10-second animated loader (with dynamic messages like “Searching DAT…”, “Checking TruckStop…”, “Filtering Smart Matches…”)
•	After 10 seconds, trigger:
•	In-app notification (toast or bell icon)
•	Audio cue (optional)
•	Modal opens automatically with matching load(s)
3.	Load Found Modal UI
•	Display:
•	Load details (origin → destination, equipment, rate, weight, broker info)
•	“📞 Call Broker” (primary action)
•	“✉️ Email Broker” (secondary)
•	Option to “Reject Load” or “Save for Later”
4.	Broker Call Mode UI
•	When user clicks “Call Broker”:
•	Open a Call Interface modal with:
•	Large phone icon pulsing
•	Broker name, phone, company
•	Timer (e.g., “Calling… 00:04”)
•	Notes input: “Jot down broker notes here…”
•	“📌 Save Call Notes” and “📤 Mark as Contacted”
5.	Post-Call State
•	Modal closes with confirmation toast: “Call saved under this load.”
•	Option to create an automatic follow-up task or reminder.

⸻

🔧 Component Ideas for Junie Prompt
// ✨ Custom Hook to simulate search loading
useEffect(() => {
if (searchStarted) {
const timer = setTimeout(() => {
setShowNotification(true);
setShowLoadModal(true); // Trigger modal popup
}, 10000);
return () => clearTimeout(timer);
}
}, [searchStarted]);

// 🔔 Notification
<Toast message="Smart Match found! Load available from Chicago to NY!" />

// 📦 Modal: Load Details
<Modal title="Load Match Found">
<LoadCard {...mockLoad} />
<Button icon="📞" onClick={handleCall}>Call Broker</Button>
<Button icon="✉️" variant="secondary" onClick={handleEmail}>Email Broker</Button>
</Modal>

// ☎️ Broker Call UI
<Modal title="Calling Broker...">
  <div className="calling-interface">
    <PhoneIconPulse />
    <p>ABC Logistics - John Smith</p>
    <p>📱 +1 (555) 123-4567</p>
    <Timer />
    <textarea placeholder="Write call notes..." />
    <div className="action-buttons">
      <Button>Save Call Notes</Button>
      <Button variant="ghost">Mark as Contacted</Button>
    </div>
  </div>
</Modal>

🧠 UX Tips
•	Make the “Call Broker” experience feel as close to a real phone app as possible.
•	Use animations and pulsing UI to simulate action.
•	Persist the call notes under the Load details (maybe under a new tab: Activity or Comms).
•	Use sound or vibration feedback (subtly) if going mobile-first later.

⸻

🧰 Assets Needed
•	📞 SVG Phone Animation (pulsing ring)
•	Broker avatar placeholder
•	Optional background audio or ring sound