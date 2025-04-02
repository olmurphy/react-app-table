import { apiClient } from "../core/api";

const userService = {
  getUser: async (data: any) => {
    return apiClient.get("/user");
  },
};

export default userService;
