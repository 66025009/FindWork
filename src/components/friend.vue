<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUserStore } from '@/stores/user/user'
import { watch } from 'vue';
import { defineComponent } from 'vue';
import { defineEmits } from 'vue';

// ดึงข้อมูลผู้ใช้จาก Firestore เมื่อคอมโพเนนต์ถูก mount
const userStore = useUserStore()
const users = ref([])  // รายชื่อผู้ใช้ทั้งหมด
const friends = ref([]) // รายชื่อเพื่อน
const userGroups = ref([]);  // รายชื่อกลุ่มที่ผู้ใช้เข้าร่วมแล้ว
const allGroups = ref([]);    // รายชื่อกลุ่มทั้งหมด
const isGroupMode = ref(false) // สถานะสำหรับโหมดกลุ่ม


const userData = computed(() => {
    return {
        profileImage: userStore.currentUser?.profileImage || '/profileImage.jpg',
    }
})

const emit = defineEmits(['select-friend']);
const props = defineProps(['chatId']);

// ฟังก์ชันโหลดข้อความ
const loadMessages = () => {
  if (props.chatId) {
    // โหลดข้อความที่เกี่ยวข้องกับ chatId
    console.log(`Loading messages for chat ID: ${props.chatId}`);
  }
};

// ใช้ watch เพื่อเรียกใช้งานเมื่อ chatId เปลี่ยน
watch(() => props.chatId, (newChatId) => {
  if (newChatId) {
    loadMessages();
  }
});


// ฟังก์ชันดึงข้อมูลผู้ใช้
const fetchUsers = async () => {
  try {
    const usersRef = collection(db, 'user')
    const snapshot = await getDocs(usersRef)
    users.value = snapshot.docs
      .map(doc => ({
        id: doc.id,
        name: doc.data().name,
        profileImage: doc.data().profileImage // เก็บข้อมูลรูปโปรไฟล์
      }))
      .filter(user => user.id !== userStore.currentUser.uid) // กรองผู้ใช้ที่ไม่ใช่ current user
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

// ฟังก์ชันดึงข้อมูลเพื่อน
const fetchFriends = async () => {
  const currentUserId = userStore.currentUser?.uid; 

  if (!currentUserId) {
    console.error("No user is logged in.");
    return;
  }
  
  try {
    const friendsRef = collection(db, `user/${currentUserId}/friends`);
    const snapshot = await getDocs(friendsRef);
    if (snapshot.empty) {
      console.log("No friends found.");
    } else {
      friends.value = snapshot.docs.map(doc => ({
        id: doc.id,
        friendId: doc.data().friendId,
        friendName: doc.data().friendName, 
        friendProfileImage: doc.data().friendProfileImage || '/profileImage.jpg', 
        timestamp: doc.data().timestamp.toDate().toLocaleString()
      }));
    }
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
}

const fetchUserGroups = async () => {
  const currentUserId = userStore.currentUser?.uid;

  if (!currentUserId) {
    console.error("No user is logged in.");
    return;
  }

  try {
    const groupsRef = collection(db, `user/${currentUserId}/groups`);
    const snapshot = await getDocs(groupsRef);
    if (snapshot.empty) {
      console.log("No groups found.");
    } else {
      // เก็บกลุ่มที่เข้าร่วมแล้วใน userGroups.value
      userGroups.value = snapshot.docs.map(doc => ({
        id: doc.id,
        groupId: doc.data().groupId,
        groupName: doc.data().groupName,
        groupProfileImage: doc.data().groupProfileImage || '/profileImage.jpg',
      }));
    }
  } catch (error) {
    console.error("Error fetching user groups:", error);
  }
};

const onSelectFriend = (friendId) => {
  // ตรวจสอบว่า friendId ถูกต้องหรือไม่
  console.log(`Selected friend ID: ${friendId}`);
  // อัปเดต currentChatId ใน parent
  currentChatId.value = findChatIdByFriendId(friendId);
  // หรือเรียกใช้งาน chat component ที่เกี่ยวข้อง
};


// ฟังก์ชันดึงข้อมูลกลุ่มทั้งหมด
const fetchAllGroups = async () => {
  try {
    const groupsRef = collection(db, 'groups'); 
    const snapshot = await getDocs(groupsRef);

    if (snapshot.empty) {
      console.log("No groups found.");
    } else {
      // เก็บกลุ่มทั้งหมดใน allGroups.value
      allGroups.value = snapshot.docs.map(doc => ({
        id: doc.id,
        groupName: doc.data().groupName,
        groupProfileImage: doc.data().groupProfileImage || '/profileImage.jpg'
      }));
    }
  } catch (error) {
    console.error("Error fetching all groups:", error);
  }
};

// ฟังก์ชันเพิ่มเพื่อน
const addFriend = async (friendId, friendName, friendProfileImage) => {
  const currentUserId = userStore.currentUser.uid;
  if (!currentUserId) {
    console.error("No user is logged in. Can't add friend.");
    return;
  }
  try {
    await addDoc(collection(db, `user/${currentUserId}/friends`), {
      friendId: friendId,                  
      friendName: friendName,              
      friendProfileImage: friendProfileImage, 
      timestamp: serverTimestamp(),         
    });
    await fetchFriends(); 
  } catch (error) {
    console.error('Error adding friend:', error);
  }
}

const addGroup = async (groupId, groupName, groupProfileImage) => {
  const currentUserId = userStore.currentUser.uid;
  if (!currentUserId) {
    console.error("No user is logged in. Can't join group.");
    return;
  }

  // ตรวจสอบว่าผู้ใช้ได้เข้าร่วมกลุ่มนี้แล้วหรือไม่
  const isAlreadyJoined = userGroups.value.some(group => group.groupId === groupId);
  if (isAlreadyJoined) {
    console.log("Already joined this group.");
    return; // ไม่เพิ่มกลุ่มถ้าเข้าร่วมแล้ว
  }

  try {
    await addDoc(collection(db, `user/${currentUserId}/groups`), {
      groupId: groupId,                  
      groupName: groupName,              
      groupProfileImage: groupProfileImage,
      timestamp: serverTimestamp(),         
    });
    await fetchUserGroups(); // เรียกใช้ฟังก์ชันเพื่ออัปเดตรายการกลุ่มที่ผู้ใช้เข้าร่วม
  } catch (error) {
    console.error('Error joining group:', error);
  }
}

const recommendedUsers = computed(() => {
  return users.value.filter(user => {
    return !friends.value.some(friend => friend.friendId === user.id);
  });
});



const recommendedGroups = computed(() => {
  const joinedGroupIds = new Set(userGroups.value.map(group => group.groupId));
  return allGroups.value.filter(group => !joinedGroupIds.has(group.id));
});

const toggleGroupMode = () => {
  isGroupMode.value = !isGroupMode.value;
}
const selectFriend = (friendId) => {
  emit('select-friend', friendId) // ส่ง event ไปยัง parent
}

onMounted(async () => {
  await userStore.loadUserByUid();
  await fetchUsers();
  await fetchFriends();
  await fetchAllGroups(); 
  await fetchUserGroups();
});
</script>

<template>
  <div class="w-1/4 bg-white p-4 border border-gray-800 rounded-lg flex flex-col h-full space-y-6">
    <h2 class="font-bold text-2xl">ข้อความ</h2>

    <div class="flex items-center space-x-4 mb-4">
      <div class="w-14 h-14 rounded-full overflow-hidden">
        <img :src="userData.profileImage" alt="Avatar" class="w-full h-full">
      </div>
      <button class="btn btn-neutral w-1/2 rounded-full" @click="toggleGroupMode">
        {{ isGroupMode ? 'เพื่อน' : 'กลุ่ม' }} 
      </button>
    </div>

    <div class="container mx-auto flex-grow">
      <h1 class="text-l font-bold mb-4">{{ isGroupMode ? 'แอดกลุ่ม' : 'แอดเพื่อน' }}</h1>
      
      <!-- รายชื่อเพื่อน -->
      <div class="bg-white p-4 rounded-lg shadow-md mt-6 max-h-52 overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">{{ isGroupMode ? 'กลุ่ม' : 'เพื่อน' }}</h2> 
        <ul>
          <li v-if="isGroupMode" v-for="group in userGroups" :key="group.id" class="flex items-center p-4 bg-indigo-800 rounded-lg shadow-md mb-2">
            <div class="flex items-center space-x-4">
              <img
                :src="group.groupProfileImage || '/profileImage.jpg'" 
                alt="Group's profile"
                class="w-12 h-12 rounded-full object-cover"
              />
              <p>{{ group.groupName || 'กลุ่ม' }}</p>
            </div>
          </li>
          <li v-else v-for="friend in friends" :key="friend.id" 
            @click="selectFriend(friend.friendId)" 
            class="flex items-center p-4 bg-indigo-800 rounded-lg shadow-md mb-2">
            <div class="flex items-center space-x-4">
              <img
                :src="friend.friendProfileImage || '/profileImage.jpg'" 
                alt="Friend's profile"
                class="w-12 h-12 rounded-full object-cover"
              />
              <p>{{ friend.friendName || 'ผู้ใช้งาน' }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="divider divider-neutral"></div>

      <div class="bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 class="text-lg font-semibold mb-4">{{ isGroupMode ? 'รายชื่อกลุ่มแนะนำ' : 'รายชื่อเพื่อนแนะนำ' }}</h2>
        <div class="max-h-52 overflow-y-auto"> <!-- เพิ่มส่วนนี้เพื่อทำให้เลื่อนในรายการแนะนำ -->
          <div v-if="isGroupMode" class="scrollable-list">
            <div v-for="group in recommendedGroups" :key="group.id" class="flex items-center justify-between p-4 bg-indigo-800 rounded-lg shadow-md mb-2">
              <div class="flex items-center space-x-4">
                <img
                  :src="group.groupProfileImage || '/profileImage.jpg'" 
                  alt="Group profile"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <p>{{ group.groupName || 'กลุ่ม' }}</p>
              </div>
              <button class="btn btn-ghost px-4 py-2 rounded-lg" 
                      @click="addGroup(group.id, group.groupName, group.groupProfileImage)">
                เข้าร่วมกลุ่ม
              </button>
            </div>
          </div>
          <div v-else >
            <div v-for="user in recommendedUsers" :key="user.id" class="flex items-center justify-between p-4 bg-indigo-800 rounded-lg shadow-md mb-2">
              <div class="flex items-center space-x-4">
                <img
                  :src="user.profileImage || '/profileImage.jpg'" 
                  alt="User's profile"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <p>{{ user.name || 'ผู้ใช้งาน' }}</p>
              </div>
              <button
                @click="addFriend(user.id, user.name, user.profileImage)"
                class="btn btn-ghost rounded-lg text-sm">
                เพิ่มเพื่อน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-base-300 rounded-box h-20 flex items-center p-2">
      <div class="flex w-full items-center justify-start space-x-4">
        <div class="w-14 h-14 rounded-full overflow-hidden">
          <img :src="userData.profileImage" alt="Avatar" class="w-full h-full">
        </div>

        <div v-if="userStore.loaded && userStore.currentUser" class="text-center text-black">
          <h1 class="text-s font-bold">{{ userStore.currentUser.name }}</h1>
        </div>
      </div>
    </div>
  </div>

</template>

<style>
.scrollable-list {
  max-height: 200px; /* กำหนดความสูงสูงสุด */
  overflow-y: auto;  /* ทำให้สามารถเลื่อนแนวตั้งได้ */
}
</style>
