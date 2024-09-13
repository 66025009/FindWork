<script setup>
import { ref } from 'vue'
import { createNotification } from '@/stores/user/news'
import { RouterLink } from 'vue-router'
import { useEventStore } from '@/stores/event'
import AdminLayout from '@/layouts/AdminLayout.vue'

const eventStore = useEventStore()

const category = ref('')
const title = ref('')
const content = ref('')

const submitNotification = async () => {
  if (!category.value || !title.value || !content.value) {
    eventStore.popupMessage('error', 'กรุณากรอกข้อมูลให้ครบถ้วน')
    return
  }

  try {
    await createNotification(category.value, title.value, content.value)
    // Clear form fields after successful submission
    category.value = ''
    title.value = ''
    content.value = ''
    eventStore.popupMessage('success', 'สร้างการแจ้งเตือนสำเร็จ')
  } catch (error) {
    console.error('Error creating notification:', error)
    eventStore.popupMessage('error', 'เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน')
  }
}
</script>

<template>
  <AdminLayout>
    <div class="bg-indigo rounded-lg mt-10 p-8 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RouterLink :to="{ name:'admin-information'}" class="btn text-l">จัดการข้อมูลข่าวสาร</RouterLink>
        <RouterLink :to="{ name:'admin-notification'}" class="btn text-l">จัดการการแจ้งเตือน</RouterLink>
      </div>
      <div class="divider border-t border-white"></div>
      <h2 class="text-center text-xl text-white font-bold mb-6">การสร้างการแจ้งเตือน</h2>
      <p class="text-center text-l text-white mb-6">ส่งการแจ้งเตือนไปยังเบราว์เซอร์ของแต่ละเครื่อง</p>

      <!-- Form Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Category Select -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-white text-lg font-semibold">หมวดหมู่</span>
          </div>
          <select v-model="category" class="select select-bordered w-full">
            <option disabled value="">โปรดเลือก</option>
            <option value="ทั่วไป">ทั่วไป</option>
            <option value="ระบบ">ระบบ</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </label>

        <!-- Title Input -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text text-white text-lg font-semibold">หัวเรื่อง</span>
          </label>
          <input v-model="title" type="text" placeholder="Title" class="input input-bordered w-full" />
        </div>

        <!-- Content Input: Span Full Width -->
        <div class="form-control w-full col-span-2">
          <label class="label">
            <span class="label-text text-white text-lg font-semibold">เนื้อหา</span>
          </label>
          <textarea v-model="content" class="textarea textarea-bordered w-full" placeholder="Content"></textarea>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-8">
        <button @click="submitNotification" class="btn btn-primary w-full md:w-auto">ส่งข้อมูล</button>
      </div>
    </div>

    <!-- Popup Message -->
    <div v-if="eventStore.alert" class="popup">
            {{ eventStore.data.message }}
    </div>
  </AdminLayout>
</template>

<style scoped>
.popup {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(7, 111, 167);
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>
