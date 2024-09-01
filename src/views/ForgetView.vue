<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useAccountStore } from '@/stores/account'

const accountStore = useAccountStore()
const router = useRouter()

const email = ref('')

onMounted(async () => {
  await accountStore.initializeAuth()
})

const forget = async () => {
  try {
    await accountStore.Forget(email.value)
    alert('ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว')
    router.push({ name: 'manage' }) 
  } catch (error) {
    console.error('Error sending reset password email:', error)
    alert('ไม่สามารถส่งลิงก์รีเซ็ทรหัสผ่านได้')
  }
}
</script>


<template>
  <div
    class="hero min-h-screen bg-contain relative"
    style="background-image: url(/bg.jpg);">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative flex items-center justify-center h-3/4 w-1/3 bg-gradient-to-b from-[#e1ca9d] via-[#ec61cd] to-[#715ded] rounded-3xl">
      <div class="relative flex items-center justify-center bg-base-200 p-2 rounded-3xl h-[580px] w-[500px]">
        <div class="hero-content text-center">
          <div class="max-w-md mx-auto">
            <h1 class="text-xl font-bold">FindWork</h1>
            <h2 class="text-l font-normal">คอยติดตามข้อมูลล่าสุดในโลก <br> แห่งอาชีพของคุณ</h2>
            <div class="space-y-2 pt-6">
              <label class="input input-bordered flex items-center gap-2 w-96">
                Email
                <input v-model="email" type="text" class="grow" placeholder="email@gmail.com" />
              </label>
              <div class="flex justify-between text-l font-bold py-3">
                <RouterLink :to="{ name: 'login'}" class="text-left text-blue">ลงชื่อเข้าใช้</RouterLink>
                <RouterLink :to="{ name: 'register'}" class="text-right text-sky">ลงทะเบียน</RouterLink>
              </div>
              <button @click="forget" class="btn bg-green hover:bg-greenhover text-l font-bold text-white w-96 p-4">รีเซ็ทรหัสผ่าน</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
