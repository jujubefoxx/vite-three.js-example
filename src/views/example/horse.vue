<template>
  <div class="container"></div>
</template>

<script>
export default {
  name: "horse"
}
</script>
<script setup>
import {onMounted} from "vue"
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import commonListener from "@/utils/common.js"

let container, stats;
let camera, scene, renderer;
let mesh, mixer;

const radius = 600;
let theta = 0;
let prevTime = Date.now();


init();
animate();
// 通用监听器
commonListener(camera, renderer)

onMounted(() => {
  // 生成画面
  container = document.createElement('div');
  document.querySelector('.container').appendChild(container);
  container.appendChild(renderer.domElement);
  container.appendChild(stats.dom);
})

function init() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.y = 300;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

// 右侧直射光
  const light1 = new THREE.DirectionalLight(0xefefff, 1.5);
  light1.position.set(1, 1, 1).normalize();
  scene.add(light1);
// 左侧直射光
  const light2 = new THREE.DirectionalLight(0xffefef, 1.5);
  light2.position.set(-1, -1, -1).normalize();
  scene.add(light2);

  const loader = new GLTFLoader();
  loader.load('/src/assets/files/Horse.glb', function (gltf) {
    mesh = gltf.scene;
    mesh.scale.set(1.5, 1.5, 1.5);
    scene.add(mesh);
    // 动画混合器
    mixer = new THREE.AnimationMixer(mesh);
    // 返回所传入的剪辑参数的AnimationAction, 根对象参数可选，默认值为混合器的默认根对象。第一个参数可以是动画剪辑(AnimationClip)对象或者动画剪辑的名称。
    mixer.clipAction(gltf.animations[0]).setDuration(1).play();

  })

  renderer = new THREE.WebGLRenderer();
  //设置canvas的像素比为当前设备的屏幕像素比，避免高分屏下模糊
  renderer.setPixelRatio(window.devicePixelRatio);
  //设置渲染器大小,即canvas画布的大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.outputEncoding = THREE.sRGBEncoding;


  stats = new Stats();
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();

}

function render() {

  theta += 0.1;
  // degToRad 将角度从度数转换为弧度
  camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
  camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
  camera.lookAt(0, 150, 0);

  if (mixer) {

    const time = Date.now();
    mixer.update((time - prevTime) * 0.001);
    prevTime = time;

  }
  renderer.render(scene, camera);
}
</script>
<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: #f0f0f0;
}
</style>