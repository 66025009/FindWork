<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useUserStore } from '@/stores/user/user';

// Initialize state
const userStore = useUserStore();
const users = ref([]);  // List of all users
const friends = ref([]); // List of friends
const userGroups = ref([]);  // List of groups the user is in
const allGroups = ref([]);    // List of all groups
const isGroupMode = ref(false); // Status for group mode
const currentChatId = ref(null); // Variable to manage chat ID

const userData = computed(() => ({
    profileImage: userStore.currentUser?.profileImage || '/profileImage.jpg',
}));

const emit = defineEmits(['select-friend']);
const props = defineProps(['chatId']);

// Function to load messages
const loadMessages = async (chatId) => {
    if (chatId) {
        console.log(`Loading messages for chat ID: ${chatId}`);
        // Add your message fetching logic here
    }
};

// Watch for changes in chatId
watch(() => props.chatId, (newChatId) => {
    if (newChatId) {
        loadMessages(newChatId);
    }
});

// Fetch all users from Firestore
const fetchUsers = async () => {
    try {
        const usersRef = collection(db, 'user');
        const snapshot = await getDocs(usersRef);
        users.value = snapshot.docs
            .map(doc => ({
                id: doc.id,
                name: doc.data().name,
                profileImage: doc.data().profileImage,
            }))
            .filter(user => user.id !== userStore.currentUser.uid); // Exclude current user
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

// Fetch friends from Firestore
const fetchFriends = async () => {
    const currentUserId = userStore.currentUser?.uid;

    if (!currentUserId) {
        console.error("No user is logged in.");
        return;
    }

    try {
        const friendsRef = collection(db, `user/${currentUserId}/friends`);
        const snapshot = await getDocs(friendsRef);
        friends.value = snapshot.empty ? [] : snapshot.docs.map(doc => ({
            id: doc.id,
            friendId: doc.data().friendId,
            friendName: doc.data().friendName,
            friendProfileImage: doc.data().friendProfileImage || '/profileImage.jpg',
            timestamp: doc.data().timestamp.toDate().toLocaleString(),
        }));
    } catch (error) {
        console.error("Error fetching friends:", error);
    }
};

// Fetch user groups from Firestore
const fetchUserGroups = async () => {
    const currentUserId = userStore.currentUser?.uid;

    if (!currentUserId) {
        console.error("No user is logged in.");
        return;
    }

    try {
        const groupsRef = collection(db, `user/${currentUserId}/groups`);
        const snapshot = await getDocs(groupsRef);
        userGroups.value = snapshot.empty ? [] : snapshot.docs.map(doc => ({
            id: doc.id,
            groupId: doc.data().groupId,
            groupName: doc.data().groupName,
            groupProfileImage: doc.data().groupProfileImage || '/profileImage.jpg',
        }));
    } catch (error) {
        console.error("Error fetching user groups:", error);
    }
};

// Emit event when a friend is selected
const onSelectFriend = (friendId) => {
    console.log(`Selected friend ID: ${friendId}`);
    currentChatId.value = friendId; // Set currentChatId to selected friend's ID
    emit('select-friend', friendId); // Emit event to parent to handle chat change
};

// Fetch all groups from Firestore
const fetchAllGroups = async () => {
    try {
        const groupsRef = collection(db, 'groups');
        const snapshot = await getDocs(groupsRef);
        allGroups.value = snapshot.empty ? [] : snapshot.docs.map(doc => ({
            id: doc.id,
            groupName: doc.data().groupName,
            groupProfileImage: doc.data().groupProfileImage || '/profileImage.jpg',
        }));
    } catch (error) {
        console.error("Error fetching all groups:", error);
    }
};

// Add friend to Firestore
const addFriend = async (friendId, friendName, friendProfileImage) => {
    const currentUserId = userStore.currentUser.uid;
    if (!currentUserId) {
        console.error("No user is logged in. Can't add friend.");
        return;
    }
    try {
        await addDoc(collection(db, `user/${currentUserId}/friends`), {
            friendId,
            friendName,
            friendProfileImage,
            timestamp: serverTimestamp(),
        });
        await fetchFriends();
    } catch (error) {
        console.error('Error adding friend:', error);
    }
};

// Add group to Firestore
const addGroup = async (groupId, groupName, groupProfileImage) => {
    const currentUserId = userStore.currentUser.uid;
    if (!currentUserId) {
        console.error("No user is logged in. Can't join group.");
        return;
    }

    const isAlreadyJoined = userGroups.value.some(group => group.groupId === groupId);
    if (isAlreadyJoined) {
        console.log("Already joined this group.");
        return;
    }

    try {
        await addDoc(collection(db, `user/${currentUserId}/groups`), {
            groupId,
            groupName,
            groupProfileImage,
            timestamp: serverTimestamp(),
        });
        await fetchUserGroups();
    } catch (error) {
        console.error('Error joining group:', error);
    }
};

// Recommend users and groups
const recommendedUsers = computed(() => {
    return users.value.filter(user => !friends.value.some(friend => friend.friendId === user.id));
});

const recommendedGroups = computed(() => {
    const joinedGroupIds = new Set(userGroups.value.map(group => group.groupId));
    return allGroups.value.filter(group => !joinedGroupIds.has(group.id));
});

// Toggle group mode
const toggleGroupMode = () => {
    isGroupMode.value = !isGroupMode.value;
};

// Fetch data on component mount
onMounted(async () => {
    await userStore.loadUserByUid();
    await fetchUsers();
    await fetchFriends();
    await fetchAllGroups();
    await fetchUserGroups();
});

// Select friend and create a chat
const selectFriend = async (friendId) => {
    const friend = friends.value.find(friend => friend.friendId === friendId);
    if (!friend) {
        console.error("Friend not found.");
        return;
    }

    // Save chat data
    const chatData = {
        friendId: friend.friendId,
        friendName: friend.friendName,
        friendProfileImage: friend.friendProfileImage,
    };

    try {
        const currentUserId = userStore.currentUser.uid;
        await addDoc(collection(db, `user/${currentUserId}/chat`), chatData);
        console.log("Chat data added successfully.");
    } catch (error) {
        console.error("Error adding chat data:", error);
    }
};
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
            <div class="bg-white p-4 rounded-lg shadow-md mt-6 max-h-52 overflow-y-auto">
                <h2 class="text-lg font-semibold mb-4">{{ isGroupMode ? 'กลุ่ม' : 'เพื่อน' }}</h2>

                <ul class="space-y-4">
                    <li v-if="isGroupMode" v-for="group in userGroups" :key="group.id" class="flex items-center p-2 hover:bg-gray-200 rounded">
                        <div class="w-14 h-14 rounded-full overflow-hidden">
                            <img :src="group.groupProfileImage" alt="Avatar" class="w-full h-full">
                        </div>
                        <span class="ml-4">{{ group.groupName }}</span>
                        <button @click="selectFriend(group.groupId)" class="ml-auto btn btn-ghost">แชท</button>
                    </li>
                    <li v-else v-for="friend in friends" :key="friend.id" class="flex items-center p-2 hover:bg-gray-200 rounded">
                        <div class="w-14 h-14 rounded-full overflow-hidden">
                            <img :src="friend.friendProfileImage" alt="Avatar" class="w-full h-full">
                        </div>
                        <span class="ml-4">{{ friend.friendName }}</span>
                        <button @click="selectFriend(friend.friendId)" class="ml-auto btn btn-ghost">แชท</button>
                    </li>
                </ul>
            </div>
            <div class="divider divider-neutral"></div>

            <div class="bg-white p-4 rounded-lg shadow-md mt-6">
                <h2 class="text-lg font-semibold mb-4">{{ isGroupMode ? 'รายชื่อกลุ่มแนะนำ' : 'รายชื่อเพื่อนแนะนำ' }}</h2>
                <div class="max-h-52 overflow-y-auto">
                    <div v-if="isGroupMode" class="scrollable-list">
                        <div v-if="recommendedGroups.length === 0" class="text-center">No recommended groups</div>
                        <div v-else v-for="group in recommendedGroups" :key="group.id" class="flex items-center justify-between p-4 bg-indigo-800 rounded-lg shadow-md mb-2">
                            <div class="flex items-center space-x-4">
                                <img :src="group.groupProfileImage || '/profileImage.jpg'" alt="Group profile" class="w-12 h-12 rounded-full object-cover" />
                                <p>{{ group.groupName || 'กลุ่ม' }}</p>
                            </div>
                            <button class="btn btn-ghost px-4 py-2 rounded-lg" @click="addGroup(group.id, group.groupName, group.groupProfileImage)">
                                เข้าร่วมกลุ่ม
                            </button>
                        </div>
                    </div>
                    <div v-else class="scrollable-list">
                        <div v-if="recommendedUsers.length === 0" class="text-center">No recommended users</div>
                        <div v-else v-for="user in recommendedUsers" :key="user.id" class="flex items-center justify-between p-4 bg-indigo-800 rounded-lg shadow-md mb-2">
                            <div class="flex items-center space-x-4">
                                <img :src="user.profileImage || '/profileImage.jpg'" alt="User's profile" class="w-12 h-12 rounded-full object-cover" />
                                <p>{{ user.name || 'ผู้ใช้งาน' }}</p>
                            </div>
                            <button @click="addFriend(user.id, user.name, user.profileImage)" class="btn btn-ghost rounded-lg text-sm">
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
    max-height: 200px; /* Limit the height */
    overflow-y: auto;  /* Enable vertical scrolling */
}
</style>
