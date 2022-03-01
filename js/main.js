import postApi from "./api/postApi";
import studentApi from "./api/studentApi";
import { getAllcities } from "./api/cityApi";

console.log("Hello cong dep trai");

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };
    // const response = await postApi.getAll(queryParams);
    const data = await postApi.getAll(queryParams);
    console.log("main.js data", data);
  } catch (error) {
    console.log("Failed get all", error);
  }
  // const response = await axiosClient.get("/posts");
}

main();
