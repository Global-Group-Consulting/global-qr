<script lang="ts" setup>
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import { inject, onMounted, ref } from 'vue'
import useApi from '@/composables/api'
import type { Ref } from 'vue'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { AxiosError } from 'axios'
import { useEventStore } from '@/stores/event'

const api = useApi()
const event = useEventStore()
const dialogRef = inject('dialogRef') as Ref<DynamicDialogInstance>
const passData = ref('')
const loading = ref(true)
const checkError = ref(null)
const checkResultData = ref(null)

async function checkPass () {
  try {
    const passDataJson = JSON.parse(passData.value)

    // console.log(passDataJson)
    checkResultData.value = await api.call('post', 'qrpass/check', {
      ...passDataJson,
      eventId: event.event._id
    })
  } catch (er: any) {
    if (er instanceof AxiosError) {
      checkError.value = er.response?.data?.error ?? er.response?.data?.message
    } else {
      api.handleError(er)
    }
  } finally {
    loading.value = false
  }
}

async function closeDialog () {
  dialogRef.value.close({ result: !!checkResultData.value })
}

onMounted(() => {
  passData.value = dialogRef.value.data.passData

  checkPass()
})
</script>

<template>
  <div class="bg-primary-reverse p-4" v-if="loading">
    <div class="text-lg mb-3 text-center">Controllo in corso...</div>
    <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
  </div>

  <div class="bg-red-700 p-4 border-round" v-if="checkError">
    <div class="text-xl text-center">Controllo fallito!!</div>
    <p class="text-lg text-center mb-0">{{ checkError }}</p>
  </div>

  <div class="bg-green-700 p-4 border-round mb-4" v-if="checkResultData">
    <div class="text-xl text-center">Controllo pass riuscito!!</div>
  </div>

  <div class="text-lg mb-0" v-if="checkResultData">
    Il pass è registrato a nome di:

    <ul>
      <li>{{ checkResultData.user.firstName }} {{ checkResultData.user.lastName }}</li>
    </ul>

    Sono registrati: <strong>{{ checkResultData.companions.length }} accompagnatore/i</strong>:

    <ul>
      <li v-for="(companion, i) in checkResultData.companions" :key="i">
        {{ companion.firstName }} {{ companion.lastName }}
      </li>
    </ul>
  </div>

  <Button class="w-full justify-content-center mt-4" v-if="!loading" @click="closeDialog">Ok</Button>
</template>

<style lang="scss">
.p-progress-spinner-circle {
  stroke: #3B82F6;
}
</style>
