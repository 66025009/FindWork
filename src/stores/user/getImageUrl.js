import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const storage = getStorage();

export const getImageUrl = async (uid, type) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // ดึงข้อมูลผู้ใช้จาก Firestore
    const userRef = doc(db, 'user', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User document does not exist');
    }

    const userData = userDoc.data();
    let imagePath;

    // เลือกพาธของไฟล์ตามประเภทที่กำหนด (เช่น backgroundImage หรือ profileImage)
    if (type === 'background') {
      imagePath = userData.backgroundImage;
    } else if (type === 'profile') {
      imagePath = userData.profileImage;
    } else {
      throw new Error('Invalid type specified');
    }

    // ตรวจสอบว่าพาธของไฟล์มีค่า
    if (!imagePath) {
      throw new Error('Image path not found');
    }

    // สร้าง reference ของรูปภาพจากพาธที่ได้
    const imageRef = storageRef(storage, imagePath);
    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error fetching image URL for type', type, ':', error);
    throw error;
  }
};
