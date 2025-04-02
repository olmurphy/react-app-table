import { apiClient } from "../core/api";

const analyticsService = {
  postAnalytics: async (data: any) => {
    return apiClient.post("/analytics", data);
  },
};

export default analyticsService;
