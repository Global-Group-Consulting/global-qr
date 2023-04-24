<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import useApi from '@/composables/api'
import useFormatters from '@/composables/formatters'
import { useEventStore } from '@/stores/event'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const api = useApi()
const formatters = useFormatters()
const eventStore = useEventStore()
const toast = useToast()
const router = useRouter()
const selectedEvent = ref(null)
const events = ref([])

async function fetchEvents () {
  try {
    events.value = await api.call('get', 'qrpass/events')
  } catch (er: any) {
    api.handleError(er)
  }
}

function onStoreChange () {
  if (!selectedEvent.value) {
    toast.add({ summary: 'Seleziona un evento', severity: 'error', life: 3000 })
  }

  eventStore.event = selectedEvent.value

  if (eventStore.event) {
    router.push('event/' + eventStore.event._id)
  }
}

onMounted(async () => {
  const token = localStorage.getItem('qrpass_token')

  if (token) {
    await fetchEvents()
  }

  selectedEvent.value = eventStore.event
})
</script>

<template>
  <main class="flex justify-content-center md:align-items-center sm:min-h-screen pt-4 md:pt-0">
    <div class="grid w-full justify-content-center">
      <div class="col-12 sm:col-8 md:col-6 xl:col-5">
        <div class="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1 w-full">
          <div class="mb-4">
            <div class="text-900 text-xl font-bold mb-2">Global PASS</div>
            <div class="text-600 font-medium">Scegli un evento</div>
          </div>

          <div class="mb-3">
            <Dropdown v-model="selectedEvent" :options="events" optionLabel="label" placeholder="Evento"
                      class="w-full">

              <template #value="slotProps">
                {{ slotProps.value?.title ?? slotProps.placeholder }}
              </template>

              <template #option="slotProps">
                <div class="flex flex-column">
                  <div>{{ slotProps.option?.title }}</div>
                  <div class="text-600">{{ formatters.dateFormat(slotProps.option?.startAt, true) }}</div>
                </div>
              </template>
            </Dropdown>
          </div>

          <Button label="Ok, fatto" type="submit" @click="onStoreChange"/>
        </div>
      </div>
    </div>
  </main>
</template>


<style scoped lang="scss">

</style>
