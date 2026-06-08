import api from "./axios";

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  me: () => api.get("/api/auth/me"),
};

// ─── User ─────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get("/api/user/profile"),
  updateProfile: (data) => api.put("/api/user/profile", data),
  uploadResume: (formData) =>
    api.post("/api/user/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAccount: () => api.delete("/api/user/account"),
};

// ─── Jobs ──────────────────────────────────────────────
export const jobAPI = {
  create: (data) => api.post("/api/jobs", data),
  getAll: (params) => api.get("/api/jobs", { params }),
  getById: (id) => api.get(`/api/jobs/${id}`),
  update: (id, data) => api.put(`/api/jobs/${id}`, data),
  delete: (id) => api.delete(`/api/jobs/${id}`),
};

// ─── Applications ─────────────────────────────────────
export const applicationAPI = {
  apply: (jobId, data) => api.post(`/api/applications/${jobId}`, data),
  myApplications: () => api.get("/api/applications/my"),
  jobApplicants: (jobId) => api.get(`/api/applications/job/${jobId}`),
  updateStatus: (id, status) =>
    api.patch(`/api/applications/${id}/status`, { status }),
  withdraw: (id) => api.delete(`/api/applications/${id}`),
};

// ─── Saved Jobs ────────────────────────────────────────
export const savedJobAPI = {
  save: (jobId) => api.post(`/api/saved-jobs/${jobId}`),
  getSaved: () => api.get("/api/saved-jobs"),
  remove: (jobId) => api.delete(`/api/saved-jobs/${jobId}`),
};

// ─── Dashboard ─────────────────────────────────────────
export const dashboardAPI = {
  recruiterStats: () => api.get("/api/dashboard/recruiter/stats"),
  recruiterRecentApplications: (limit) =>
    api.get("/api/dashboard/recruiter/recent-applications", { params: { limit } }),
  userStats: () => api.get("/api/dashboard/user/stats"),
  userSavedJobs: () => api.get("/api/dashboard/user/saved-jobs"),
};