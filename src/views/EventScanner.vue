<script lang="ts" setup>
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { useEventStore } from '@/stores/event'
import { ref } from 'vue'
import QrScanner from '@/components/QrScanner.vue'

const eventStore = useEventStore()


</script>

<template>
  <main class="flex justify-content-center flex justify-content-center md:align-items-center sm:min-h-screen pt-4 md:pt-0">
    <div class="grid w-full justify-content-center">
      <div class="col-12 sm:col-10 md:col-8 xl:col-5">
        <div class="border-1 surface-border surface-card border-round py-7 px-4 md:px-4 z-1 w-full">
          <div class="mb-4">
            <div class="text-900 text-xl font-bold mb-2">Global PASS</div>
            <div class="text-600 font-medium">Scannerizza il pass dei partecipanti</div>
          </div>

          <TabView>
            <TabPanel header="Scanner">
              <QrScanner />
            </TabPanel>

            <TabPanel header="Accessi">
              <p>Presto </p>
            </TabPanel>

            <TabPanel header="Evento">
              <p>Evento</p>
            </TabPanel>
          </TabView>

        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">

</style>
