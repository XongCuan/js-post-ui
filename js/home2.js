import postApi from "./api/postApi";
import studentApi from "./api/studentApi";
import { getAllcities } from "./api/cityApi";

console.log("Hello cong dep trai");

function createPostElement(post) {
  if (!post) return;

  try {

    const postTemplate = document.getElementById("postTemplate");
    if(!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if(!liElement) return;

    const titleElement = liElement.querySelector('[data-id="title"]');
    if (titleElement) titleElement.textContent = post.title;

    const descriptionElement = liElement.querySelector(
      '[data-id="description"]'
    );
    if (descriptionElement) descriptionElement.textContent = post.description;

    const authorElement = liElement.querySelector('[data-id="author"]');
    if (authorElement) authorElement.textContent = post.author;

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) thumbnailElement.src = post.imageUrl;

    // const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    // if (thumbnailElement) thumbnailElement.src = post.imageUrl;

    return liElement;
  } catch (error) {
    console.log("failed to create post item", error);
  }
}

function renderPostList(postList) {
  console.log({ postList });
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById("postList");
  if (!ulElement) return;

  postList.forEach((post, index) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };
    // const response = await postApi.getAll(queryParams);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log("Failed get all", error);
  }
})();
