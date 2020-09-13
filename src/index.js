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

init();
createCameraControls();

function init () {
  const renderWidth = window.innerWidth;
  const renderHeight = window.innerHeight;

  const cameraPosition = [...config.cameraOptions.cameraStartPosition];
  camera = new THREE.PerspectiveCamera(
    config.cameraOptions.perspective.fov,
    renderWidth / renderHeight,
    config.cameraOptions.perspective.near,
    config.cameraOptions.perspective.far
  );
  camera.position.set(...cameraPosition);
  camera.rotation.x = config.cameraOptions.downwardAngle;
  // window.camera = camera;

  scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Enable layers
  Object.entries(config.objectLayers).forEach(([key, layer]) => {
    light.layers.enable(layer);
    camera.layers.enable(layer);
  });

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
    mesh.layers.set(config.objectLayers.creatures);
    mesh.position.set(0, config.hexLineThickness * 2, 0);

    scene.add(mesh);
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(renderWidth, renderHeight);
  document.body.appendChild(renderer.domElement);

  var raycasterGrid = new THREE.Raycaster();
  raycasterGrid.layers.enable(config.objectLayers.gridTiles);
  const mouse = {
    isDown: false,
    position: new THREE.Vector2(),
    positionAtClick: new THREE.Vector2()
  };
  const mapScrollState = {
    scrollX: 0,
    scrollY: 0
  };

  function onMouseDown (event) {
    mouse.isDown = true;
    mouse.positionAtClick.x = mouse.position.x;
    mouse.positionAtClick.y = mouse.position.y;
  }

  // Virtual plane
  const planeSize = config.hexRadiusOuter * 4 * grid.radius * config.groundPlaneSizeMultiplier;
  const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
  planeGeometry.rotateX(-Math.PI / 2);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.1,
    transparent: true
  });
  const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  groundPlane.layers.set(config.objectLayers.groundPlane);
  scene.add(groundPlane);

  const raycasterGround = new THREE.Raycaster();
  raycasterGround.layers.enable(config.objectLayers.groundPlane);
  const cameraWorldDirection = new THREE.Vector3();
  const cameraTmp = new THREE.Vector3();

  let lastCameraRotation = 0;
  function rotateCameraAroundCentralAxis (angle) {
    camera.getWorldDirection(cameraWorldDirection);
    raycasterGround.set(camera.position, cameraWorldDirection);
    const [intersection] = raycasterGround.intersectObject(groundPlane);
    if (intersection) {
      const { x, z } = intersection.point;

      cameraTmp.set(x, camera.position.y, z);
      const d = cameraTmp.distanceTo(camera.position);

      camera.rotateOnWorldAxis(camera.up, angle - lastCameraRotation);
      lastCameraRotation = angle;
      camera.position.set(
        x + d * Math.sin(angle),
        camera.position.y,
        z + d * Math.cos(-angle)
      );
    }
  }
  window.rotateCameraAroundCentralAxis = rotateCameraAroundCentralAxis;

  // UI Events
  function onMouseUp (event) {
    mouse.isDown = false;
  }

  let cameraAxisAngle = 0;
  function onMouseMove (event) {
    event.preventDefault();

    // Mouse coordinates for hex highlight
    mouse.position.x = (event.clientX / renderWidth) * 2 - 1;
    mouse.position.y = -(event.clientY / renderHeight) * 2 + 1;

    // Scroll map
    const margin = config.cameraOptions.mapScrollMargin;
    if (event.clientX <= margin) {
      mapScrollState.scrollX = -1;
    } else if (event.clientX >= renderWidth - margin) {
      mapScrollState.scrollX = 1;
    } else {
      mapScrollState.scrollX = 0;
    }
    if (event.clientY <= margin) {
      mapScrollState.scrollY = -1;
    } else if (event.clientY >= renderHeight - margin) {
      mapScrollState.scrollY = 1;
    } else {
      mapScrollState.scrollY = 0;
    }

    // Rotate camera
    if (mouse.isDown) {
      const dx = mouse.position.x - mouse.positionAtClick.x;
      cameraAxisAngle -= dx * config.cameraOptions.cameraRotationSpeed;
      mouse.positionAtClick.x = mouse.position.x;
      rotateCameraAroundCentralAxis(cameraAxisAngle);
    }
  }

  const highlighted = null;

  function render () {
    raycasterGrid.setFromCamera(mouse.position, camera);
    var intersects = raycasterGrid.intersectObjects(scene.children);

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

    if (mapScrollState.scrollX || mapScrollState.scrollY) {
      const cameraSpeed = config.cameraOptions.mapScrollSpeed;
      const ceilX = grid.radius * config.cameraOptions.mapScrollRadiusCoefficient;
      const ceilZ = grid.radius * config.cameraOptions.mapScrollRadiusCoefficient;
      const ceilXMin = config.cameraOptions.cameraStartPosition[0] - ceilX;
      const ceilXMax = config.cameraOptions.cameraStartPosition[0] + ceilX;
      const ceilZMin = config.cameraOptions.cameraStartPosition[2] - ceilZ;
      const ceilZMax = config.cameraOptions.cameraStartPosition[2] + ceilZ;
      cameraPosition[0] += mapScrollState.scrollX * cameraSpeed;
      cameraPosition[0] = Math.min(ceilXMax, Math.max(ceilXMin, cameraPosition[0]));
      cameraPosition[2] += mapScrollState.scrollY * cameraSpeed;
      cameraPosition[2] = Math.min(ceilZMax, Math.max(ceilZMin, cameraPosition[2]));
      // camera.position.set(...cameraPosition);
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);
  window.addEventListener('mouseup', onMouseUp, false);

  render();
}

function createCameraControls () {
  const container = document.createElement('div');
  container.style.backgroundColor = 'white';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';

  [
    ['x', config.cameraOptions.cameraStartPosition[0]],
    ['y', config.cameraOptions.cameraStartPosition[1]],
    ['z', config.cameraOptions.cameraStartPosition[2]]
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
