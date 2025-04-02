import { apiClient } from "../core/api";

const productService = {
  getProducts: async () => {
    return apiClient.get("/products");
  },
};

export default productService;
