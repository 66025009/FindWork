<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAccountStore } from '@/stores/account'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db, storage } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import UserLayout from '@/layouts/UserLayout2.vue'
import { useEventStore } from '@/stores/event'

const accountStore = useAccountStore()
const eventStore = useEventStore()

const userForm = [
  { name: 'อีเมล', field: 'email' },
  { name: 'ชื่อ-สกุล', field: 'name' },
  { name: 'ชื่อบริษัท', field: 'companyName' },
  { name: 'มหาวิทยาลัย', field: 'university' },
]

const userData = reactive({
  backgroundImage: '/backgroundImage.jpg',
  profileImage: '/profileImage.jpg',
  email: '',
  name: '',
  companyName: '',
  university: ''
})

onMounted(async () => {
  try {
    await accountStore.initializeAuth();
    await accountStore.loadUserProfile(); // ตรวจสอบให้แน่ใจว่าฟังก์ชันนี้มีอยู่
    userData.backgroundImage = accountStore.profile.backgroundImage || '/defaultBackground.jpg';
    userData.profileImage = accountStore.profile.profileImage || '/defaultProfile.jpg';
    userData.email = accountStore.profile.email || '';
    userData.name = accountStore.profile.name || '';
    userData.companyName = accountStore.profile.companyName || '';
    userData.university = accountStore.profile.university || '';
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
})

const handleImageUpload = async (event, type) => {
  const file = event.target.files[0]

  if (file) {
    const fileRef = storageRef(
      storage,
      `user/${accountStore.user.uid}/${file.name}`
    )
    const snapshot = await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    if (type === 'background') {
      userData.backgroundImage = downloadURL
      accountStore.profile.backgroundImage = downloadURL
    } else if (type === 'profile') {
      userData.profileImage = downloadURL
      accountStore.profile.profileImage = downloadURL
    }

    localStorage.setItem('user-profile', JSON.stringify(userData))
  }
}


async function loadUserProfile(uid) {
  const userRef = doc(db, `user/${uid}`)
  const userSnap = await getDoc(userRef)
  
  if (userSnap.exists()) {
    return userSnap.data()
  } else {
    throw new Error('No such document!')
  }
}


const updateProfile = async () => {
  try {
    await accountStore.updateProfile(userData)
    localStorage.setItem('user-profile', JSON.stringify(userData))
    console.log('Profile updated and saved in localStorage:', JSON.stringify(userData)) // ตรวจสอบข้อมูล
    eventStore.popupMessage('success', 'บันทึกเสร็จสิ้น')
  } catch (error) {
    console.log('error', error)
  }
}

</script>

<template>
    <UserLayout>
      <div class="flex bg-lightgray min-h-screen justify-center space-x-4">
        <div class="flex w-1/2 h-full bg-white mt-4 rounded-2xl">
          <div class="w-full h-full rounded-2xl flex flex-col p-4">
            <!-- Background Image Section -->
            <div class="relative w-full rounded-2xl overflow-hidden">
              <img :src="userData.backgroundImage"  alt="Background" class="w-full h-44 object-cover opacity-80" />
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <label for="background-upload" class="cursor-pointer text-white text-3xl">
                  <span class="material-symbols-outlined">photo_camera</span>
                  <input type="file" id="background-upload" @change="(event) => handleImageUpload(event, 'background')" class="hidden" />
                </label>
              </div>
            </div>
            <!-- Profile Image Section -->
            <div class="relative flex justify-start -mt-16 ml-4">
              <div class="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                <img :src="userData.profileImage" alt="Avatar" class="w-full h-full object-cover" />
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <label for="profile-upload" class="cursor-pointer text-white text-3xl">
                    <span class="material-symbols-outlined">photo_camera</span>
                    <input type="file" id="profile-upload" @change="(event) => handleImageUpload(event, 'profile')" class="hidden" />
                  </label>
                </div>
              </div>
            </div>
  
            <!-- User Info Form -->
            <div v-for="item in userForm" :key="item.field" class="form-control w-full">
              <label class="label">
                <span class="label-text">{{ item.name }}</span>
                <span class="label-text-alt"></span>
              </label>
              <input
                :type="item.field === 'email' ? 'text' : 'text'"
                :readonly="item.field === 'email'"
                placeholder="Type here"
                class="input input-bordered w-full"
                v-model="userData[item.field]"
              />
            </div>
  
            <div class="flex justify-end mt-4">
              <button @click="updateProfile" class="btn btn-primary">บันทึก</button>
            </div>
          </div>
        </div>

        <div v-if="eventStore.alert" class="popup">
            {{ eventStore.data.message }}
        </div>
      </div>
    </UserLayout>
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