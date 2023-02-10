<template>
  <div class="home">
    <router-link v-for="(item,index) in exampleNameList" :key="index" :to="{name:item.name}">
      <div>{{ item.title }}</div>
    </router-link>
  </div>
</template>

<script setup>
import {exampleNameList} from "@/views/example/index.js"
</script>
<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
</style>