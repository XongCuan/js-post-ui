import postApi from "./api/postApi";
import studentApi from "./api/studentApi";
import { getAllcities } from "./api/cityApi";
import { getUlPaginationElement, setTextContent, truncateText } from "./utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// to use fromNow funcition
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  const postTemplate = document.getElementById("postTemplate");
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // update title and description, author , thumbnail
  // const titleElement = liElement.querySelector('[data-id="title"]');
  // if (titleElement) titleElement.textContent = post.title;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(
    liElement,
    '[data-id="description"]',
    truncateText(post.description, 100)
  );
  setTextContent(liElement, '[data-id="author"]', post.author);

  //caculate timespan
  // console.log("timespan", dayjs(post.updatedAt).fromNow());
  setTextContent(
    liElement,
    '[data-id="timeSpan"]',
    ` - ${dayjs(post.updatedAt).format("DD/MM/YY")}`
  );

  // const descriptionElement = liElement.querySelector(
  //   '[data-id="description"]'
  // );
  // if (descriptionElement) descriptionElement.textContent = post.description;

  // const authorElement = liElement.querySelector('[data-id="author"]');
  // if (authorElement) authorElement.textContent = post.author;

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener("error", () => {
      thumbnailElement.src =
        "https://via.placeholder.com/1368x400?text=xuancong";
    });
  }
  return liElement;
}

function renderPostList(postList) {
  // console.log("postList :", postList);
  // console.log({ postList });
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById("postList");
  if (!ulElement) return;

  // clear current list
  ulElement.textContent = "";

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function renderPaginations(pagination) {
  const ulPagination = getUlPaginationElement();
  if (!ulPagination || !pagination) return;

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if enable/ disable prev/next links
  if (_page <= 1) {
    ulPagination.firstElementChild?.classList.add("disabled");
  } else ulPagination.firstElementChild?.classList.remove("disabled");

  if (_page >= totalPages) {
    ulPagination.lastElementChild?.classList.add("disabled");
  } else ulPagination.lastElementChild?.classList.remove("disabled");
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    history.pushState({}, "", url);

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPaginations(pagination);
  } catch (error) {
    console.log("failed to fetch post list", error);
  }
}

function handlePrevLink(e) {
  e.preventDefault();
  const ulPagination = getUlPaginationElement();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  if (page <= 1) return;

  handleFilterChange("_page", page - 1);
}

function handleNextLink(e) {
  e.preventDefault();
  const ulPagination = getUlPaginationElement();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPages = ulPagination.dataset.totalPages;
  if (page >= totalPages) return;

  handleFilterChange("_page", page + 1);
}

function initPagination() {
  // bind click event for prev/next link
  const ulPagination = getUlPaginationElement();
  if (!ulPagination) return;

  //add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener("click", handlePrevLink);
  }

  //add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener("click", handleNextLink);
  }
}

function initURL() {
  const url = new URL(window.location);

  // update search params
  // url.searchParams.set(filterName, filterValue);
  if (!url.searchParams.get("_page")) url.searchParams.set("_page", 1);
  if (!url.searchParams.get("_limit")) url.searchParams.set("_limit", 6);

  history.pushState({}, "", url);
}

(async () => {
  try {
    initPagination();
    initURL();

    const queryParams = new URLSearchParams(window.location.search);

    //set default query params if not existed
    console.log(queryParams.toString());

    // const queryParams = {
    //   _page: 1,
    //   _limit: 6,
    // };

    // const response = await postApi.getAll(queryParams);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPaginations(pagination);
  } catch (error) {
    console.log("Failed get all", error);
  }
})();
