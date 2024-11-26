import { useState } from "react";
import ThreeScene from './components/ThreeScene.jsx';
import Timeline from "./components/timeline.jsx";
import InfoCard from "./components/InfoCard.jsx";
import EarthFocus from './components/earthFocus.jsx';
import timelineData from './data/timelineData.json';
import './styles/App.css';

const App = () => {
    const [selectedYear, setSelectedYear] = useState(1968);
    const [hoveredYear, setHoveredYear] = useState(null);
    const [viewMode, setViewMode] = useState("country"); // Manage viewMode in App

    return (
        <div className="app-container">
            {/* Timeline Section */}
            <div className="timeline-container">
                {/* View Mode Selector is now part of Timeline */}
                <div className="view-mode-selector">
                    <label htmlFor="viewMode">View Mode:</label>
                    <select
                        id="viewMode"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                    >
                        <option value="country">By Country</option>
                        <option value="discovery">By Type of Discovery</option>
                    </select>
                </div>
                <Timeline
                    onYearChange={setSelectedYear}
                    onYearHover={setHoveredYear}
                    viewMode={viewMode} // Pass viewMode to Timeline
                />
            </div>

            {/* 3D Scene Section */}
            <div className="three-container">
                <ThreeScene
                    year={selectedYear}
                />
            </div>

            {/* Info Card Section */}
            <div className="info-card-container">
                <InfoCard
                    year={hoveredYear || selectedYear}
                    data={timelineData}
                    viewMode={viewMode} // Pass viewMode to InfoCard
                />
            </div>

            {/* Planet Focus Section */}
            <EarthFocus
                year={selectedYear}
            />
        </div>
    );
};

export default App;
