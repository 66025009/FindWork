<script setup>
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useEventStore } from '@/stores/event'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const accountStore = useAccountStore()
const eventStore = useEventStore()

const email = ref('')
const password = ref('')
const name = ref('')
const job = ref('')
const profileImage = ref(null)
const profileImagePreview = ref('')

// ฟังก์ชันจัดการการเลือกไฟล์
const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        profileImage.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
            profileImagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}
const createAdmin = async () => {
    try {
        if (!email.value || !password.value || !name.value || !job.value) {
            throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน')
        }

        let profileImageUrl = ''
        if (profileImage.value) {
            const storage = getStorage()
            const imageRef = storageRef(storage, `profiles/${Date.now()}_${profileImage.value.name}`)
            await uploadBytes(imageRef, profileImage.value)
            profileImageUrl = await getDownloadURL(imageRef)
        }

        await accountStore.createAdminAccount(email.value, password.value, name.value, job.value, profileImageUrl)
        eventStore.popupMessage('success', 'สร้างบัญชีแอดมินสำเร็จ')
    } catch (error) {
        console.error('Error creating admin account:', error)
        eventStore.popupMessage('error', `ไม่สามารถสร้างบัญชีแอดมินได้: ${error.message}`)
    }
}

</script>

<template>
    <AdminLayout>
        <div class="flex flex-col w-full bg-slate-50 rounded-lg shadow-lg p-8 my-10">
            <h1 class="text-2xl font-semibold mb-6 text-gray-700">ฟอร์มสำหรับบุคลากร</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-medium text-gray-600">อีเมล</span>
                        </div>
                        <input v-model="email" type="email" placeholder="Email" class="input input-bordered w-full" />
                    </label>
                </div>

                <div>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-medium text-gray-600">รหัสผ่าน</span>
                        </div>
                        <input v-model="password" type="password" placeholder="Password" class="input input-bordered w-full" />
                    </label>
                </div>

                <div>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-medium text-gray-600">ชื่อ</span>
                        </div>
                        <input v-model="name" type="text" placeholder="Name" class="input input-bordered w-full" />
                    </label>
                </div>

                <div>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text font-medium text-gray-600">ตำแหน่ง</span>
                        </div>
                        <input v-model="job" type="text" placeholder="Job" class="input input-bordered w-full" />
                    </label>
                </div>
            </div>

            <div>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text font-medium text-gray-600">รูปโปรไฟล์</span>
                    </div>
                    <input type="file" @change="handleFileChange" class="file-input w-full max-w-xs" />
                </label>
                <!-- แสดงตัวอย่างรูปโปรไฟล์ -->
                <div v-if="profileImagePreview" class="mt-4">
                    <img :src="profileImagePreview" alt="Profile Preview" class="w-32 h-32 object-cover rounded-full border border-gray-300"/>
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <button @click="createAdmin" class="btn btn-primary px-6 py-2">บันทึก</button>
            </div>
        </div>
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
  background: rgb(7, 167, 7);
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>
