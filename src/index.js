/* global STLLoader, THREE */
import './styles/app.scss';
import config from './utils/config';
// import drawGridByRadius from './utils/grid/draw-grid-by-radius';
import Grid from './utils/grid/grid.class';
// import drawGridFromJSON from './utils/grid/draw-grid-from-json';
import gridData from './data/grids/grid-default.json';
import parseGridJSONData from './utils/grid/parse-grid-json-data';
import creatureData from './data/creatures/charmander.json';

var camera, scene, renderer;

const cameraStartPosition = [0, 4, 6];

init();
createCameraControls();

function init () {
  const renderWidth = window.innerWidth;
  const renderHeight = window.innerHeight;

  camera = new THREE.PerspectiveCamera(70, renderWidth / renderHeight, 0.01, 10);
  camera.position.set(...cameraStartPosition);
  camera.rotation.x = -Math.PI / 4;

  scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // drawGridByRadius(5, scene, geometry, materialOptions, 0xffffff, 0xff0000);
  parseGridJSONData(gridData);
  // drawGridFromJSON(gridData, scene, materialOptions);

  const grid = new Grid();
  grid.fromJSONData(gridData);
  grid.draw(scene);

  // const path = grid.findPath({ q: 5, r: -1 }, { q: 4, r: 1 });
  // path && path.forEach(cell => {
  //   grid.highlightCell(cell.q, cell.r);
  // });

  const loader = new STLLoader();
  loader.load(creatureData.modelFile, function (geometry) {
    geometry.scale(1 / creatureData.scaleFactor, 1 / creatureData.scaleFactor, 1 / creatureData.scaleFactor);
    geometry.rotateX(creatureData.defaultRotation.x);
    geometry.rotateY(creatureData.defaultRotation.y);
    geometry.rotateZ(creatureData.defaultRotation.z);

    const materialOptions = Object.assign({
      color: parseInt(creatureData.defaultColor)
    }, config.cellMaterialOptions);

    const material = new THREE.MeshPhongMaterial(materialOptions);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, config.hexLineThickness * 2, 0);

    scene.add(mesh);
  });

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
      // highlighted.material.emissive.setHex(0);
      // highlighted = null;
    }

    if (intersects && intersects.length && intersects[0].object !== highlighted) {
      // intersects[0].object.material.emissive.setHex(config.highlightEmissiveColor);
      // highlighted = intersects[0].object;
      // console.log(intersects[0].object._q, intersects[0].object._r);
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
