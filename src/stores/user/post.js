import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp, 
  query, 
  where, 
  setDoc, 
  onSnapshot
} from 'firebase/firestore'
import { ref as storageRef, getDownloadURL, getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { useUserStore } from '@/stores/user/user';
import { defineComponent } from 'vue';

export default defineComponent({
  setup(props, { emit }) {
      const selectFriend = (friend) => {
          // ใช้ emit ในที่นี้
          emit('friend-selected', friend);
      };

      return {
          selectFriend,
      };
  },
});

export const usePostStore = defineStore('postStore', {
  state: () => ({
    posts: [], 
    currentPost: null,
    userProfiles: {},
    comments: new Map(),
    otherPosts: [],
    defaultProfileImage: '/profileImage.jpg', // กำหนดรูปเริ่มต้น
    defaultBackgroundImage: '/path/to/default-background.jpg', // กำหนดรูปพื้นหลังเริ่มต้น
    likes: new Map(), // เก็บข้อมูลไลค์ในรูปแบบของโพสต์ ID กับการไลค์ของผู้ใช้
  }),
  actions: {
    async createPost(postData) {
      try {
        const postsCollection = collection(db, 'posts')
        const auth = getAuth()
        const userId = auth.currentUser ? auth.currentUser.uid : null
        const userName = auth.currentUser ? auth.currentUser.displayName : 'Anonymous'

        const profileImage = postData.profileImage || this.defaultProfileImage
        const backgroundImage = postData.backgroundImage || this.defaultBackgroundImage

        const docRef = await addDoc(postsCollection, {
          profileImage: profileImage,
          backgroundImage: backgroundImage,
          name: userName || '',
          timestamp: Timestamp.now(),
          content: postData.content || '',
          imageUrl: postData.imageUrl || '',
          videoUrl: postData.videoUrl || '',
          userId: userId
        })
        console.log('Post created with ID:', docRef.id)
        await this.fetchPostsByCurrentUser()
      } catch (error) {
        console.error('Error creating post:', error)
      }
    },
    
    async updatePostField(postId, newImageUrl, newVideoUrl) {
      try {
        const postRef = doc(db, 'posts', postId)
        await updateDoc(postRef, {
          imageUrl: newImageUrl || '',
          videoUrl: newVideoUrl || ''
        })
        console.log('Post fields updated successfully')
        await this.fetchPostsByCurrentUser() // รีเฟรชโพสต์หลังจากอัปเดตโพสต์
      } catch (error) {
        console.error('Error updating post fields:', error)
      }
    },
    
    async updatePost(postId, postData) {
      try {
        const updatePostData = {
          content: postData.content || '',
          imageUrl: postData.imageUrl || '',
          videoUrl: postData.videoUrl || ''
        }
        const postRef = doc(db, 'posts', postId)
        await updateDoc(postRef, updatePostData)
        console.log('Post updated in Firestore:', updatePostData)
        await this.fetchPostsByCurrentUser() // รีเฟรชโพสต์หลังจากอัปเดตโพสต์
      } catch (error) {
        console.log('Error updating post:', error)
      }
    },

    async deletePost(postId) {
      try {
        const postRef = doc(db, 'posts', postId)
        await deleteDoc(postRef)
        console.log('Post deleted from Firestore')
        await this.fetchPostsByCurrentUser() // รีเฟรชโพสต์หลังจากลบโพสต์
      } catch (error) {
        console.log('Error deleting post:', error)
      }
    },
    
    async fetchPostsByCurrentUser() {
      try {
        const auth = getAuth()
        const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
    
        if (!currentUserId) {
          console.warn('User not logged in or userId is not available');
          return;
        }
    
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('uid', '==', currentUserId)); // ใช้ 'userId' แทน 'uid'
    
        const postsSnapshot = await getDocs(q);
    
        if (postsSnapshot.empty) {
          console.log('No posts found for the current user');
        }
    
        const postsList = postsSnapshot.docs.map(doc => {
          let data = doc.data();
    
          // ตรวจสอบและแปลงค่าของ postTime
          if (data.postTime) {
            if (data.postTime instanceof Timestamp) {
              data.postTime = data.postTime.toDate();
            } else if (data.postTime.seconds !== undefined && data.postTime.nanoseconds !== undefined) {
              data.postTime = new Date(data.postTime.seconds * 1000 + data.postTime.nanoseconds / 1000000);
            } else if (data.postTime instanceof Date) {
              data.postTime = new Date(data.postTime);
            } else if (typeof data.postTime === 'string') {
              data.postTime = new Date(data.postTime);
            } else {
              console.warn('postTime is of unknown type in post:', doc.id);
              data.postTime = new Date();
            }
          } else {
            console.warn('postTime missing in post:', doc.id);
            data.postTime = new Date();
          }
    
          data.id = doc.id;
          return data;
        });

        this.posts = postsList;
    
        // ดึงคอมเมนต์สำหรับโพสต์ทั้งหมด
        for (const post of postsList) {
          await this.fetchComments(post.id);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    
    async fetchPostsExcludingCurrentUser() {
      try {
        const auth = getAuth()
        const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
    
        if (!currentUserId) {
          console.warn('User not logged in or userId is not available');
          return;
        }
    
        // console.log('uid ของผู้ใช้:', currentUserId);
    
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('uid', '!=', currentUserId)); // ใช้ 'userId' แทน 'uid'
    
        const postsSnapshot = await getDocs(q);
    
        if (postsSnapshot.empty) {
          console.log('No posts found');
        }
    
        const postsList = postsSnapshot.docs.map(doc => {
          let data = doc.data();
    
          // ตรวจสอบและแปลงค่าของ postTime
          if (data.postTime) {
            if (data.postTime instanceof Timestamp) {
              data.postTime = data.postTime.toDate();
            } else if (data.postTime.seconds !== undefined && data.postTime.nanoseconds !== undefined) {
              data.postTime = new Date(data.postTime.seconds * 1000 + data.postTime.nanoseconds / 1000000);
            } else if (data.postTime instanceof Date) {
              data.postTime = new Date(data.postTime);
            } else if (typeof data.postTime === 'string') {
              data.postTime = new Date(data.postTime);
            } else {
              console.warn('postTime is of unknown type in post:', doc.id);
              data.postTime = new Date();
            }
          } else {
            console.warn('postTime missing in post:', doc.id);
            data.postTime = new Date();
          }
    
          data.id = doc.id;
          return data;
        });
    
        console.log('Posts loaded excluding current user:', postsList);
        this.otherPosts = postsList; // เก็บโพสต์ที่ไม่ใช่ของ user ปัจจุบัน

        // ดึงคอมเมนต์สำหรับโพสต์ทั้งหมด
        for (const post of postsList) {
          await this.fetchComments(post.id);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },

    async fetchComments(postId) {
      try {
        const commentsCollection = collection(db, 'posts', postId, 'comments');
        const commentsSnapshot = await getDocs(commentsCollection);
        const commentsList = commentsSnapshot.docs.map(doc => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });
        this.comments.set(postId, commentsList);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },

    async createComment(postId, commentData) {
      try {
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : 'Anonymous';

        // ดึงข้อมูลผู้ใช้จาก Firestore
        const userRef = doc(db, 'user', userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.exists() ? userSnapshot.data() : {};
        const userName = userData.name || 'Anonymous';
        const profileImage = userData.profileImage || '';

        const commentRef = doc(collection(db, 'posts', postId, 'comments'));
        await setDoc(commentRef, {
          content: commentData.content || '',
          createdAt: Timestamp.now(),
          profileImage: profileImage || '',
          name: userName || '',
          userId: userId || 'Anonymous'
        });
        console.log('Comment created successfully');
        await this.fetchComments(postId); // รีเฟรชคอมเมนต์หลังจากสร้างคอมเมนต์ใหม่
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    },

    async getPost(postId) {
      try {
        const postRef = doc(db, 'posts', postId);
        const postSnapshot = await getDoc(postRef);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          postData.id = postSnapshot.id;
          this.currentPost = postData;
          await this.fetchComments(postId); // ดึงคอมเมนต์สำหรับโพสต์นี้
          return postData;
        } else {
          console.log('Post does not exist');
          return null;
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        return null;
      }
    },

    async updateOldPostsField() {
      const userStore = useUserStore();
      
      console.log('User ID:', userStore.currentUser?.uid); // เปลี่ยนเป็น uid
      const userId = userStore.currentUser?.uid;
      if (typeof userId !== 'string') {
        console.error('Invalid or undefined user ID:', userId);
        return;
      }
    
      try {
        // ดึงข้อมูลผู้ใช้ปัจจุบันจาก collection 'user'
        const userDocRef = doc(db, 'user', userId);
        const userSnapshot = await getDoc(userDocRef);
    
        if (!userSnapshot.exists()) {
          console.error('User document not found');
          return;
        }
    
        const { name: newName, profileImage: newProfileImage } = userSnapshot.data();
        console.log({ newName, newProfileImage }); // ตรวจสอบค่าที่ดึงมา
    
        // ดึงโพสต์ทั้งหมดจาก collection 'posts'
        const postsCollectionRef = collection(db, 'posts');
        const postsSnapshot = await getDocs(postsCollectionRef);
    
        // อัปเดตโพสต์ที่เกี่ยวข้องและคอมเมนต์ที่เกี่ยวข้อง
        const updatePromises = postsSnapshot.docs.map(async (postDoc) => {
          const postData = postDoc.data();
          console.log({ postData, postId: postDoc.id }); // ตรวจสอบค่าของโพสต์
    
          // อัปเดตชื่อและรูปโปรไฟล์ในโพสต์
          if (postData.uid === userId) {
            // อัปเดตชื่อและรูปโปรไฟล์ในโพสต์
            const postRef = doc(db, 'posts', postDoc.id);
            if (postData.name !== newName || postData.profileImage !== newProfileImage) {
              await updateDoc(postRef, {
                name: newName,
                profileImage: newProfileImage,
                updatedAt: Timestamp.now(),
              });
              console.log(`Updated post ID: ${postDoc.id}`);
            }
          }
    
          // อัปเดตคอมเมนต์ที่เกี่ยวข้อง
          const commentsCollectionRef = collection(db, 'posts', postDoc.id, 'comments');
          const commentsSnapshot = await getDocs(commentsCollectionRef);
    
          const updateCommentPromises = commentsSnapshot.docs.map(async (commentDoc) => {
            const commentData = commentDoc.data();
    
            // ตรวจสอบว่า userId ของคอมเมนต์ตรงกับ userId ของผู้ใช้ที่ลงชื่อเข้าใช้งานอยู่หรือไม่
            if (commentData.userId === userId) {
              const commentRef = doc(db, 'posts', postDoc.id, 'comments', commentDoc.id);
              await updateDoc(commentRef, {
                name: newName,
                profileImage: newProfileImage,
              });
              console.log(`Updated comment ID: ${commentDoc.id}`);
            } else {
              console.log(`Skipping comment ID: ${commentDoc.id} due to mismatched userId`);
            }
          });
    
          await Promise.all(updateCommentPromises);
        });
    
        await Promise.all(updatePromises);
        console.log('All applicable posts and comments updated');
        await this.fetchPostsByCurrentUser(); // รีเฟรชโพสต์หลังจากอัปเดต
      } catch (error) {
        console.error('Error updating old posts and comments:', error);
      }
    },

    async addRepost(post, userId) {
      try {
        if (!post || typeof post.id !== 'string' || typeof userId !== 'string') {
          throw new Error('Invalid post or userId');
        }
    
        const repostRef = doc(db, 'reposts', userId, 'userReposts', post.id);
        await setDoc(repostRef, {
          postId: post.id,
          userId: userId,
          postContent: post.content || '',
          postImageUrl: post.imageUrl || '',
          postVideoUrl: post.videoUrl || '',
          postTime: post.postTime || Timestamp.now(),
          profileImage: post.profileImage || '',
          name: post.name || '',
          emoji: post.emoji || '',
        });
        console.log('Repost added successfully');
      } catch (error) {
        console.error('Error adding repost:', error);
      }
    },
    
    async removeRepost(postId, userId) {
      try {
        if (typeof postId !== 'string' || typeof userId !== 'string') {
          throw new Error('Invalid postId or userId');
        }
    
        const repostRef = doc(db, 'reposts', userId, 'userReposts', postId);
        await deleteDoc(repostRef);
        console.log('Repost removed successfully');
      } catch (error) {
        console.error('Error removing repost:', error);
      }
    },

    async likePost(postId) {
      try {
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;
    
        if (!userId) {
          console.warn('User not logged in or userId is not available');
          return;
        }
    
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);
    
        if (postDoc.exists()) {
          const postData = postDoc.data();
          const likes = postData.likes || {};
    
          // Toggle the user's like status
          if (likes[userId]) {
            // If the user has already liked the post, remove the like
            delete likes[userId];
          } else {
            // Otherwise, add the like
            likes[userId] = true;
          }
    
          // Update the post document with the new likes object
          await updateDoc(postRef, { 
            likes,
            likeCount: Object.keys(likes).length // Update the like count
          });
    
          // Fetch the updated number of likes
          await this.fetchLikes(postId);
        } else {
          console.warn('Post does not exist:', postId);
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    
    async fetchLikes(postId) {
      try {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);
    
        if (postDoc.exists()) {
          const postData = postDoc.data();
          const likeCount = postData.likeCount || 0;
    
          // Update the likes map in the state
          this.likes.set(postId, likeCount);
        } else {
          console.warn('Post does not exist:', postId);
          this.likes.set(postId, 0);
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    },
    
    async fetchRepostedPosts(userId, callback) {
      if (!userId) return;

      try {
        const repostsRef = collection(db, 'reposts', userId, 'userReposts')
        const q = query(repostsRef)

        // Set up a real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const reposts = []
          querySnapshot.forEach(doc => {
            reposts.push({ id: doc.id, ...doc.data() })
          })

          console.log('Real-time updated reposted posts:', reposts) // Check real-time results
          callback(reposts) // Update the local state
        })

        // Return the unsubscribe function to stop listening when the component is unmounted
        return unsubscribe
      } catch (error) {
        console.error('Error fetching reposted posts:', error)
      }
    },
  }
})
