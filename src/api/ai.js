import axios from "axios";
import { handleApiError, showToast } from "../utils/toast.js";

const API_URL = import.meta.env.VITE_API_URL;

export const improveWithAI = async (section, context) => {
  try {
    const loadingToast = showToast.loading('AI is improving your content...');
    
    const res = await axios.post(`${API_URL}/api/ai/improve`, 
      { section, context }, 
      { withCredentials: true }
    );
    
    showToast.dismiss(loadingToast);
    showToast.success('Content improved successfully!');
    return res.data.improveWithAi;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
