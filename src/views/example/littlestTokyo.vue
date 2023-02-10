<template>
  <div class="container" ref="container"></div>
</template>

<script>
export default {
  name: "LittlestTokyo"
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
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {func} from "three/nodes";

const container = ref(null);
let camera, scene, renderer, controls;

function init() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(5, 2, 8);
  // antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // .outputEncoding : number
  // 定义渲染器的输出编码。默认为THREE.LinearEncoding
  renderer.outputEncoding = THREE.sRGBEncoding;

  // 生成一个亮度环境，传入renderer 并赋值给了pmremGenerator
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3dd);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // 通用监听器
  commonListener(camera, renderer)
}

init();
let mixer;

function creatLoader() {
  // 导入DRACO格式的loader
  const dracoLoader = new DRACOLoader();
  // 设置loader路径解压压缩模型
  dracoLoader.setDecoderPath('../src/utils/draco/gltf/');
  // 导入GLTF格式的loader
  const loader = new GLTFLoader();
  //设置DRACOloader解码器
  loader.setDRACOLoader(dracoLoader);
  // 导入
  loader.load('../src/assets/files/LittlestTokyo.glb', function (gltf) {

    const model = gltf.scene;
    model.position.set(1, 1, 0);
    model.scale.set(0.01, 0.01, 0.01);
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
    animate();

  }, undefined, function (e) {

    console.error(e);

  });
}

creatLoader();
const clock = new THREE.Clock();

function animate() {
  controls.update();
  // 获得前后两次执行该方法的时间间隔
  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }
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
  controls.target.set(0, 0.5, 0);
  // 是否禁止右键拖拽
  controls.enablePan = false;
  // 开启阻尼
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);
  animate();
})
</script>
<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: #f0f0f0;
}
</style>