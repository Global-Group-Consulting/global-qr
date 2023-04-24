import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import useApi from '@/composables/api'

export const useEventStore = defineStore('event', () => {
  const event: Ref<any> = ref(null)
  const api = useApi()
  
  watch(event, (value) => {
    localStorage.setItem('qrpass_event', JSON.stringify(event.value))
  })
  
  onMounted(() => {
    const storedEvent = localStorage.getItem('qrpass_event')
    
    if (storedEvent) {
      event.value = JSON.parse(storedEvent)
    }
  })
  

  
  return {
    event,
    
  }
})
