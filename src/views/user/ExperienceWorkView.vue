<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProvinceStore } from '@/stores/user/province'
import { useUniversityStore } from '@/stores/user/university'
import { useEventStore } from '@/stores/event' // เพิ่มการนำเข้า useEventStore
import { db, doc, setDoc, getAuth } from '@/firebase'

const router = useRouter() // ใช้ useRouter เพื่อทำการนำทาง
const eventStore = useEventStore() // ใช้ useEventStore เพื่อแสดงข้อความป๊อปอัพ

const provinceStore = useProvinceStore()
const universityStore = useUniversityStore()

const name = ref('')
const birthDate = ref('')
const companyName = ref('')
const university = ref('')
const province = ref('')
const address = ref('')

const isFormValid = computed(() => {
  return name.value !== '' &&
         birthDate.value !== '' &&
         companyName.value !== '' &&
         university.value !== '' &&
         province.value !== '' &&
         address.value !== ''
})

// ฟังก์ชันบันทึกข้อมูล
const saveData = async () => {
  if (isFormValid.value) {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const userId = user ? user.uid : null

      if (userId) {
        await setDoc(doc(db, 'user', userId), {
          name: name.value,
          birthDate: birthDate.value,
          companyName: companyName.value,
          university: university.value,
          province: province.value,
          address: address.value
        })
        router.push({ name: 'home' }) // ปรับชื่อเส้นทางให้ตรงกับที่กำหนดใน router
      } else {
        eventStore.popupMessage('error', 'ไม่พบผู้ใช้')
      }
    } catch (error) {
      console.error('Error updating document: ', error)
      eventStore.popupMessage('error', 'เกิดข้อผิดพลาด')
    }
  } else {
    eventStore.popupMessage('error', 'กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-lightgray">
    <div class="relative bg-white rounded-2xl p-8 m-4 shadow-lg max-w-md w-full">
      <RouterLink :to="{ name: 'home'}" class="absolute top-2 right-2 text-gray-500 hover:text-red-400">
        <span class="material-symbols-outlined">close</span>
      </RouterLink>
      <p class="text-base space-x-2 text-center">
        หากเป็นนักศึกษา คลิกที่ฟอร์มนี้ 
        <br>
        <RouterLink :to="{ name: 'experience-student'}" class="link link-info">ฟอร์มสำหรับนักศึกษา</RouterLink>
      </p>
      <div class="space-y-4 pt-4">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base">ชื่อ-นามสกุล</span>
          </div>
          <input type="text" v-model="name" class="input input-bordered w-full" />
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base">วัน/เดือน/ปีเกิด</span>
          </div>
          <input type="text" v-model="birthDate" class="input input-bordered w-full" />
          <div class="label">
            <span class="label-text-alt">เช่น 12/12/2004</span>
          </div>
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base">ชื่อบริษัท</span>
          </div>
          <input type="text" v-model="companyName" placeholder="ชื่อบริษัท" class="input input-bordered w-full" />
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base">ที่อยู่</span>
          </div>
          <input type="text" v-model="address" placeholder="ที่อยู่" class="input input-bordered w-full" />
        </label>
        <select v-model="province" class="select select-bordered w-full text-base">
          <option disabled value="">เลือกจังหวัด</option>
          <option v-for="province in provinceStore.getProvinces" :key="province" :value="province">{{ province }}</option>
        </select>
        <select v-model="university" class="select select-bordered w-full text-base">
          <option disabled value="">เลือกมหาวิทยาลัยที่เคยศึกษา</option>
          <option v-for="university in universityStore.getUniversities" :key="university" :value="university">{{ university }}</option>
        </select>
        <button class="btn btn-neutral w-full" :disabled="!isFormValid" @click="saveData">บันทึก</button>
      </div>
    </div>
    <div v-if="eventStore.alert" >
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
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>