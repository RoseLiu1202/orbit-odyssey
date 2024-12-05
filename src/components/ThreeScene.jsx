import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PropTypes from 'prop-types';

const ThreeScene = ({ year, containerRef}) => {
    const canvasRef = useRef(null);
    const planetsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!container) {
            console.error('Container reference is not available');
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.bottom = '0';
        canvas.style.right = '0';
        canvas.style.margin = 'auto';
        canvas.style.display = 'block';

        const controls = new OrbitControls(camera, renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Texture Loader
        const textureLoader = new THREE.TextureLoader();

        // Planets Data
        const planetsData = [
            { name: 'Sun', size: 3, distance: 0, texture: '/static/solar/sun.jpg', speed: 0 },
            { name: 'Mercury', size: 0.5, distance: 5, texture: '/static/solar/mercury.jpg', speed: 0.001 },
            { name: 'Venus', size: 0.8, distance: 7, texture: '/static/solar/venus.jpg', speed: 0.0007 },
            { name: 'Earth', size: 1, distance: 10, texture: '/static/earth/day.jpg', speed: 0.0005 },
            { name: 'Mars', size: 0.7, distance: 12, texture: '/static/solar/mars.jpg', speed: 0.0004 },
            { name: 'Jupiter', size: 2, distance: 16, texture: '/static/solar/jupiter.jpg', speed: 0.0002 },
            { name: 'Saturn', size: 1.8, distance: 20, texture: '/static/solar/saturn.jpg', speed: 0.00015 },
            { name: 'Uranus', size: 1.4, distance: 24, texture: '/static/solar/uranus.jpg', speed: 0.0001 },
            { name: 'Neptune', size: 1.3, distance: 28, texture: '/static/solar/neptune.jpg', speed: 0.00008 },
        ];

        // Create Planets, Orbits, and Labels
        planetsRef.current = planetsData.map(({ name, size, distance, texture, speed }) => {
            // Orbit
            const orbitGeometry = new THREE.RingGeometry(distance - 0.05, distance + 0.05, 128);
            const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2; // Make the orbit horizontal
            scene.add(orbit);

            // Planet
            const geometry = new THREE.SphereGeometry(size, 64, 64);
            const material = new THREE.MeshStandardMaterial({
                map: textureLoader.load(texture),
                transparent: true, // Allow opacity changes
                opacity: 1, // Start fully visible
            });
            const planet = new THREE.Mesh(geometry, material);

            // Label (Text under the planet)
            const labelCanvas = document.createElement('canvas');
            const labelContext = labelCanvas.getContext('2d');
            labelCanvas.width = 256;
            labelCanvas.height = 64;
            labelContext.font = '30px Arial';
            labelContext.fillStyle = 'white';
            labelContext.textAlign = 'center';
            labelContext.fillText(name, 128, 32);

            const labelTexture = new THREE.CanvasTexture(labelCanvas);
            const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
            const label = new THREE.Sprite(labelMaterial);
            label.scale.set(2, 0.5, 1); // Adjust label size
            label.position.set(0, -size - 2, 0); // Place label below the planet

            // Group: Combine Planet and Label
            const group = new THREE.Group();
            group.add(planet);
            group.add(label);

            // Initial position of the group (orbit radius)
            group.position.set(distance, 0, 0);
            scene.add(group);

            return { group, planet, label, distance, speed, angle: Math.random() * Math.PI * 2, name };
        });

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            planetsRef.current.forEach(({ group, distance, speed, angle }, index) => {
                // Update angle for orbiting
                const newAngle = planetsRef.current[index].angle + speed;
                planetsRef.current[index].angle = newAngle;

                // Calculate new position based on orbit
                const x = distance * Math.cos(newAngle);
                const z = distance * Math.sin(newAngle);

                group.position.set(x, 0, z); // Move group (planet + label) along orbit

                // Self-rotation of the planet
                group.children[0].rotation.y += 0.001; // Slower self-rotation

                // Keep the label facing the camera
                group.children[1].rotation.copy(camera.rotation);
            });

            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Camera Position
        camera.position.set(0, 20, 50);

        // Handle Resize
        const handleResize = () => {
            if (container) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            planetsRef.current.forEach(({ planet, label }) => {
                if (planet.material.map) planet.material.map.dispose();
                if (planet.material) planet.material.dispose();
                planet.geometry.dispose();
                if (label.material.map) label.material.map.dispose();
                label.material.dispose();
            });

            renderer.dispose();
        };

    }, []);

    useEffect(() => {
        // Highlight Planets by Year
        const highlightPlanets = (year) => {
            const yearsMapping = [
                { range: [1968, 1969], visible: ['Earth'] },
                { range: [1970, 1970], visible: ['Earth', 'Venus'] },
                { range: [1971, 1972], visible: ['Earth', 'Venus', 'Mars'] },
                { range: [1973, 1977], visible: ['Earth', 'Venus', 'Mars', 'Jupiter', 'Mercury'] },
                { range: [1978, 1978], visible: ['Earth', 'Venus', 'Mars', 'Jupiter', 'Mercury', 'Sun'] },
                { range: [1979, 1985], visible: ['Earth', 'Venus', 'Mars', 'Jupiter', 'Mercury', 'Sun', 'Saturn'] },
                { range: [1986, 1988], visible: ['Earth', 'Venus', 'Mars', 'Jupiter', 'Mercury', 'Sun', 'Saturn', 'Uranus'] },
                { range: [1989, 2024], visible: ['Earth', 'Venus', 'Mars', 'Jupiter', 'Mercury', 'Sun', 'Saturn', 'Uranus', 'Neptune'] },
            ];

            const activePlanets = yearsMapping.find(({ range }) => year >= range[0] && year <= range[1])?.visible || [];

            planetsRef.current.forEach(({ planet, name }) => {
                if (planet?.material) {
                    planet.material.opacity = activePlanets.includes(name) ? 1 : 0.3;
                }
            });
        };

        highlightPlanets(year);
    }, [year]);

    return <canvas ref={canvasRef}></canvas>;
};

ThreeScene.propTypes = {
    year: PropTypes.number, // Year is a required number
    containerRef: PropTypes.object.isRequired, // Add containerRef as a required prop
};

export default ThreeScene;


