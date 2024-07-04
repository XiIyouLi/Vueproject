<template>
  <div>
    <!-- <h1>3D展示</h1> -->
    <div id="myChart"></div>
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import navList from "../utils/navList";
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import * as echarts from 'echarts';

var myChart = null;
const userStore = useUserStore();
const { userList } = storeToRefs(userStore);

let loopIndex = 0;
const canvasRef = ref(null);
const camera = ref(null);
const activeKey = ref(0);
const cacheName = reactive([]);

const showModel = ({ position, target }) => {
  animateCamera("position", new BABYLON.Vector3(...position), camera.value);
  animateCamera("target", new BABYLON.Vector3(...target), camera.value);
}

// 视角切换过程中的过渡动画
const animateCamera = (type, newPos, camera) => {
  const speed = 60;
  const frameCount = 240;

  const ease = new BABYLON.CubicEase();
  ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  BABYLON.Animation.CreateAndStartAnimation(
    "animation",
    camera,
    type,
    speed,
    frameCount,
    camera[type],
    newPos,
    0,
    ease
  );
}

// 聚焦到某一个物体或区域的视角
const selectModel = (names, animation, scene) => {
  scene.meshes.forEach((mesh) => {
    if (cacheName.includes(mesh.name)) {
      mesh.material.albedoColor = scene.cacheMeshColor;
    }
    if (names.includes(mesh.name)) {
      scene.cacheMeshColor = mesh.material.albedoColor;
      cacheName.push(...names);
      mesh.material.albedoColor = new BABYLON.Color3(0, 221 / 255, 1);
      showModel(animation);
    }
  });
}

// 生成地面
const ground = (scene) => {
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 12, height: 12 }, scene);
  // ground.position.set()
  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
  ground.material.backFaceCulling = false;
  return ground;
}

// 生成圆球
const addSphere = (scene) => {
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new BABYLON.Vector3(0, 1, 0)
  sphere.position.set(0, 3, 0);

  sphere.actionManager = new BABYLON.ActionManager(scene);
  sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
    alert('sphere clicked');
  }));
  return sphere;
}

// 生成书桌
const addDesk = (scene) => {
  const box = BABYLON.MeshBuilder.CreateBox("box", {
    size: 4,
    width: 4,
    height: 0.2,
    // diameter: 2
  }, scene)
  box.position.set(0, 1.9, 0);

  const box1 = BABYLON.MeshBuilder.CreateBox("box1", {
    size: 0.2,
    width: 0.2,
    height: 1.8,

  }, scene)
  box1.position.set(1.9, 0.9, 1.9);

  const box2 = BABYLON.MeshBuilder.CreateBox("box2", {
    size: 0.2,
    width: 0.2,
    height: 1.8,

  }, scene)
  box2.position.set(-1.9, 0.9, 1.9);

  const box3 = BABYLON.MeshBuilder.CreateBox("box3", {
    size: 0.2,
    width: 0.2,
    height: 1.8,

  }, scene)
  box3.position.set(-1.9, 0.9, -1.9);

  const box4 = BABYLON.MeshBuilder.CreateBox("box4", {
    size: 0.2,
    width: 0.2,
    height: 1.8,

  }, scene)
  box4.position.set(1.9, 0.9, -1.9);

  const box5 = BABYLON.MeshBuilder.CreateBox("box5", {
    size: 0.1,
    width: 3.8,
    height: 0.8,

  }, scene)
  box5.position.set(0, 1.4, -1.95);

  const box6 = BABYLON.MeshBuilder.CreateBox("box6", {
    size: 0.4,
    width: 0.2,
    height: 1.8,

  }, scene)
  box6.position.set(-1.9, 0.9, 0);

  const box7 = BABYLON.MeshBuilder.CreateBox("box7", {
    size: 0.4,
    width: 0.2,
    height: 1.8,

  }, scene)
  box7.position.set(1.9, 0.9, 0);

  const box8 = BABYLON.MeshBuilder.CreateBox("box8", {
    size: 0.1,
    width: 3.8,
    height: 0.8,

  }, scene)
  box8.position.set(0, 1.4, 0);

  const box9 = BABYLON.MeshBuilder.CreateBox("box9", {
    size: 0.1,
    width: 3.8,
    height: 0.8,

  }, scene)
  box9.position.set(0, 2.4, 0);
  const boxMaterial = new BABYLON.StandardMaterial("box", scene);
  boxMaterial.diffuseTexture = new BABYLON.Texture("src/assets/zwdzjs.webp", scene);
  boxMaterial.diffuseTexture.uScale = 1;
  boxMaterial.diffuseTexture.vScale = 1;
  boxMaterial.specularColor = new BABYLON.Color3(1, 1, 0);
  box.material = boxMaterial;
  return box;
}

// 生成小圆桌
const addTable = (scene) => {
  const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 0.2, diameter: 2 }, scene)
  cylinder.position.set(3, 1, 0)
  const cylinder1 = BABYLON.MeshBuilder.CreateCylinder("cylinder1", { height: 0.9, diameter: 0.2 }, scene)
  cylinder1.position.set(2.5, 0.45, 0.5)
  const cylinder2 = BABYLON.MeshBuilder.CreateCylinder("cylinder2", { height: 0.9, diameter: 0.2 }, scene)
  cylinder2.position.set(2.5, 0.45, -0.5)
  const cylinder3 = BABYLON.MeshBuilder.CreateCylinder("cylinder3", { height: 0.9, diameter: 0.2 }, scene)
  cylinder3.position.set(3.5, 0.45, 0.5)
  const cylinder4 = BABYLON.MeshBuilder.CreateCylinder("cylinder4", { height: 0.9, diameter: 0.2 }, scene)
  cylinder4.position.set(3.5, 0.45, -0.5)
}

// 初始化引擎：生成3D视图所需的场景、素材、相机，并调用相关函数添加对应的元素：书桌、小圆桌、外部模型导入...
const initEngine = async () => {
  if (canvasRef.value) {
    const engine = new BABYLON.Engine(canvasRef.value, true);
    const scene = new BABYLON.Scene(engine);
    camera.value = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 10,
      Math.PI / 3,
      20,
      BABYLON.Vector3.Zero(),
      scene,
    )

    camera.value.attachControl(canvasRef.value)
    camera.value.lowerBetaLimit = 0;
    camera.value.upperBetaLimit = Math.PI / 2;
    camera.value.lowerRadiusLimit = 3;
    camera.value.upperRadiusLimit = 40;

    const light = new BABYLON.HemisphericLight(
      "HemisphericLight",
      new BABYLON.Vector3(0, 1, 0),
      this
    )

    light.intensity = 1
    // light.diffuse = new BABYLON.Color3(1, 0, 0);
    light.specular = new BABYLON.Color3(1, 1, 0);
    // light.groundColor = new BABYLON.Color3(0, 0, 0.4);

    BABYLON.SceneLoader.Append('/model/', 'library_draco.glb', scene, (meshes) => {
      console.log(meshes)
      showModel(animation)
    })


    engine.runRenderLoop(() => {
      scene.render();
    })
    scene.debugLayer.show({
      embedMode: true,
    });

    window.addEventListener('resize', () => {
      engine.resize();
    })
    // autoPlay(scene);
  }
}

// 触发视角切换逻辑
const autoPlay = (scene) => {
  const play = () => {
    if (loopIndex >= navList.length) loopIndex = 0;
    activeKey.value = loopIndex;
    const { names, animation } = navList[loopIndex];
    // scene.value.selectModel(names, animation);
    selectModel(names, animation, scene);
    // showModel(animation)
    loopIndex++;
  };
  let timer = setInterval(play, 5000);
};
const Upchart = () => {
  var option = {
    xAxis: {
      type: 'category',
      data: userStore.userList.map((item) => {
        return item.userName;
      }),
      axisLabel: { // 设置X轴刻度标签的样式  
        color: '#FFFFFF', // 将X轴刻度标签的字体颜色设置为白色  
        fontSize: 15  
      }  

    },
    yAxis: {
      type: 'value',
      axisLabel: { // 设置X轴刻度标签的样式  
        color: '#FFFFFF', // 将X轴刻度标签的字体颜色设置为白色  
        fontSize: 15  
      }  
    },
    series: [
      {
        data: userStore.userList.map((item) => {
          return item.age;
        }),
        type: 'bar',
        color:[
          '#a7cfbc'
        ]
        
      },
      
    ],
  };
  myChart.setOption(option);
};

watch(
  () => userStore.userList,
  (newValue, oldValue) => {
    Upchart();
  },
  { deep: true }
);
onMounted(() => {
  initEngine();
  myChart = echarts.init(document.getElementById('myChart'));
  Upchart();

});

</script>

<style scoped>
#myChart {
  width: 400px;
  height: 500px;
  margin-top: 60px;
  position: absolute;
  z-index: 1;
}

.canvas {
  position: absolute;
  width: 100%;
  height: 90vh;
}
</style>