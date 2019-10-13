import axios from "axios";
import { API_ROOT } from "../config/api-config";

console.log(API_ROOT);
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  baseUrl: API_ROOT
};
