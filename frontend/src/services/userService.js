import API from "./api";

export const updateUserStatus = async (id, status) => {
  const response = await API.put(`/users/status/${id}`, { status });
  return response.data;
};