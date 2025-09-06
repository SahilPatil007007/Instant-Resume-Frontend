import toast from 'react-hot-toast';

// Toast utility functions for consistent error handling
export const showToast = {
  success: (message) => {
    toast.success(message, {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#10B981',
        color: '#fff',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      icon: '❌',
      style: {
        borderRadius: '10px',
        background: '#EF4444',
        color: '#fff',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      style: {
        borderRadius: '10px',
        background: '#3B82F6',
        color: '#fff',
      },
    });
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!',
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  }
};

// Error handler for API responses
export const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        errorMessage = data.message || 'Invalid request';
        break;
      case 401:
        errorMessage = 'Please log in to continue';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 409:
        errorMessage = data.message || 'Conflict occurred';
        break;
      case 422:
        errorMessage = data.message || 'Validation failed';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later';
        break;
      default:
        errorMessage = data.message || `Error ${status}: ${data.error || 'Unknown error'}`;
    }
  } else if (error.request) {
    // Network error
    errorMessage = 'Network error. Please check your connection';
  } else {
    // Other errors
    errorMessage = error.message || 'An unexpected error occurred';
  }
  
  showToast.error(errorMessage);
  return errorMessage;
};

// Success handler for API responses
export const handleApiSuccess = (message) => {
  showToast.success(message);
};
