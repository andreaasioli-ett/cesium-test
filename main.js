import { Viewer } from 'cesium';
import './style.css'
import CesiumViewer from './viewer.js'



const viewer = new CesiumViewer();
viewer.toggle3DModel();



document.getElementById('btn-must').addEventListener('click', () => {
  viewer.colorMust();
  console.log('must');
});

document.getElementById('btn-las').addEventListener('click', () => {
  viewer.togglePointCloud();
});

