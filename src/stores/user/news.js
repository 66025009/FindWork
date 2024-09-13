import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

export async function addNews(category, title, content) {
  try {
    const newsRef = collection(db, 'news');
    
    // Add a new document with category, title, content, and post time
    await addDoc(newsRef, {
      category,
      title,
      content,
      postTime: serverTimestamp() // Automatically set the server timestamp
    });

    console.log('News added successfully');
  } catch (error) {
    console.error('Error adding news:', error);
  }
}

export async function createNotification(category, title, content) {
  try {
    const notiRef = collection(db, 'noti');

    // Add a new document to the "noti" collection
    await addDoc(notiRef, {
      category,
      title,
      content,
      postTime: serverTimestamp(), // Automatically set the server timestamp
    });

    console.log('Notification successfully created!');
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
