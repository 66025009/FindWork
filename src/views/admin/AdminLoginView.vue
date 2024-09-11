<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { useEventStore } from '@/stores/event';

const router = useRouter()
const accountStore = useAccountStore()
const eventStore = useEventStore()
const email = ref('')
const password = ref('')

const loginAdmin = async () => {
  try {
    await accountStore.signInEmailAdmin(email.value, password.value)
    router.push({ name: 'admin-home' })
  } catch (error) {
    let errorMessage = 'มีปัญหาเกี่ยวกับการล็อกอิน'
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'อีเมลไม่ถูกต้อง'
        break
      case 'auth/missing-password':
        errorMessage = 'กรุณากรอกรหัสผ่าน'
      break
      case 'auth/wrong-password':
        errorMessage = 'รหัสผ่านไม่ถูกต้อง'
        break
      case 'auth/user-not-found':
        errorMessage = 'บัญชีผู้ใช้ไม่พบ'
        break
      case 'auth/network-request-failed':
        errorMessage = 'เกิดข้อผิดพลาดเกี่ยวกับเครือข่าย'
        break
      default:
        errorMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
        break
    }
    eventStore.popupMessage('Error signing in admin:', error)
  }
}

                        

</script>
<template>
    <div>
        <div class="h-screen flex items-center justify-center">
            <div class="flex-1 max-w-3xl shadow-xl mx-auto p-8">
                <div class="flex flex-col items-center space-y-4 ">
                    <h1 class="text-xl">Login</h1>
                    <label class="input input-bordered flex items-center gap-2 w-96">
                        Email
                        <input v-model="email" type="text" class="grow" placeholder="email@gmail.com" />
                    </label>
                    <label class="input input-bordered flex items-center gap-2 w-96">
                        Password
                        <input v-model="password" type="password" class="grow" value="">
                    </label>
                    <button @click="loginAdmin" class="btn btn-neutral w-96 text-l">เข้าสู่ระบบ</button>
                </div>
            </div>
        </div>
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