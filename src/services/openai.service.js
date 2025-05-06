// src/services/openai.service.js
class OpenAIService {
  async analyzeUtilityBill(homeId, utilityBillFullpath) {
    console.log(
      "analyzeUtilityBill: homeId, utilityBillFullpath",
      homeId,
      utilityBillFullpath
    );
    // const url =
    //   "http://127.0.0.1:5001/home-energy-report-ba33d/us-central1/analyzeUtilityBills";
    const url =
      "https://us-central1-home-energy-report-ba33d.cloudfunctions.net/analyzeUtilityBills";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: utilityBillFullpath, homeId: homeId }),
      });

      if (!response.ok) {
        console.log("response", response);
        const message = `Firebase Function failed with status: ${response.status} ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error analyzing utility bill:", error);
      throw error;
    }
  }
}

export default new OpenAIService();
