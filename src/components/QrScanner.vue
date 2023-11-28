<script lang="ts" setup>
import { Html5QrcodeScanner } from 'html5-qrcode'
import { onMounted, ref } from 'vue'
import PassCheckDialog from '@/components/PassCheckDialog.vue'
import { useDialog } from 'primevue/usedialog'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import OverlayPanel from 'primevue/overlaypanel'
import { Html5QrcodeScannerState } from 'html5-qrcode/src/state-manager'

const dialog = useDialog()
let html5QrcodeScanner: Html5QrcodeScanner
let passCheckDialog: DynamicDialogInstance
const manualCodeDialogVisible = ref(false)
const manualCode = ref(null)

function onScanSuccess (decodedText: string, decodedResult: any) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${decodedText}`, decodedResult)

  html5QrcodeScanner.pause(true)
  openDialog(decodedText)
}

function onScanFailure (error: string) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  // console.warn(`Code scan error = ${error}`)
}

function openDialog (text: string) {
  passCheckDialog = dialog.open(PassCheckDialog, {
    props: {
      header: 'Controllo pass',
      style: { width: '50vw' },
      breakpoints: { '960px': '75vw', '576px': '100vw' },
      position: 'top',
      modal: true
    },
    data: {
      passData: text//'{"reservationId":"64429b0b5997ba30235ed6b2","passCode":"6446f0e00d9ac"}'
    },
    onClose: (resp: any) => {
      if (html5QrcodeScanner.getState() === Html5QrcodeScannerState.PAUSED && !manualCodeDialogVisible.value) {
        html5QrcodeScanner.resume()
        manualCodeHide(false)
      } else {
        manualCodeHide(true)
      }
    }
  })
}

function manualCodeShow () {
  if (html5QrcodeScanner.getState() === Html5QrcodeScannerState.SCANNING) {
    html5QrcodeScanner.pause(true)
  }

  manualCodeDialogVisible.value = true
}

function manualCodeHide (resumeScanner?: boolean) {
  manualCodeDialogVisible.value = false
  manualCode.value = null

  if (resumeScanner && html5QrcodeScanner.getState() === Html5QrcodeScannerState.PAUSED) {
    html5QrcodeScanner.resume()
  }
}

function sendManualCode () {
  openDialog(JSON.stringify({ passCode: manualCode.value }))
}

function initScanner () {
  html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        videoConstraints: { facingMode: 'environment' }
      },
      /* verbose= */ false)
  html5QrcodeScanner.render(onScanSuccess, onScanFailure)
}

onMounted(() => {
  initScanner()
})
</script>

<template>
  <div id="reader" class="-mx-3"></div>

  <div class=" mt-5 p-3">
    <div class="text-lg text-center">
      Il QR Code non funziona?
      <div class="p-2"></div>
      <Button @click="manualCodeShow">Inserisci a mano il codice</Button>
    </div>
  </div>

  <Dialog v-model:visible="manualCodeDialogVisible"
          header="Inserisci manualmente il codice del pass"
          :style="{ width: '50vw' }"
          :breakpoints="{ '960px': '75vw', '576px': '100vw' }"
          position='bottom'
          modal
          @update:visible="manualCodeHide(true)">
    <InputText type="text" placeholder="Codice" class="w-full mb-4" v-model="manualCode"/>

    <Button class="justify-content-center w-full" @click="sendManualCode">Invia</Button>
  </Dialog>
</template>

<style lang="scss">
#html5-qrcode-anchor-scan-type-change {
  display: none;
}

[id*="html5-qrcode-button"] {
  color:         #ffffff;
  background:    #3B82F6;
  border:        1px solid #3B82F6;
  padding:       0.75rem 1.25rem;
  font-size:     1rem;
  transition:    background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  border-radius: 6px;
}

#reader__dashboard_section_csr {
  padding: 0 1rem ;

  > span {
    display: block;

  }

  > span:first-of-type {
    margin-right: 0 !important;
  }

  #html5-qrcode-select-camera {
    padding:       .6rem;
    margin-bottom: 2rem;
  }
}

</style>
