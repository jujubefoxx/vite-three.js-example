<template>
  <router-link  v-for="(name,index) in exampleNameList" :key="index" :to="{name}">
    <div>{{ name }}</div>
  </router-link>
</template>

<script>
export default {
  name: "index.vue"
}
</script>
<script setup>
import {exampleNameList} from "@/example/index.js"
</script>
<style scoped>

</style>