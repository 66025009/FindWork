<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import UserLayout from '@/layouts/UserLayout.vue';

const showMore = ref(false);

const toggleShowMore = () => {
  showMore.value = !showMore.value;
};
</script>

<template>
    <UserLayout>
        <section class="flex justify-center items-center mx-4 my-10">
            <div class="flex-col space-y-4 text-left mr-20">
                <p class="text-xl font-bold"> ยินดีต้อนรับสู่ชุมชน <br> มืออาชีพของคุณ </p>
                <button class="btn btn-wide btn-lg"> ลงชื่อเข้าใช้ด้วยอีเมล </button>
                <p class="text-l"> ไม่เคยเข้าร่วม FindWork ใช่หรือไม่ 
                    <RouterLink :to="{ name: 'register'}"><a class="link link-info"> เข้าร่วมเลย </a></RouterLink>
                </p>
            </div>
            <div>
                <img src="/work.png" alt="picture" class="w-auto h-auto ml-20">
            </div>
        </section>

        <section class="bg-lightgray">
            <div class="flex justify-center items-center px-4 py-20">
                <div class="text-left mr-24">
                    <p class="text-xl font-bold"> ค้นหากลุ่มชุมชนคอมมูนิตี้ <br> ที่ใช่สำหรับคุณ </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <button class="btn btn-outline"> Default </button>
                    <button class="btn btn-outline"> Default </button>
                    <button class="btn btn-outline"> Default </button>
                    <button class="btn btn-outline"> Default </button>
                    <button class="btn btn-outline"> Default </button>
                    <button class="btn btn-outline"> Default </button>
                    <button class="btn btn-outline"> Default </button>
                    <button class="btn btn-outline"> Default </button>
                    
                    <button 
                        v-if="!showMore"
                        class="btn btn-outline"
                        @click="toggleShowMore"
                    >
                        แสดงเพิ่มเติม
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                    >
                        Default
                    </button>
                    <button 
                        v-if="showMore"
                        class="btn btn-outline"
                        @click="toggleShowMore"
                    >
                        แสดงน้อยลง
                    </button>
                </div>
            </div>
        </section>

        <section class="flex justify-center items-center mx-4 my-10">
            <div class="flex-col space-y-4 text-left mr-20">
                <img src="/talk.png" alt="picture" class="w-auto h-auto ml-20">
                <p class="text-xl font-bold"> ทำความรู้จักกับบุคคล <br> ที่สามารถช่วยคุณได้ </p>
                <button class="btn btn-wide btn-lg"> ค้นหาบุคคลที่คุณรู้จัก </button>
            </div>
            <div class="flex-col space-y-4 text-left mr-20">
                <p class="text-xl font-bold"> FindWork มีไว้สำหรับ <br> บุคคลกลุ่มไหน </p>
                <p class="text-xxl"> คนที่กำลังมองหาเส้นทาง <br>ชีวิตการทำงานของพวกเขา </p>
                <button class="btn btn-outline btn-info "> ค้นหาเพื่อนร่วมงานหรือเพื่อนพูดคุย </button><br>
                <button class="btn btn-outline btn-info "> ค้นหาไอเดียใหม่ๆ </button>
            </div>
        </section>

    </UserLayout>
</template>
