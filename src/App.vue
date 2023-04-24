<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import DynamicDialog from 'primevue/dynamicdialog'
</script>

<template>
  <Toast/>

  <RouterView/>

  <DynamicDialog />
</template>
