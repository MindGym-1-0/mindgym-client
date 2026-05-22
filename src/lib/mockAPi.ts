export const mockSubmitOnboarding = async (data: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error("Failed to save onboarding data. Please try again."));
      } else {
        resolve({ success: true, data });
      }
    }, 1500);
  });
};
