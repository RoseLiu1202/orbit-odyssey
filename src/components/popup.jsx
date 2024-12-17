import "../styles/Popup.css"; // Import styles for the popup

const Popup = ({ onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                {/* Close Button */}
                <span className="close-btn" onClick={onClose}>
          &times;
        </span>

                {/* Header */}
                <h2>
                    Welcome to <span className="highlight">Orbit Odyssey</span>
                </h2>

                {/* Intro Paragraph */}
                <p className="intro-text">
                    Explore humanity's journey through space over the past 55 years since the first Moon landing!
                </p>

                {/* Main Content */}
                <div className="content-section">
                    <p>
                        Humans have always looked to the skies with curiosity, from ancient civilizations like the Mayans to modern visionaries like Copernicus.
                        Space exploration became a reality in the mid-20th century, highlighted by the 1969 Moon landing.
                    </p>
                    <p>
                        While groundbreaking missions like Mars rovers, the ISS, and the James Webb Telescope continue today, they often lack the tangible excitement of earlier milestones.
                    </p>
                    <p>
                        This interactive 3D visualization aims to highlights all major space missions and achievements since 1969 and to show the global effort to explore beyond Earth.                    </p>
                </div>

                {/* How to Use Section */}
                <div className="how-to-use">
                    <h3>How to Use:</h3>
                    <ul>
                        <li>
                            🔍 <b>Navigate:</b> Rotate and zoom through the solar system using your mouse.
                        </li>
                        <li>
                            📅 <b>Timeline:</b> Click on milestones to uncover notable missions and planetary discoveries.
                        </li>
                        <li>
                            🌌 <b>Explore:</b> Switch between country view and discovery mode to learn more.
                        </li>
                    </ul>
                </div>

                {/* Call to Action */}
                <p className="cta">
                    <em>Ready to begin? Dive in and explore the cosmos!</em>
                </p>
            </div>
        </div>
    );
};

export default Popup;
