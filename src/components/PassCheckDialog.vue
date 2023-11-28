<script lang="ts" setup>
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import { computed, inject, onMounted, ref } from 'vue'
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
const userPass = ref<{
  passCode: string,
  firstName: string,
  lastName: string,
  email: string,
  refUser?: any,
  isCompanion?: boolean
}>()

async function checkPass () {
  try {
    const passDataJson = JSON.parse(passData.value)

    // console.log(passDataJson)
    checkResultData.value = await api.call('post', 'qrpass/check', {
      ...passDataJson,
      eventId: event.event._id
    })

    if (checkResultData.value) {

      if (passDataJson.passCode === checkResultData.value.passCode) {
        userPass.value = {
          passCode: checkResultData.value.passCode,
          firstName: checkResultData.value.user.firstName,
          lastName: checkResultData.value.user.lastName,
          email: checkResultData.value.user.email
        }
      } else {
        const companion = checkResultData.value.companions.find((companion) => companion.passCode === passDataJson.passCode)

        if (companion) {
          userPass.value = {
            ...companion,
            isCompanion: true,
            refUser: checkResultData.value.user
          }
        }
      }

    }

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

  <div class="text-lg text-center mb-3" v-if="checkResultData">
    <div class="">
      <div>Utente</div>
      <strong>{{ userPass.firstName }} {{ userPass.lastName }}</strong>
    </div>

    <div class="mt-3" v-if="userPass.isCompanion">
      <div>Accompagnatore di</div>
      <strong>{{ userPass.refUser.firstName }} {{
          userPass.refUser.lastName
        }}</strong>
    </div>
  </div>

  <Button class="w-full justify-content-center mt-4" v-if="!loading" @click="closeDialog">Ok</Button>
</template>

<style lang="scss">
.p-progress-spinner-circle {
  stroke: #3B82F6;
}
</style>
