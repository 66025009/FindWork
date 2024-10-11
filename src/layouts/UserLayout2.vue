<script setup>
import { getAuth } from 'firebase/auth'
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { useUserStore } from '@/stores/user/user'


// สร้าง instance ของ userStore
const router = useRouter()
const accountStore = useAccountStore()
const userStore = useUserStore()
const auth = getAuth()

const activeTab = ref(1);

const tabs = [
    { id: 1, label: 'หน้าแรก', icon: 'home', route: '/home' },
    { id: 2, label: 'เครือข่าย', icon: 'groups', route: '/network' },
    { id: 3, label: 'การแจ้งเตือน', icon: 'notifications', route: '/notifications' }
];

// ดึงข้อมูลผู้ใช้
const userData = computed(() => {
    return {
        profileImage: userStore.currentUser?.profileImage || '/profileImage.jpg',
    }
})

const setActiveTab = (tabIndex) => {
    activeTab.value = tabIndex;
    localStorage.setItem('activeTab', tabIndex); 
};

const logout = async () => {
    try {
        await accountStore.logout()
        router.push({ name: 'more' });
    } catch (error) {
        console.error('Error during logout:', error)
    }
}

// เมื่อคอมโพเนนต์ถูกสร้าง, โหลดค่า activeTab จาก localStorage และข้อมูลผู้ใช้
onMounted(async () => {
    const savedTab = localStorage.getItem('activeTab');
    activeTab.value = savedTab ? parseInt(savedTab) : 1;

    try {
        const user = auth.currentUser
        if (user) {
            await userStore.loadUserByUid(user.uid)  // เรียกใช้ action ของ userStore
        } else {
            console.error('No user is logged in.')
        }
    } catch (error) {
        console.error('Error loading user data:', error)
    }
})
</script>

<template>
    <div class="navbar bg-indigo relative">
        <div class="flex-1 ml-6"> 
            <a href="/home">
                <img src="/logo.jpg" alt="Logo" class="h-70">
            </a>
        </div>

        <div class="h-[72px] w-10/12 bg-white absolute top-0 right-0 rounded-l-2xl flex items-center justify-center">
            <div class="absolute left-12">
                <label class="input input-bordered w-[500px] flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        class="h-4 w-4 opacity-70">
                        <path
                        fill-rule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clip-rule="evenodd" />
                    </svg>
                    <input type="text" class="grow" placeholder="Search" />
                </label>
            </div>
        </div>

        <!-- เมนูสำหรับหน้าจอขนาดใหญ่ -->
        <div class="hidden flex-none lg:block">
            <ul class="menu menu-horizontal">
                <template v-for="tab in tabs" :key="tab.id">
                    <li>
                        <RouterLink
                            :to="tab.route"
                            role="tab"
                            :class="['space-x-2', { 'active': activeTab === tab.id }]"
                            @click="setActiveTab(tab.id)"
                        >
                            <span class="material-symbols-outlined larger-icon">{{ tab.icon }}</span>
                            <span>{{ tab.label }}</span>
                        </RouterLink>
                    </li>
                </template>     
            </ul>
        </div>

        <!-- Dropdown เมนู -->
        <div class="dropdown dropdown-end px-10">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                    <img
                        alt="Avatar"
                        :src="userData.profileImage" />
                </div>
            </div>
            <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-5 w-52 p-2 drop-shadow-lg">
                <div tabindex="0" role="button" class="btn-circle avatar flex items-center w-full p-5 mt-2">
                    <div class="w-12 rounded-full">
                        <img
                            alt="Avatar"
                            :src="userData.profileImage" />
                    </div>
                    <div v-if="userStore.loaded && userStore.currentUser" class="text-center pt-10 text-black">
                        <h1 class="text-s font-bold">{{ userStore.currentUser.name }}</h1>
                    </div>
                </div>

                <li class="p-4">
                    <RouterLink :to="{ name: 'profile'}" class="btn btn-outline btn-primary">โปรไฟล์</RouterLink>
                </li>

                <ul class="font-bold border-t-2 pt-2 pl-2"><a>จัดการ</a>
                    <ul class="font-normal">
                        <RouterLink :to="{name: 'edit-profile'}"><li><a href="#"><span class="material-symbols-outlined">Encrypted</span><h2> ตั้งค่าหน้าโปรไฟล์ </h2></a></li></RouterLink>
                        <li><a href="#"><span class="material-symbols-outlined">Help</span><h2> ศูนย์ช่วยเหลือ </h2></a></li>
                        <li><a href="#"><span class="material-symbols-outlined">chat_info</span><h2> รายงานปัญหา </h2></a></li>
                    </ul>
                </ul>

                <li class="text-red-600 border-t-2 pt-2">
                    <a href="#" @click.prevent="logout">ออกจากระบบ</a>
                </li>
            </ul>
        </div>
    </div>

    <slot></slot>
    <div>
        <footer></footer>
    </div>
</template>
