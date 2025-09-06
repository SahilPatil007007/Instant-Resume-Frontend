import axios from "axios";
import { handleApiError, showToast } from "../utils/toast.js";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchResumes = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/resume/getresume`, { withCredentials: true });
    // Backend returns { resumes: [{ _id, title, createdAt, updatedAt }] }
    return res.data.resumes;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchResumeById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/resume/byid/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createResumeApi = async (payload) => {
  try {
    const loadingToast = showToast.loading('Creating resume...');
    
    const res = await axios.post(`${API_URL}/api/resume/createresume`, payload, { withCredentials: true });
    
    showToast.dismiss(loadingToast);
    showToast.success('Resume created successfully!');
    return res.data.resume;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateResumeApi = async (id, updates) => {
  try {
    const res = await axios.put(`${API_URL}/api/resume/updateresume/${id}`, updates, { withCredentials: true });
    showToast.success('Resume updated successfully!');
    return res.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteResumeApi = async (id) => {
  try {
    const loadingToast = showToast.loading('Deleting resume...');
    
    await axios.delete(`${API_URL}/api/resume/deleteresume/${id}`, { withCredentials: true });
    
    showToast.dismiss(loadingToast);
    showToast.success('Resume deleted successfully!');
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}; 