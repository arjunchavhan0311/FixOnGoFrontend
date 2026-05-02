import { myAxios } from "./helper";

/* -------------------- ADD FEEDBACK -------------------- */
export const addFeedback = async (feedbackData) => {
  try {
    const response = await myAxios.post("/feedback/add", feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw error;
  }
};

/* -------------------- GET FEEDBACK BY CUSTOMER -------------------- */
export const getFeedbackByCustomer = async (customerId) => {
  try {
    const response = await myAxios.get(`/feedback/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer feedback:", error);
    throw error;
  }
};

/* -------------------- GET FEEDBACK BY WORKER -------------------- */
export const getFeedbackByWorker = async (workerId) => {
  try {
    const response = await myAxios.get(`/feedback/worker/${workerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching worker feedback:", error);
    throw error;
  }
};

/* -------------------- GET ALL FEEDBACK -------------------- */
export const getAllFeedback = async () => {
  try {
    const response = await myAxios.get("/feedback/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

/* -------------------- GET SERVICE AVERAGE RATING -------------------- */
export const getServiceRating = async (serviceId) => {
  try {
    const response = await myAxios.get(`/feedback/service-rating/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service rating:", error);
    throw error;
  }
};

/* -------------------- GET WORKER AVERAGE RATING -------------------- */
export const getWorkerRating = async (workerId) => {
  try {
    const response = await myAxios.get(`/feedback/worker-rating/${workerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching worker rating:", error);
    return 0;
  }
};