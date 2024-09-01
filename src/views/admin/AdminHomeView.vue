<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { onMounted, ref } from 'vue';

const pageData = [
  {
    image: '/join.jpg',
    title: 'มาร่วมเป็นส่วนหนึ่งของการ<br>สร้างสิ่งที่ดีให้ FindWork',
  },
  {
    image: '/commu.png',
    title: 'มาร่วมสร้างสรรค์ความ<br>สำเร็จไปด้วยกัน',
    titles: 'ทุกคนคือกุญแจสำคัญในการสร้างอนาคตของเรา'
  },
];

const currentIndex = ref(0);

onMounted(() => {
  const carousel = document.querySelector('.carousel-wrapper');
  const totalItems = pageData.length;

  function showNextSlide() {
    currentIndex.value = (currentIndex.value + 1) % totalItems;
    const offset = -currentIndex.value * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  }

  setInterval(showNextSlide, 6000); 
});

const userChart = {
    options: {
        chart: {
            id: "vuechart-example",
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
    },
    series: [
        {
            name: 'series-1',
            data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
    ]
}

const statusChart = {
      options: {},
      series: [44, 55, 41, 17, 15]
    }

</script>

<template>
    <AdminLayout>
        <section class="flex ">
            <div class="flex flex-col w-full">
                <div class="hero flex-1">
                    <div class="hero-content flex-col lg:flex-row-reverse space-x-2">
                        <img src="/work.png" alt="picture" class="w-auto h-auto ml-20">
                        <div>
                            <h1 class="text-xl font-bold">ยินดีต้อนรับสู่ชุมชน <br> FindWork </h1>
                            <p class="text-l">เรายินดีที่คุณได้เข้าร่วมเป็นส่วนหนึ่งของทีมเรา</p>
                        </div>
                    </div>
                </div>

                <div class="carousel rounded-box w-full overflow-hidden relative">
                    <div class="carousel-wrapper flex transition-transform duration-700 ease-in-out">
                        <div v-for="(page, index) in pageData" :key="index" class="carousel-item w-full flex-shrink-0">
                            <div class="hero flex-1">
                                <div class="hero-content flex-col lg:flex-row-reverse space-x-2">
                                    <img :src="page.image" alt="picture" class="w-auto h-auto ml-20">
                                    <div>
                                        <h1 class="text-xxl font-bold" v-html="page.title"></h1>
                                        <p class="text-l" v-html="page.titles"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-xl font-bold my-4">Dashboard</div>
                <div class="stats shadow w-3/4 mb-10 text-l mx-auto">
                    <div class="stat">
                        <div class="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        </div>
                        <div class="stat-title">ผู้เข้าใช้</div>
                        <div class="stat-value">31K</div>
                    </div>

                    <div class="stat">
                        <div class="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                        </svg>
                        </div>
                        <div class="stat-title">ผู้ใช้ใหม่</div>
                        <div class="stat-value">4,200</div>
                    </div>

                    <div class="stat">
                        <div class="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                        </svg>
                        </div>
                        <div class="stat-title">ผู้สมัครใหม่</div>
                        <div class="stat-value">1,200</div>
                    </div>
                </div>
                
                <div class="flex">
                    <div class="flex-1">
                        <apexchart type="bar" :options="userChart.options" :series="userChart.series"></apexchart>
                    </div>
                    <div class="flex-1">
                        <apexchart type="donut" :options="statusChart.options" :series="statusChart.series"></apexchart>
                    </div>
                </div>
            </div>    
        </section>
    </AdminLayout>
</template>

<style scoped>
.carousel {
    position: relative;
    overflow: hidden;
}

.carousel-wrapper {
    display: flex;
    transition: transform 0.7s ease-in-out; 
}

.carousel-item {
    min-width: 100%;
}

.carousel-item img {
    object-fit: cover;
}
</style>
