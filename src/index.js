/* global THREE */
import './styles/app.scss';
import hexGeometry from './utils/geometry/hex';

var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();
createCameraControls();

function init () {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.set(0, 1.5, 6);

  scene = new THREE.Scene();
  material = new THREE.MeshNormalMaterial();

  const radius = 0.5;
  const thickness = 0.1;
  const a = radius / 2 * Math.sqrt(3);

  geometry = hexGeometry(radius, thickness);
  geometry.rotateX(Math.PI / 2);

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  for (let angle = Math.PI / 6; angle < 2 * Math.PI; angle += Math.PI / 3) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(2 * a * Math.cos(angle), 0.05, 2 * a * Math.sin(angle));
    scene.add(mesh);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function animate () {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.02;

  renderer.render(scene, camera);
}

function createCameraControls () {
  const container = document.createElement('div');
  container.style.backgroundColor = 'white';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';

  ['x', 'y', 'z'].forEach(prop => {
    const slider = document.createElement('input');
    slider.style.width = '300px';
    slider.type = 'range';
    slider.max = '10';
    slider.min = '-10';
    slider.step = '0.1';
    slider.value = prop === 'z' ? 1 : 0;
    slider.addEventListener('input', e => {
      console.log(prop, e.target.value);
      camera.position[prop] = parseFloat(e.target.value);
    });
    container.appendChild(slider);
  });

  document.body.appendChild(container);
}
