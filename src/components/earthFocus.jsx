import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PropTypes from 'prop-types';
import detailedPlanets from '../data/detailedPlanets.json'; // Import the JSON file

const EarthFocus = ({ year }) => {
    const canvasRef = useRef(null);
    const planetRef = useRef(null); // Reference to the current planet mesh
    const [planetDetails, setPlanetDetails] = useState(null); // State for current planet details

    const planetsData = [
        {name: 'Sun', size: 3, distance: 0, texture: '/static/solar/sun.jpg', speed: 0},
        {name: 'Mercury', size: 0.5, distance: 5, texture: '/static/solar/mercury.jpg', speed: 0.01},
        {name: 'Venus', size: 0.8, distance: 7, texture: '/static/solar/venus.jpg', speed: 0.007},
        {name: 'Earth', size: 1, distance: 10, texture: '/static/earth/day.jpg', speed: 0.005},
        {name: 'Mars', size: 0.7, distance: 12, texture: '/static/solar/mars.jpg', speed: 0.004},
        {name: 'Jupiter', size: 2, distance: 16, texture: '/static/solar/jupiter.jpg', speed: 0.0025},
        {name: 'Saturn', size: 1.8, distance: 20, texture: '/static/solar/saturn.jpg', speed: 0.002},
        {name: 'Uranus', size: 1.4, distance: 24, texture: '/static/solar/uranus.jpg', speed: 0.0015},
        {name: 'Neptune', size: 1.3, distance: 28, texture: '/static/solar/neptune.jpg', speed: 0.001},
    ];

    const yearToPlanet = [
        {range: [1968, 1969], planet: 'Earth'},
        {range: [1970, 1970], planet: 'Venus'},
        {range: [1971, 1972], planet: 'Mars'},
        {range: [1973, 1973], planet: 'Mercury'},
        {range: [1974, 1977], planet: 'Jupiter'},
        {range: [1978, 1978], planet: 'Sun'},
        {range: [1979, 1985], planet: 'Saturn'},
        {range: [1986, 1988], planet: 'Uranus'},
        {range: [1989, 1989], planet: 'Neptune'},
    ];

    // Function to determine planet based on year
    const getPlanetDataForYear = (year) => {
        const match = yearToPlanet.find(({range}) => year >= range[0] && year <= range[1]);
        const planetName = match ? match.planet : 'Earth'; // Fallback to 'Earth'
        return planetsData.find((planet) => planet.name === planetName);
    };

    // Function to fetch detailed planet information
    const fetchPlanetDetails = (planetName) => {
        return detailedPlanets.find((planet) => planet.name === planetName);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(0, 0, 2);

        const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
        renderer.setSize(300, 300);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;

        const textureLoader = new THREE.TextureLoader();

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Create initial planet
        const initialPlanetData = getPlanetDataForYear(year);
        const initialPlanet = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load(initialPlanetData.texture),
            })
        );

        scene.add(initialPlanet);
        planetRef.current = initialPlanet;

        // Set initial planet details
        setPlanetDetails(fetchPlanetDetails(initialPlanetData.name));

        const animate = () => {
            requestAnimationFrame(animate);
            if (planetRef.current) {
                planetRef.current.rotation.y += 0.002;
            }
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    // Update the planet when the year changes
    useEffect(() => {
        const scene = planetRef.current?.parent; // Get the scene
        if (!scene) return;

        // Remove the old planet
        if (planetRef.current) {
            scene.remove(planetRef.current);
            planetRef.current.geometry.dispose();
            planetRef.current.material.dispose();
        }

        // Add the new planet
        const textureLoader = new THREE.TextureLoader();
        const newPlanetData = getPlanetDataForYear(year);
        const newPlanet = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load(newPlanetData.texture),
            })
        );

        scene.add(newPlanet);
        planetRef.current = newPlanet;

        // Update planet details
        setPlanetDetails(fetchPlanetDetails(newPlanetData.name));
    }, [year]);

    return (
        <div className="earth-focus-wrapper">
            <div className="futuristic-frame">
                <canvas ref={canvasRef}/>
                {planetDetails && (
                    <div
                        className="planet-info"
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            marginTop: '20px',
                            fontFamily: "'Orbitron', sans-serif",
                        }}
                    >
                        <h1 style={{fontSize: '24px', margin: 0}}>{planetDetails.name}</h1>
                        <p style={{fontSize: '14px', margin: '10px 0'}}>
                            Size: {planetDetails.size}
                        </p>
                        <div style={{fontSize: '12px', lineHeight: '1.5'}}>
                            {Object.entries(planetDetails.key_properties).map(([key, value]) => (
                                <p key={key}>
                                    <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

EarthFocus.propTypes = {
    year: PropTypes.number, // Year is a required number
};

export default EarthFocus;


