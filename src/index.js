/* global THREE */
import './styles/app.scss';
import config from './utils/config';
import drawGridByRadius from './utils/grid/draw-grid-by-radius';
import hexGeometry from './utils/geometry/hex';

var camera, scene, renderer;
var geometry;

const cameraStartPosition = [0, 1.5, 6];

init();
createCameraControls();

function init () {
  const renderWidth = window.innerWidth;
  const renderHeight = window.innerHeight;

  camera = new THREE.PerspectiveCamera(70, renderWidth / renderHeight, 0.01, 10);
  camera.position.set(...cameraStartPosition);

  geometry = hexGeometry(config.hexRadiusOuter, config.hexLineThickness);
  geometry.rotateX(Math.PI / 2);

  scene = new THREE.Scene();
  const materialOptions = {
    color: 0xff0000,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1
  };

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  drawGridByRadius(5, scene, geometry, materialOptions, 0xffffff, 0xff0000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(renderWidth, renderHeight);
  document.body.appendChild(renderer.domElement);

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  function onMouseMove (event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderHeight) * 2 + 1;
  }

  let highlighted = null;

  function render () {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    if (highlighted && (
      !intersects || !intersects[0] || intersects[0].object !== highlighted
    )) {
      highlighted.material.color.set(0xff0000);
      highlighted = null;
    }

    if (intersects && intersects.length) {
      intersects[0].object.material.color.set(0xffffff);
      highlighted = intersects[0].object;
    }
    renderer.render(scene, camera);

    window.requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', onMouseMove, false);

  render();
}

function createCameraControls () {
  const container = document.createElement('div');
  container.style.backgroundColor = 'white';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';

  [
    ['x', cameraStartPosition[0]],
    ['y', cameraStartPosition[1]],
    ['z', cameraStartPosition[2]]
  ].forEach(([prop, value]) => {
    const slider = document.createElement('input');
    slider.style.width = '300px';
    slider.type = 'range';
    slider.max = '10';
    slider.min = '-10';
    slider.step = '0.1';
    slider.value = value;
    slider.addEventListener('input', e => {
      console.log(prop, e.target.value);
      camera.position[prop] = parseFloat(e.target.value);
    });
    container.appendChild(slider);
  });

  document.body.appendChild(container);
}
