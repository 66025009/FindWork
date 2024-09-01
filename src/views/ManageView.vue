<script setup>
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'

const router = useRouter()
const accountStore = useAccountStore()

const displayName = ref('')
const newPassword = ref('')

const updatePassword = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      console.error('No user is currently signed in.')
      return
    }
    // ใช้ displayName แทน
    const currentDisplayName = user.displayName
    if (!currentDisplayName) {
      console.error('User displayName is not set.')
      return
    }
    await accountStore.updatePassword(newPassword.value)
    router.push({ name: 'login' }) 
  } catch (error) {
    console.error('Error updating password:', error.message)
  }
}

const deleteAccount = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      console.error('No user is currently signed in.')
      return
    }
    // ใช้ displayName แทน
    const currentDisplayName = user.displayName
    if (!currentDisplayName) {
      console.error('User displayName is not set.')
      return
    }
    await accountStore.deleteAccount()
    router.push({ name: 'login' }) 
  } catch (error) {
    console.error('Error deleting account:', error.message)
  }
}
</script>

<template>
  <div
    class="hero min-h-screen bg-contain relative"
    style="background-image: url(/bg.jpg);">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative flex items-center justify-center h-3/4 w-8/12 bg-gradient-to-b from-[#e1ca9d] via-[#ec61cd] to-[#715ded] rounded-3xl">
      <div class="relative flex items-center justify-center bg-base-200 p-2 rounded-3xl h-[580px] w-[1055px]">
        <div class="hero-content text-center">
          <div class="max-w-md mx-auto">
            <h1 class="text-xl font-bold">FindWork</h1>
            <h2 class="text-l font-normal">จัดการบัญชี</h2>

            <div class="flex items-center justify-center space-y-2 pb-4 mt-6">
              <div class="flex-col space-y-2">
                <label class="input input-bordered flex items-center gap-2 w-full">
                  <input type="text" class="grow" v-model="displayName" placeholder="ชื่อเล่นหรือนามแฝง" />
                </label>

                <div class="flex flex-row justify-center space-x-4">
                  <label class="input input-bordered flex items-center gap-2 w-80">
                    Email
                    <input type="text" class="grow" placeholder="email@gmail.com" />
                  </label>
                  <div>
                    <label class="input input-bordered flex items-center gap-2 w-80 relative">
                      Password
                      <input type="password" v-model="newPassword" class="grow" placeholder="New Password" />
                      <span
                        @click="toggleCurrentPasswordVisibility"
                        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer z-10">
                      </span>
                    </label>
                    <p class="text-s text-black/50 text-left mt-2">อย่างน้อย 8 ตัวอักษร <br> พิมพ์เล็ก พิมพ์ใหญ่และตัวอักษรพิเศษ</p>
                  </div>
                </div>
              </div>
            </div>

            <section class="flex w-full flex items-center justify-center space-x-2">
              <button @click="updatePassword" class="btn bg-green hover:bg-greenhover text-l font-bold text-white w-80 p-4">เปลี่ยน</button>
              <button @click="deleteAccount" class="btn btn-error text-l font-bold text-white w-80 p-4">ลบบัญชี</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
