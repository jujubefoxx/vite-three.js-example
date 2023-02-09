<template>
  <div class="container" ref="container"></div>
</template>

<script>
export default {
  name: "vr-house"
}
</script>
<script setup>
import {onMounted, ref} from "vue"
import * as THREE from 'three';
import commonListener from "@/utils/common.js"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const container = ref(null);
let camera, scene, renderer, controls;
/*具体步骤：
1.初始化场景，相机，渲染器
2.创建一个几何体
3.添加轨道控制器
4.加载图片，作为材质添加到立方体上(全景图使用球体，多图使用立方体）
5.将镜头置于几何体内部，使用scale
*/

// 1.初始化场景，相机，渲染器
function init() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 0.1;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 通用监听器
  commonListener(camera, renderer)
}

init();
// 房间的数据
const homeObj = {
  home1: {
    materials: ['r', 'l', 'u', 'd', 'f', 'b'],
    btnPosition: [-0.3,-4,4.85]
  },
  home2: {
    materials: 'vr1',
    btnPosition: [0.2,-2,-4]
  },
}
let activeHome=''
// 房间1
function createHome1() {
  const materialList = [];
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  // 加载图片
  homeObj.home1.materials.forEach((item) => {
    const texture = new THREE.TextureLoader().load(`/src/assets/images/vr-house/${item}.jpg`);
    const material = new THREE.MeshBasicMaterial({map: texture});
    materialList.push(material)
  })

// 立即使用纹理进行材质创建
  const cube = new THREE.Mesh(geometry, materialList);
  // 修改透视关系
  cube.geometry.scale(1, 1, -1)
  cube.name='homeMesh'
  scene.add(cube);
  createBtn('home1')
}
createHome1()

// 房间2
function createHome2() {
  const materialList = [];
  const geometry = new THREE.SphereGeometry( 5, 32, 16 );
  // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  // 加载图片
  const texture = new THREE.TextureLoader().load(`/src/assets/images/vr-house/${homeObj.home2.materials}.jpg`);
  const material = new THREE.MeshBasicMaterial({map: texture});
  const sphere = new THREE.Mesh( geometry, material );
  sphere.geometry.scale(1, 1, -1)
  sphere.name='homeMesh'
  scene.add( sphere );
  createBtn('home2')
}
function createBtn(home){
  activeHome=home;
  // 添加一个圆形按钮，点击后跳转到其他场景
  let planeGemetry = new THREE.CircleGeometry(0.2, 20);
  let planeMaterial = new THREE.LineBasicMaterial( { transparent:true,opacity:0.5,color: 0xffffff, side: THREE.DoubleSide } );

  let planeMesh = new THREE.Mesh(planeGemetry, planeMaterial);
  planeMesh.position.set(...homeObj[home].btnPosition)
  if(home==='home1'){
    planeMesh.rotateX(Math.PI/4)
  }else{
    planeMesh.rotateX(-Math.PI/6)
  }
  planeMesh.name = "locationBtn"
  scene.add( planeMesh );
}



function animate() {
  controls.update();
  requestAnimationFrame(animate);
  render();

}
function onMouseDown(event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX /  window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY /  window.innerHeight) * 2 + 1;

  //将平面坐标系转为世界坐标系
  raycaster.setFromCamera(mouse, camera);

  //得到点击的几何体
  const raycasters = raycaster.intersectObjects(scene.children);

  if(raycasters[0].object.name === 'locationBtn'){
    // 切换场景前把之前的物体清除掉
    const homeMesh1 = scene.getObjectByName('homeMesh')
    const locationBtn = scene.getObjectByName('locationBtn')
    scene.remove(homeMesh1, locationBtn)
    if(activeHome==='home1'){
      createHome2()
    }else{
      createHome1()
    }
  }
}
function render() {
  renderer.render(scene, camera);
}

// 挂载完成生成画面
onMounted(() => {
  controls = new OrbitControls(camera, renderer.domElement);
  // 开启阻尼
  controls.enableDamping = true;
  controls.maxDistance = 3;
  container.value.appendChild(renderer.domElement);
  //监视鼠标左键按下事件
  window.addEventListener("mousedown", onMouseDown, false);
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