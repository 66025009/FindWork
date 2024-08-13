<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
</script>

<template>
    <AdminLayout>
        <section class="flex">
            <div class="w-72 bg-[#DEE0E2] text-white min-h-screen p-4">
                <ul class="font-bold text-l pt-4 space-y-2">
                    <li><a href="#" class="block py-2 px-4 rounded text-indigo hover:bg-base-200">หน้าหลัก</a></li>
                    <li><a href="#" class="block py-2 px-4 rounded text-indigo hover:bg-base-200">ฟอร์ม</a></li>
                    <li><a href="#" class="block py-2 px-4 rounded text-indigo hover:bg-base-200">บุคคล</a></li>
                    <li><a href="#" class="block py-2 px-4 rounded text-indigo hover:bg-base-200">จัดการ</a></li>
                </ul>
            </div>

            <div class="flex flex-col w-full">
                <div class="hero flex-1 ">
                    <div class="hero-content flex-col lg:flex-row-reverse space-x-2">
                        <img src="/work.png" alt="picture" class="w-auto h-auto ml-20">
                        <div>
                            <h1 class="text-xl font-bold">ยินดีต้อนรับสู่ชุมชน <br>
                                FindWork </h1>
                            <p class="text-l">เรายินดีที่คุณได้เข้าร่วมเป็นส่วนหนึ่งของทีมเรา</p>
                        </div>
                    </div>
                </div>

                <div class="hero flex-1 ">
                    <div class="hero-content flex-col lg:flex-row-reverse space-x-2">
                        <img src="/work.png" alt="picture" class="w-auto h-auto ml-20">
                        <div>
                            <h1 class="text-xl font-bold">ยินดีต้อนรับสู่ชุมชน <br>
                                FindWork </h1>
                            <p class="text-l">เรายินดีที่คุณได้เข้าร่วมเป็นส่วนหนึ่งของทีมเรา</p>
                        </div>
                    </div>
                </div>
            </div>    
        </section>
    </AdminLayout>
</template>
