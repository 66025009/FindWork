<script setup>
import { ref } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { addNews } from '@/stores/user/news';
import { useEventStore } from '@/stores/event'; 

// Form state
const category = ref('');
const title = ref('');
const content = ref('');

// Event store for popup messages
const eventStore = useEventStore();

// Submit handler
const submitNews = async () => {
  if (category.value && title.value && content.value) {
    try {
      await addNews(category.value, title.value, content.value);
      eventStore.popupMessage('success', 'ข้อมูลถูกส่งแล้ว');
      // Clear form fields after successful submission
      category.value = '';
      title.value = '';
      content.value = '';
    } catch (error) {
      console.error('Error adding news:', error);
      eventStore.popupMessage('error', 'เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  } else {
    eventStore.popupMessage('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
  }
};
</script>

<template>
  <AdminLayout>
    <div class="bg-indigo rounded-lg mt-10 p-8 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RouterLink :to="{ name:'admin-information'}" class="btn text-l">จัดการข้อมูลข่าวสาร</RouterLink>
        <RouterLink :to="{ name:'admin-notification'}" class="btn text-l">จัดการการแจ้งเตือน</RouterLink>
      </div>
      <div class="divider border-t border-white"></div>
      <h2 class="text-center text-xl text-white font-bold mb-6">การสร้างข้อมูลข่าวสาร</h2>
      <p class="text-center text-l text-white mb-6">ส่งข้อมูลข่าวสารไปยังระบบ</p>

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
            <option value="สิ่งที่น่าสนใจ">สิ่งที่น่าสนใจ</option>
            <option value="ความรู้">ความรู้</option>
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

        <!-- Content Input -->
        <div class="form-control w-full col-span-2">
          <label class="label">
            <span class="label-text text-white text-lg font-semibold">เนื้อหา</span>
          </label>
          <textarea v-model="content" class="textarea textarea-bordered w-full" placeholder="Content"></textarea>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-8">
        <button @click="submitNews" class="btn btn-primary w-full md:w-auto">ส่งข้อมูล</button>
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
