<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { useEventStore } from '@/stores/event';

const router = useRouter()
const accountStore = useAccountStore()
const eventStore = useEventStore()

const email = ref('')
const password = ref('')

onMounted(async () => {
  await accountStore.initializeAuth()
})

const loginG = async () => {
  try {
    await accountStore.signInWithGoogle()                             
    router.push({ name: 'home'})
  } catch (error) {
    console.log('error', error)
  }
}

const loginF = async () => {
  try {
    await accountStore.signInWithFacebook()                             
    router.push({ name: 'home'})
  } catch (error) {
    console.log('error', error)
  }
}

const loginWithLine = () => {
  const state = 'd8f9b5c6a8e5f3g9'; // ค่าที่ไม่ซ้ำกัน
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2006078548&redirect_uri=http://localhost:5177/callback&state=${state}&scope=profile%20openid`;
  window.location.href = lineLoginUrl;
}

const login = async () => {
  try {
    await accountStore.signInEmail(email.value, password.value)
    router.push({ name: 'home'})
  } catch (error) {
    eventStore.popupMessage('error', error.message)
  }
}
</script>

<template>
  <div
    class="hero min-h-screen bg-contain relative"
    style="background-image: url(/bg.jpg);">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative flex items-center justify-center h-5/6 w-1/3 bg-gradient-to-b from-[#e1ca9d] via-[#ec61cd] to-[#715ded] rounded-3xl">
      <div class="relative  flex items-center justify-center bg-base-200 p-2 rounded-3xl h-[650px] w-[500px]">
        <div class="hero-content text-center">
          <div class="max-w-md mx-auto">
            <h1 class="text-xl font-bold"> FindWork </h1>
            <h2 class="text-l font-normal"> คอยติดตามข้อมูลล่าสุดในโลก <br> แห่งอาชีพของคุณ </h2>
            <div class="space-y-2 pt-6"> 
              <label class="input input-bordered flex items-center gap-2 w-96">
                Email
                <input v-model="email" type="text" class="grow" placeholder="email@gmail.com" />
              </label>
              <label class="input input-bordered flex items-center gap-2">
                Password
                <input v-model="password" type="password" class="grow" value="">
              </label>
              <div class="flex justify-between text-l font-bold py-3">
                <RouterLink :to="{ name: 'register'}" class="text-left text-blue">ลงทะเบียน</RouterLink>
                <RouterLink :to="{ name: 'forget'}" class="text-right text-sky">ลืมรหัสผ่าน</RouterLink>
              </div>
              <button @click="login" class="btn bg-green hover:bg-greenhover text-l font-bold text-white w-96 p-4">ลงชื่อเข้าใช้</button>
            </div>
            <div class="divider divider-neutral py-3 ">หรือ</div>
            <div class="flex justify-center gap-16 pt-4">
              <button @click="loginG">
                  <img src="/G.png" alt="Google" class="h-14 w-14">
              </button>
              <button @click="loginF">
                  <img src="/F.png" alt="Facebook" class="h-[52px] w-[52px]">
              </button>
              <button @click="loginWithLine">
                  <img src="/L.png" alt="Line" class="h-[52px] w-[52px]">
              </button>
          </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Add Popup Template -->
    <div v-if="eventStore.alert" class="popup">
      {{ eventStore.data.message }}
    </div>
  </div>
</template>


<style scoped>
.popup {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(250, 67, 67);
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>