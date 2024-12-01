import axios from "axios";

const API_URL = "http://localhost:3000";

export const fetchProductsByCategory = (category) =>
  axios.get(`${API_URL}/${category}`);
