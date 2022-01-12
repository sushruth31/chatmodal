import axios from "axios";
import { useDataStore } from "../datastore";

export default function useAxios() {
  const { axiosheaders } = useDataStore();

  return async (method, url, body = {}, params = {}) => {
    return axios.request({
      url: url,
      method: method,
      data: body,
      params: params,
      ...axiosheaders,
    });
  };
}
