import { db } from "../lib/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";

class HomeService {
  // returns an id for an empty home doc
  async getHomeId() {
    const homesRef = collection(db, "homes");
    const newHomeRef = doc(homesRef);
    return newHomeRef.id;
  }

  async setHome(homeId, homeData) {
    try {
      const homeRef = doc(db, "homes", homeId);

      const data = {
        ...homeData,
        createdAt: new Date(),
      };
      await setDoc(homeRef, data);

      return {
        ...data,
        id: homeId,
      };
    } catch (error) {
      console.error("Error creating home:", error);
      throw error;
    }
  }

  async createHome(homeData) {
    try {
      const homesRef = collection(db, "homes");
      const docRef = await addDoc(homesRef, {
        ...homeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const homeDoc = await getDoc(docRef);
      return {
        id: homeDoc.id,
        ...homeDoc.data(),
      };
    } catch (error) {
      console.error("Error creating home:", error);
      throw error;
    }
  }

  async updateHome(homeId, updateData) {
    try {
      const homeRef = doc(db, "homes", homeId);
      await updateDoc(homeRef, {
        ...updateData,
        updatedAt: new Date(),
      });

      const homeDoc = await getDoc(homeRef);
      return {
        id: homeDoc.id,
        ...homeDoc.data(),
      };
    } catch (error) {
      console.error("Error updating home:", error);
      throw error;
    }
  }

  async getHome(homeId) {
    try {
      const homeRef = doc(db, "homes", homeId);
      const homeDoc = await getDoc(homeRef);

      if (!homeDoc.exists()) {
        throw new Error("Home not found");
      }

      return {
        id: homeDoc.id,
        ...homeDoc.data(),
      };
    } catch (error) {
      console.error("Error getting home:", error);
      throw error;
    }
  }

  async getUserHomes(userId) {
    try {
      const homesRef = collection(db, "homes");
      const q = query(homesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting user homes:", error);
      throw error;
    }
  }

  async setPrimaryHome(homeId, userId) {
    try {
      // First, remove primary status from all user's homes
      const userHomes = await this.getUserHomes(userId);
      const updatePromises = userHomes.map((home) =>
        this.updateHome(home.id, { isPrimary: false })
      );
      await Promise.all(updatePromises);

      // Set the selected home as primary
      return await this.updateHome(homeId, { isPrimary: true });
    } catch (error) {
      console.error("Error setting primary home:", error);
      throw error;
    }
  }
}

export default new HomeService();
