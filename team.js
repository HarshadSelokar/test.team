// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Shooting star configuration
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const starPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 1000; // Spread stars randomly in the scene
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true,
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Create shooting stars
const shootingStars = [];
function createShootingStar() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(6);
    vertices[0] = Math.random() * 20 - 10; // Start X
    vertices[1] = Math.random() * 20 - 10; // Start Y
    vertices[2] = -20; // Start Z
    vertices[3] = vertices[0] - Math.random() * 2; // End X
    vertices[4] = vertices[1] - Math.random() * 2; // End Y
    vertices[5] = -30; // End Z

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({ color: 0xffffaa });
    const shootingStar = new THREE.Line(geometry, material);

    shootingStar.speed = Math.random() * 0.5 + 0.1;
    shootingStars.push(shootingStar);
    scene.add(shootingStar);

    setTimeout(() => {
        scene.remove(shootingStar);
        shootingStars.splice(shootingStars.indexOf(shootingStar), 1);
    }, 2000);
}

// Set interval for shooting stars
setInterval(createShootingStar, 500);

// Camera position
camera.position.z = 50;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate stars for dynamic effect
    stars.rotation.x += 0.0005;
    stars.rotation.y += 0.0005;

    // Update shooting stars
    shootingStars.forEach(star => {
        const positions = star.geometry.attributes.position.array;
        positions[2] += star.speed; // Move start point
        positions[5] += star.speed; // Move end point
        star.geometry.attributes.position.needsUpdate = true;

        // Remove star if it goes out of view
        if (positions[2] > 20) {
            scene.remove(star);
            shootingStars.splice(shootingStars.indexOf(star), 1);
        }
    });

    renderer.render(scene, camera);
}

animate();

// Responsive canvas
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});