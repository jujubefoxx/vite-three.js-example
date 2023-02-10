<template>
  <div class="container" ref="container"></div>
</template>

<script>
export default {
  name: "ufo"
}
</script>
<script setup>
import {createApp, onMounted, ref} from "vue"
import * as THREE from 'three';
import commonListener from "@/utils/common.js"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const container = ref(null);
let camera, scene, renderer, controls;
/*具体步骤：
1.初始化场景，相机，渲染器
2.导入模型，添加灯光
3.添加轨道控制器
*/

// 1.初始化场景，相机，渲染器
function init() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0,300,400);
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xf0f0f0);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 通用监听器
  commonListener(camera, renderer)
}

init();
function createUFO(){
  const loader = new GLTFLoader();

  loader.load( '/src/assets/files/ufo.gltf', function ( gltf ) {

    scene.add( gltf.scene );
    console.log( gltf.scene)

  }, undefined, function ( error ) {

    console.error( error );

  } );

  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 1000, 100 );
  // spotLight.map = new THREE.TextureLoader().load( url );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  // spotLight.shadow.camera.near = 500;
  // spotLight.shadow.camera.far = 4000;
  // spotLight.shadow.camera.fov = 30;

  scene.add( spotLight );
}
createUFO();
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  render();

}
function render() {
  renderer.render(scene, camera);
}

// 挂载完成生成画面
onMounted(() => {
  controls = new OrbitControls(camera, renderer.domElement);
  // 开启阻尼
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);
  animate();
})
</script>
<style lang="scss" scoped>
.container{
  width:100vw;
  height: 100vh;
  background: #f0f0f0;
}
</style>