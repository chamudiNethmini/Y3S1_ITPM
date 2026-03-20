import API from "./api";

export const getResources = async (type = "") => {
  const url = type ? `/resources?type=${type}` : "/resources";
  const response = await API.get(url);
  return response.data;
};

export const createResource = async (data) => {
  const response = await API.post("/resources", data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await API.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await API.delete(`/resources/${id}`);
  return response.data;
};