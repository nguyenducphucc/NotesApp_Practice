import axios from "axios";
const baseUrl = "/api/notes";

let token = null;

const getToken = (key) => {
  token = `bearer ${key}`;
};

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const create = (newObject) => {
  console.log(token);
  const config = {
    headers: { Authorization: token },
  };

  return axios.post(baseUrl, newObject, config).then((res) => res.data);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then((res) => res.data);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getToken, getAll, create, update };
