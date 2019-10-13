import http from "./httpService";

async function getTaxSlabs() {
  try {
    const { data: taxSlabs } = await http.get(`${http.baseUrl}/taxSlabs`);
    return taxSlabs;
  } catch (error) {
    console.log(error);
  }
}

export default { getTaxSlabs };
