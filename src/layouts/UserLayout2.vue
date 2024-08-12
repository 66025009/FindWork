<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const activeTab = ref(1);

const tabs = [
    { id: 1, label: 'หน้าแรก', icon: 'home', route: '/' },
    { id: 2, label: 'เครือข่าย', icon: 'groups', route: '/network' },
    { id: 3, label: 'การแจ้งเตือน', icon: 'notifications', route: '/notifications' }
];

const setActiveTab = (tabIndex) => {
    activeTab.value = tabIndex;
    localStorage.setItem('activeTab', tabIndex); 
};

const logout = () => {
    localStorage.removeItem('activeTab');
    activeTab.value = 1;
};

// เมื่อคอมโพเนนต์ถูกสร้าง, โหลดค่า activeTab จาก localStorage
onMounted(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        activeTab.value = parseInt(savedTab);
    } else {
        activeTab.value = 1; // รีเซ็ตเป็นหน้าแรกหากไม่มีค่าใน localStorage
    }
});
</script>

<template>
    <div class="navbar bg-indigo relative">
        <div class="flex-1 ml-6"> 
            <a href="/">
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
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </div>
            <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-5 w-52 p-2 drop-shadow-lg">
                <div tabindex="0" role="button" class="btn-circle avatar flex items-center w-full p-5 mt-2">
                    <div class="w-12 rounded-full">
                        <img
                            alt="Tailwind CSS Navbar component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                    <span class="ml-4">ชื่อ-นามสกุล</span>
                </div>

                <li class="p-4">
                <a class="btn btn-outline btn-primary">โปรไฟล์</a>
                </li>

                <ul class="font-bold border-t-2 pt-2 pl-2"><a>จัดการ</a>
                    <ul class="font-normal">
                        <li><a href="#"><span class="material-symbols-outlined">Encrypted</span><h2> การตั้งค่ารหัสผ่าน </h2></a></li>
                        <li><a href="#"><span class="material-symbols-outlined">Help</span><h2> ศูนย์ช่วยเหลือ </h2></a></li>
                        <li><a href="#"><span class="material-symbols-outlined">chat_info</span><h2> รายงานปัญหา </h2></a></li>
                    </ul>
                </ul>

                <li class="text-red-600 border-t-2 pt-2">
                    <RouterLink :to="{ name: 'more' }" @click="logout">
                        <a>ออกจากระบบ</a>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>

    <slot></slot>
    <div>
        <footer></footer>
    </div>
</template>
