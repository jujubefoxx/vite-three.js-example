<template>
  <div class="container" ref="container"></div>
</template>

<script>
export default {
  name: "shoe"
}
</script>
<script setup>
import {onMounted, ref} from "vue"
import * as THREE from 'three';
import commonListener from "@/utils/common.js"
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
// 导入模型的材质文件
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RGBELoader} from "three/addons/loaders/RGBELoader.js";

const container = ref(null);
let camera, scene, renderer, controls;

function init() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(2.5, 1.5, 3.0);
  // antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // .outputEncoding : number
  // 定义渲染器的输出编码。默认为THREE.LinearEncoding
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3dd);

  // 通用监听器
  commonListener(camera, renderer)
}

init();
let gui;

function creatLoader() {
  const state = {variant: 'midnight'};
  new RGBELoader()
      .setPath('../src/assets/files/shoes/')
      .load('quarry_01_1k.hdr', function (texture) {

        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;

        render();

        // model
        const loader = new GLTFLoader().setPath('../src/assets/files/shoes/');

        loader.load('MaterialsVariantsShoe.gltf', function (gltf) {

          gltf.scene.scale.set(10.0, 10.0, 10.0);

          scene.add(gltf.scene);

          // GUI
          gui = new GUI();

          // Details of the KHR_materials_variants extension used here can be found below
          // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_variants
          const parser = gltf.parser;
          const variantsExtension = gltf.userData.gltfExtensions['KHR_materials_variants'];
          const variants = variantsExtension.variants.map((variant) => variant.name);
          const variantsCtrl = gui.add(state, 'variant', variants).name('Variant');

          selectVariant(scene, parser, variantsExtension, state.variant);

          variantsCtrl.onChange((value) => selectVariant(scene, parser, variantsExtension, value));

          render();

        });

      });

}

function selectVariant(scene, parser, extension, variantName) {
  const variantIndex = extension.variants.findIndex((v) => v.name.includes(variantName));

  scene.traverse(async (object) => {

    if (!object.isMesh || !object.userData.gltfExtensions) return;

    const meshVariantDef = object.userData.gltfExtensions['KHR_materials_variants'];

    if (!meshVariantDef) return;

    if (!object.userData.originalMaterial) {

      object.userData.originalMaterial = object.material;

    }

    const mapping = meshVariantDef.mappings
        .find((mapping) => mapping.variants.includes(variantIndex));

    if (mapping) {

      object.material = await parser.getDependency('material', mapping.material);
      parser.assignFinalMaterial(object);

    } else {

      object.material = object.userData.originalMaterial;

    }

    render();

  });

}

creatLoader();


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