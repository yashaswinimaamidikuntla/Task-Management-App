import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  category: string;
  userId: string;
}

const toastOptions = {
  style: { backgroundColor: "black", color: "white" }
};

export const addTask = async (task: Omit<Task, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), task);
    toast.success('Task added successfully!', toastOptions);
    return docRef;
  } catch (error) {
    toast.error('Failed to add task!', toastOptions);
    throw error;
  }
};

export const updateTask = async (id: string, updatedTask: Partial<Task>) => {
  try {
    const taskDoc = doc(db, "tasks", id);
    await updateDoc(taskDoc, updatedTask);
    toast.info('Task updated successfully!', toastOptions);
  } catch (error) {
    toast.error('Failed to update task!', toastOptions);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
    toast.error('Task deleted successfully!', toastOptions);
  } catch (error) {
    toast.error('Failed to delete task!', toastOptions);
    throw error;
  }
};

export const fetchTasks = async (userId: string): Promise<Task[]> => {
  try {
    const q = query(collection(db, "tasks"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  } catch (error) {
    toast.error('Failed to fetch tasks!', toastOptions);
    throw error;
  }
};