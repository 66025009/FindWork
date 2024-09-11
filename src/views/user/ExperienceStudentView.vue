<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProvinceStore } from '@/stores/user/province'
import { useUniversityStore } from '@/stores/user/university'
import { useEventStore } from '@/stores/event'
import { db, doc, setDoc, getAuth } from '@/firebase'

const router = useRouter()

const provinceStore = useProvinceStore()
const universityStore = useUniversityStore()
const eventStore = useEventStore()

const name = ref('')
const birthDate = ref('')
const university = ref('')
const province = ref('')
const address = ref('')


const isFormValid = computed(() => {
  return name.value !== '' &&
         birthDate.value !== '' &&
         university.value !== '' &&
         province.value !== '' &&
         address.value !== ''
})

// ฟังก์ชันบันทึกข้อมูลลง Firestore
const saveData = async () => {
  if (isFormValid.value) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : null;

      if (userId) {
        await setDoc(doc(db, 'user', userId), {
          name: name.value,
          birthDate: birthDate.value,
          companyName: null, // กำหนดค่า companyName เป็น null
          university: university.value,
          province: province.value,
          address: address.value,
         
        });

        console.log({
          name: name.value,
          birthDate: birthDate.value,
          companyName: null,
          university: university.value,
          province: province.value,
          address: address.value,
        });
        // นำทางไปยังหน้าหลักหลังจากบันทึกข้อมูลสำเร็จ
        router.push({ name: 'home' }) 
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
      <RouterLink :to="{ name: 'login'}" class="absolute top-2 right-2 text-gray-500 hover:text-red-400">
        <span class="material-symbols-outlined">close</span>
      </RouterLink>
      <p class="text-base space-x-2 text-center">
        หากเป็นผู้จบการศึกษา คลิกที่ฟอร์มนี้ 
        <br>
        <RouterLink :to="{ name: 'experience-work'}" class="link link-info">ฟอร์มสำหรับผู้จบการศึกษา</RouterLink>
      </p>
      <div class="space-y-4 pt-4">
        <!-- ช่องกรอกข้อมูล -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base">ชื่อ-นามสกุล</span>
          </div>
          <input v-model="name" type="text" placeholder="" class="input input-bordered w-full" />
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base">วัน/เดือน/ปีเกิด</span>
          </div>
          <input v-model="birthDate" type="text" placeholder="" class="input input-bordered w-full" />
          <div class="label">
            <span class="label-text-alt">เช่น 12/12/2004</span>
          </div>
        </label>
        <select v-model="university" class="select select-bordered w-full text-base">
          <option disabled value="">เลือกมหาวิทยาลัย</option>
          <option v-for="university in universityStore.getUniversities" :key="university" :value="university">{{ university }}</option>
        </select>
        <label class="form-control w-full">
          <input v-model="address" type="text" placeholder="ที่อยู่" class="input input-bordered w-full" />
        </label>
        <!-- Dropdown จังหวัด -->
        <select v-model="province" class="select select-bordered w-full text-base">
          <option disabled value="">เลือกจังหวัด</option>
          <option v-for="province in provinceStore.getProvinces" :key="province" :value="province">{{ province }}</option>
        </select>
        <!-- ปุ่มบันทึก -->
        <button :disabled="!isFormValid" @click="saveData" class="btn btn-neutral w-full">บันทึก</button>
      </div>
    </div>
    <div v-if="eventStore.alert" >
      {{ eventStore.data.message }}
    </div>
  </div>
</template>
