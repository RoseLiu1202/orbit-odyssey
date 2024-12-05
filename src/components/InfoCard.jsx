import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import timelineData from "./../data/timelineData.json";
import "../styles/InfoCard.css";

const countryFlags = {
    USA: "🇺🇸",
    USSR: "☭",
    Europe: "🇪🇺",
    UK: "🇬🇧",
    Canada: "🇨🇦",
    Japan: "🇯🇵",
    China: "🇨🇳",
    India: "🇮🇳",
    Italy: "🇮🇹",
    Russia: "🇷🇺",
    Poland: "🇵🇱",
    France: "🇫🇷",
};

const discoveryTypeLabels = {
    TechAdvance: "🛸 Technological Achievement",
    HumanInSpace: "👨‍🚀 Human Spaceflight",
    Contact: "🌍 Planetary Exploration",
};

const InfoCard = ({ year, viewMode, selectedCountries, selectedDiscoveries }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allEvents, setAllEvents] = useState([]);
    const yearData = timelineData.find((entry) => entry.year === year);

    const getCountryDisplay = (country) => {
        const mainCountry = country.split("(")[0].trim();
        const flag = countryFlags[mainCountry] || "";
        return `${flag} ${country}`;
    };

    const getFormattedType = (type) => discoveryTypeLabels[type] || type;

    useEffect(() => {
        if (yearData) {
            const events = [];
            yearData.discoveries.forEach((discovery) => {
                Object.keys(discovery).forEach((key) => {
                    if (["TechAdvance", "HumanInSpace", "Contact"].some(type => key.startsWith(type))) {
                        events.push({
                            missionName: discovery.missionName,
                            country: discovery.country,
                            type: key.replace(/\d+$/, ''),
                            text: discovery[key]
                        });
                    }
                });
            });
            setAllEvents(events);
        }
    }, [yearData]);

    const handleProgressClick = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newIndex = Math.min(
            Math.floor(percentage * allEvents.length),
            allEvents.length - 1
        );
        setCurrentIndex(newIndex);
    };

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(allEvents.length - 1, prev + 1));
    };

    if (!yearData || allEvents.length === 0) {
        return <div className="info-card-container">No data available for this year</div>;
    }

    const currentEvent = allEvents[currentIndex];
    const progressPercentage = ((currentIndex + 1) / allEvents.length) * 100;

    return (
        <div className="info-card-container">
            {/* Top Content Section */}
            <div className="top-content">
                <div className="year-display">{yearData.year}</div>
                <div className="mission-info">
                    <div className="mission-name">Mission: {currentEvent.missionName}</div>
                    {viewMode === "country" && (
                        <div
                            className="country-flag"
                            dangerouslySetInnerHTML={{
                                __html: getCountryDisplay(currentEvent.country),
                            }}
                        />
                    )}
                    {viewMode === "discovery" && (
                        <div className="discovery-type">
                            {getFormattedType(currentEvent.type)}
                        </div>
                    )}
                </div>
            </div>

            {/* Highlight Content Section */}
            <div className="content-wrapper">
                <div className="highlight-content">
                    <div className="highlight-text">{currentEvent.text}</div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="progress-section">
                {/* Navigation Controls */}
                <div className="navigation-controls">
                    <button
                        onClick={handlePrevious}
                        className="nav-button"
                        disabled={currentIndex === 0}
                    >
                        ◄
                    </button>

                    <div className="progress-bar-container" onClick={handleProgressClick}>
                        <div
                            className="progress-bar-fill"
                            style={{
                                transform: `translateX(${progressPercentage - 100}%)`
                            }}
                        />
                    </div>

                    <button
                        onClick={handleNext}
                        className="nav-button"
                        disabled={currentIndex === allEvents.length - 1}
                    >
                        ►
                    </button>
                </div>

                {/* Progress Counter */}
                <div className="progress-counter">
                    {currentIndex + 1}/{allEvents.length}
                </div>
            </div>
        </div>
    );
};

InfoCard.propTypes = {
    year: PropTypes.number,
    viewMode: PropTypes.oneOf(["country", "discovery"]).isRequired,
    selectedCountries: PropTypes.arrayOf(PropTypes.string),
    selectedDiscoveries: PropTypes.arrayOf(PropTypes.string)
};

export default InfoCard;