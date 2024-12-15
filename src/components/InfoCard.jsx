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
    console.log("Selected Year:", year);
    console.log("Year Data:", yearData);
    console.log("selected country:", selectedCountries);

    const getCountryDisplay = (country) => {
        const mainCountry = country;
        const flag = countryFlags[mainCountry] || "";
        return `${flag} ${country}`;
    };

    const getFormattedType = (type) => discoveryTypeLabels[type] || type;

    useEffect(() => {
        if (yearData) {
            const events = [];

            yearData.discoveries.forEach((discovery, index) => {
                try {
                    // Validate the discovery object
                    if (!discovery || !discovery.missionName) {
                        console.warn(`Invalid discovery at index ${index}:`, discovery);
                        throw new Error(`Invalid discovery data at index ${index}`);
                    }

                    // Extract main country name (before any parentheses)
                    const normalizedCountry = discovery.country?.split("(")[0]?.trim();
                    console.log("Normalized Country:", normalizedCountry);

                    if (viewMode === "country") {
                        // Handle selectedCountries properly
                        const normalizedSelectedCountry =
                            typeof selectedCountries === "string"
                                ? selectedCountries.split("(")[0].trim()
                                : Array.isArray(selectedCountries) && selectedCountries.length > 0
                                    ? selectedCountries[0].split("(")[0].trim()
                                    : "View All";

                        const isCountryMatch =
                            normalizedSelectedCountry === "View All" ||
                            normalizedCountry === normalizedSelectedCountry;

                        if (isCountryMatch) {
                            Object.keys(discovery).forEach((key) => {
                                events.push({
                                    missionName: discovery.missionName,
                                    country: normalizedCountry,
                                    type: key.replace(/\d+$/, ''),
                                    text: discovery[key]
                                });
                            });
                        }
                    } else if (viewMode === "discovery") {
                        const normalizedSelectedDiscoveries =
                            Array.isArray(selectedDiscoveries) && selectedDiscoveries.length > 0
                                ? selectedDiscoveries
                                : ["View All"];

                        Object.keys(discovery).forEach((key) => {
                            if (["TechAdvance", "HumanInSpace", "Contact"].some((type) => key.startsWith(type))) {
                                const eventType = key.replace(/\d+$/, '');

                                // Check if "View All" is selected or if the eventType matches
                                const isTypeMatch =
                                    normalizedSelectedDiscoveries.includes("View All") ||
                                    normalizedSelectedDiscoveries.includes(eventType);

                                if (isTypeMatch) {
                                    events.push({
                                        missionName: discovery.missionName,
                                        country: normalizedCountry,
                                        type: eventType,
                                        text: discovery[key]
                                    });
                                }
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error processing discovery at index ${index}:`, error.message);
                }
            });

            console.log("Filtered Events:", events);
            setAllEvents(events);
        }
    }, [yearData, viewMode, selectedCountries, selectedDiscoveries]);


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
                    <div className="mission-name">
                        Mission: {currentEvent?.missionName ? currentEvent.missionName : "Unknown Mission"}
                    </div>
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
    year: PropTypes.number.isRequired,
    viewMode: PropTypes.oneOf(["country", "discovery"]),
    selectedCountries: PropTypes.oneOfType([
        PropTypes.string, // for "view all"
        PropTypes.arrayOf(PropTypes.string), // for specific countries
    ]),
    selectedDiscoveries: PropTypes.oneOfType([
        PropTypes.string, // for "view all"
        PropTypes.arrayOf(PropTypes.string), // for specific discoveries
    ]),
};

InfoCard.defaultProps = {
    viewMode: "country", // Default to "country"
    selectedCountries: "View All",
    selectedDiscoveries: "View All",
};

export default InfoCard;