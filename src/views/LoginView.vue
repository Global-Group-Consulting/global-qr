<script setup lang="ts">
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

import { onMounted, reactive, ref } from 'vue'
import useApi from '@/composables/api'
import { useRouter } from 'vue-router'

const api = useApi()
const router = useRouter()

const loginData = reactive({
  username: '',
  password: ''
})

async function login () {
  try {
    await api.login(loginData.username, loginData.password)

    await router.replace('/choose-event')
  } catch (er: any) {
    api.handleError(er)
  }
}

onMounted(async () => {
  const token = localStorage.getItem('qrpass_token')

  if (token) {
    return await router.replace('/choose-event')
  }

  // try to get params from url
  const urlParams = new URLSearchParams(window.location.search)

  if (urlParams) {
    try {
      const params = JSON.parse(atob(urlParams.get('login') as string))

      loginData.username = params.username
      loginData.password = params.password
    } catch (e) {
      console.log(e)
    }
  }
})
</script>

<template>
  <main
      class="flex justify-content-center flex justify-content-center md:align-items-center sm:min-h-screen pt-4 md:pt-0">
    <div class="grid w-full justify-content-center">
      <div class="col-12 sm:col-8 md:col-6 xl:col-5">
        <form class="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1 w-full"
              @submit.prevent="login">
          <div class="mb-4">
            <div class="text-900 text-xl font-bold mb-2">Global PASS</div>
            <div class="text-600 font-medium">Accedi</div>
          </div>

          <div class="p-inputgroup flex-1 mb-3">
            <div class="p-inputgroup-addon">
              <i class="pi pi-user"></i>
            </div>
            <InputText placeholder="Nome utente" v-model="loginData.username"/>
          </div>

          <div class="p-inputgroup flex-1 mb-3">
            <span class="p-inputgroup-addon">#</span>
            <Password toggle-mask class="w-full" :input-class="{'w-full': true}" :feedback="false"
                      placeholder="Password"
                      v-model="loginData.password"/>
          </div>

          <Button label="Accedi" type="submit"/>
        </form>
      </div>
    </div>
  </main>
</template>

