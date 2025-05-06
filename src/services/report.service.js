import { db } from "../lib/firebase";
import { collection, addDoc, getDoc } from "firebase/firestore";

class ReportService {
  async createReport(homeId, reportData) {
    try {
      // Get reference to the reports subcollection
      const reportsRef = collection(db, "homes", homeId, "reports");

      // Add new document to the collection
      const docRef = await addDoc(reportsRef, {
        ...reportData,
        createdAt: new Date(),
      });

      // Get the created document
      const reportDoc = await getDoc(docRef);
      return {
        id: reportDoc.id,
        ...reportDoc.data(),
      };
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }
}

export default new ReportService();
