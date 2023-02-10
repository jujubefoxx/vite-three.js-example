<template>
  <div class="container" ref="container"></div>
</template>

<script>
export default {
  name: "coffeeBabe"
}
</script>
<script setup>
import {onMounted, ref} from "vue"
import * as THREE from 'three';
import commonListener from "@/utils/common.js"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
// 导入模型的材质文件
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';


const container = ref(null);
let camera, scene, renderer, controls;

function init() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 100, 0);
  // antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  // .outputEncoding : number
  // 定义渲染器的输出编码。默认为THREE.LinearEncoding
  renderer.outputEncoding = THREE.sRGBEncoding;
  const environment = new RoomEnvironment();
  // 生成一个亮度环境，传入renderer 并赋值给了pmremGenerator
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbbbbb);
  scene.environment = pmremGenerator.fromScene(environment).texture;
  environment.dispose();
  // 通用监听器
  commonListener(camera, renderer)
  // 生成网格
  const grid = new THREE.GridHelper(500, 10, 0xffffff, 0xffffff);
  grid.material.opacity = 0.5;
  grid.material.depthWrite = false;
  grid.material.transparent = true;
  scene.add(grid);
}

init();

function creatLoader() {
  // 导入ktx2格式的loader
  const ktx2Loader = new KTX2Loader().setTranscoderPath('../src/utils/basis/').detectSupport(renderer);

  // 导入GLTF格式的loader
  const loader = new GLTFLoader().setPath('../src/assets/files/');
  //设置KTX2Loader解码器
  loader.setKTX2Loader(ktx2Loader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  // 导入
  loader.load('coffeemat.glb', function (gltf) {

    gltf.scene.position.y = 8;

    scene.add(gltf.scene);

    animate();

  }, undefined, function (e) {

    console.error(e);

  });
}

creatLoader();
const clock = new THREE.Clock();

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  render();
}


function render() {
  renderer.render(scene, camera);
}

// 挂载完成生成画面
onMounted(() => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 400;
  controls.maxDistance = 1000;
  controls.target.set(10, 90, -16);
  // 是否禁止右键拖拽
  controls.enablePan = false;
  // 开启阻尼
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);
  animate();
})
</script>

<style scoped>

</style>