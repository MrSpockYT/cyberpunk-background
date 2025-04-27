// Elite Cyberpunk Engine v1
const canvas = document.getElementById('bg');

// Three.js setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

// Load Sky Texture
const loader = new THREE.TextureLoader();
loader.load('textures/sky-texture.png', function(texture) {
  scene.background = texture;
});

// Create Buildings
const buildings = [];
const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x222244, wireframe: true });

function generateBuildings() {
  for (let i = 0; i < 50; i++) {
    const width = Math.random() * 0.5 + 0.2;
    const height = Math.random() * 3 + 1;
    const depth = Math.random() * 0.5 + 0.2;
    const geometry = new THREE.BoxGeometry(width, height, depth);

    const building = new THREE.Mesh(geometry, buildingMaterial);
    building.position.x = (Math.random() - 0.5) * 20;
    building.position.y = (Math.random() - 0.5) * 2;
    building.position.z = (Math.random() - 0.5) * 10;
    scene.add(building);
    buildings.push(building);
  }
}

generateBuildings();

// Particle System using PixiJS
const app = new PIXI.Application({
  view: canvas,
  resizeTo: window,
  transparent: true,
  autoDensity: true,
});

const particlesContainer = new PIXI.ParticleContainer(500, {
  scale: true,
  position: true,
  alpha: true
});
app.stage.addChild(particlesContainer);

const particles = [];
for (let i = 0; i < 300; i++) {
  const gfx = new PIXI.Graphics();
  gfx.beginFill(0xffffff, 0.8);
  gfx.drawCircle(0, 0, Math.random() * 2 + 1);
  gfx.endFill();

  const texture = app.renderer.generateTexture(gfx);
  const particle = new PIXI.Sprite(texture);
  particle.x = Math.random() * window.innerWidth;
  particle.y = Math.random() * window.innerHeight;
  particle.speedY = Math.random() * 0.5 + 0.5;
  particlesContainer.addChild(particle);
  particles.push(particle);
}

// Animate
function animateParticles(delta) {
  for (let p of particles) {
    p.y += p.speedY * delta;
    if (p.y > window.innerHeight) {
      p.y = 0;
      p.x = Math.random() * window.innerWidth;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  buildings.forEach(building => {
    building.rotation.y += 0.0005;
  });
  animateParticles(1);
  renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

