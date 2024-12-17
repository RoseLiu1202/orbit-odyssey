import { useState, useRef } from "react";
import ThreeScene from './components/ThreeScene.jsx';
import Timeline from "./components/timeline.jsx";
import InfoCard from "./components/InfoCard.jsx";
import EarthFocus from './components/earthFocus.jsx';
import timelineData from './data/timelineData.json';
import Popup from "./components/popup.jsx";
import './styles/App.css';

const App = () => {
    const [showPopup, setShowPopup] = useState(true); // State to control popup visibility
    const graphicScenesRef = useRef(null);

    const [selectedYear, setSelectedYear] = useState(1968);
    const [hoveredYear, setHoveredYear] = useState(null);
    const [viewMode, setViewMode] = useState("country"); // Manage viewMode in App
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedDiscoveries, setSelectedDiscoveries] = useState(["View All"]); // Default to "View All"

    return (
        <div className="app-container">
            {/* Timeline Section */}
            <div className="timeline-container">
                {/* Title */}
                <div className="timeline-title">
                    <h1>Interactive Timeline of Global Space Exploration</h1>
                </div>

                {/* Dropdown Menus Container */}
                <div className="dropdown-container">
                    {/* View Mode Dropdown */}
                    <div className="dropdown-wrapper">
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

                    {/* Country Selector Dropdown */}
                    {viewMode === "country" && (
                        <div className="dropdown-wrapper">
                            <label htmlFor="country-dropdown">Select Countries:</label>
                            <select
                                id="country-dropdown"
                                multiple
                                value={selectedCountries}
                                onChange={(e) => {
                                    const selected = Array.from(
                                        e.target.selectedOptions,
                                        (option) => option.value
                                    );
                                    setSelectedCountries(
                                        selected.includes("View All") ? ["View All"] : selected
                                    );
                                }}
                            >
                                <option value="View All">View All</option>
                                <option value="USA">USA</option>
                                <option value="Europe">Europe</option>
                                <option value="USSR">USSR</option>
                                <option value="UK">UK</option>
                                <option value="France">France</option>
                                <option value="China">China</option>
                                <option value="India">India</option>
                                <option value="Japan">Japan</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Italy">Italy</option>
                                <option value="Russia">Russia</option>
                                <option value="Poland">Poland</option>
                            </select>
                        </div>
                    )}

                    {/* Discovery Selector Dropdown */}
                    {viewMode === "discovery" && (
                        <div className="dropdown-wrapper">
                            <label htmlFor="discovery-dropdown">Select Discoveries:</label>
                            <select
                                id="discovery-dropdown"
                                multiple
                                value={selectedDiscoveries}
                                onChange={(e) => {
                                    const selected = Array.from(
                                        e.target.selectedOptions,
                                        (option) => option.value
                                    );
                                    setSelectedDiscoveries(
                                        selected.includes("View All") ? ["View All"] : selected
                                    );
                                }}
                            >
                                <option value="View All">View All</option>
                                <option value="TechAdvance">Technological Advancement</option>
                                <option value="Contact">Contact with Planets</option>
                                <option value="HumanInSpace">Human in Space</option>
                            </select>
                        </div>
                    )}
                </div>

                <Timeline
                    onYearChange={setSelectedYear}
                    onYearHover={setHoveredYear}
                    viewMode={viewMode} // Pass viewMode to Timeline
                    selectedCountries={selectedCountries} // Pass selectedCountries to Timeline
                    selectedDiscoveries={selectedDiscoveries} // Pass selectedDiscoveries to Timeline
                />
            </div>

            <div className="graphicScenes" ref={graphicScenesRef}>
                {/* 3D Scene Section */}
                <div className="three-container">
                    <ThreeScene
                        year={selectedYear}
                        containerRef={graphicScenesRef}
                    />
                </div>

                {/* Info Card Section */}
                <div className="info-card-container">
                    <InfoCard
                        year={hoveredYear || selectedYear}
                        data={timelineData}
                        viewMode={viewMode} // Pass viewMode to InfoCard
                        selectedCountries={selectedCountries}
                        selectedDiscoveries={selectedDiscoveries}
                    />
                </div>

                {/* Planet Focus Section */}
                {/*<EarthFocus*/}
                {/*    year={selectedYear}*/}
                {/*/>*/}
            </div>
            <div className="bottom-links">
                {/* Project Video Button */}
                <div className="project-video-link">
                    <a href="https://youtu.be/_J6Po-FmBV4" target="_blank" rel="noopener noreferrer">
                        Project Video
                    </a>
                </div>

                {/* Process Book Button */}
                <div className="process-book-link">
                    <a href="/processbook.html" target="_blank" rel="noopener noreferrer">
                        Process Book
                    </a>
                </div>

                {/* GitHub Button */}
                <div className="github-link">
                    <a href="https://github.com/RoseLiu1202/orbit-odyssey.git" target="_blank"
                       rel="noopener noreferrer">
                        GitHub Repo
                    </a>
                </div>
            </div>

            {showPopup && <Popup onClose={() => setShowPopup(false)} />}

        </div>
    );
};

export default App;
