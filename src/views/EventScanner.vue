<script lang="ts" setup>
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import { useEventStore } from '@/stores/event'
import QrScanner from '@/components/QrScanner.vue'

const eventStore = useEventStore()
</script>

<template>
  <main class="flex justify-content-center flex justify-content-center md:align-items-center sm:min-h-screen pt-4 md:pt-0">
    <div class="grid w-full justify-content-center">
      <div class="col-12 sm:col-10 md:col-8 xl:col-5">
        <div class="border-1 surface-border surface-card border-round py-4 px-4 md:px-4 z-1 w-full">
          <div class="mb-4">
            <div class="text-900 text-xl font-bold mb-4 flex align-items-center gap-3">
              <Button icon="pi pi-angle-left" aria-label="Back" outlined size="small" @click="$router.push('/choose-event')"/>
              Global PASS
            </div>
            <div class="text-600 font-medium">Scannerizza il pass dei partecipanti</div>
          </div>

          <TabView>
            <TabPanel header="Scanner">
              <QrScanner />
            </TabPanel>

            <TabPanel header="Accessi">
              <p>Presto disponibile</p>
            </TabPanel>

            <TabPanel header="Evento">
              <p>Presto disponibile</p>
            </TabPanel>
          </TabView>

        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">

</style>
