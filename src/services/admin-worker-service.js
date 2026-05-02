import { myAxios } from "./helper";

// GET all workers
export const getAllWorkers = async (city) => {
  const res = await myAxios.get(`/admin/workers/${city}`);
  return res.data;
};

// APPROVE worker
export const approveWorkerApi = async (email, city) => {
  return myAxios.put(
    `/admin/workers/${email}/${city}/approved`,
    { workerRequestStatus: "APPROVED" }
  );
};

// REJECT worker
export const rejectWorkerApi = async (email, city) => {
  return myAxios.put(
    `/admin/workers/${email}/${city}/rejected`,
    { workerRequestStatus: "REJECTED" }
  );
};

