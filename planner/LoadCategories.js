const categoryList = document.querySelector("#categories");
const itemsContainer = document.querySelector("#items-container");
const paginator = document.querySelector("#paginator");
import { scene, controls } from "./index";
import LoadItem from "./ItemLoader";

const CDN_BASE_URL = "https://metamix-cdn.nyc3.digitaloceanspaces.com";

import data from "../categories.json";

let page = 1;
let maxPage = 0;
let currentSlug = "sofas";

const populateCategoriesList = () => {
  const categorySlugs = Object.keys(data);

  for (let index = 0; index < categorySlugs.length; index++) {
    const subCategories = data[categorySlugs[index]];
    subCategories.forEach((element) => {
      categoryList.innerHTML += `<option value="${element.subCategory.slug}">${element.subCategory.name}</option>`;
    });
  }
};

categoryList.addEventListener("change", async (event) => {
  const slug = event.target.value;
  page = 1;
  currentSlug = slug;
  renderItems(slug);
});

const renderItems = async (slug) => {
  const items = await getItemsBySlug(slug);
  const { products, totalPages, code } = items;
  if (code) return console.log("something went wrong"); // todo: better handling
  itemsContainer.innerHTML = "";
  maxPage = totalPages;

  products.forEach((product) => {
    const item = `
    <div class="item" id="${product.sku}">
    <img onerror="this.parentNode.remove()" src="${
      CDN_BASE_URL + "/thumbnails/" + product.sku
    }.glb.png" alt="${product.name}">
    <h5>${product.name}</h5>
    </div>
    `;

    itemsContainer.innerHTML += item;
  });

  itemsContainer.childNodes.forEach((i) => {
    i.addEventListener("click", (e) => {
      console.log(e);
      const modelId = e.currentTarget.id;
      const details = products.find((p) => p.sku == modelId);
      LoadItem(
        CDN_BASE_URL + `/models/${modelId}.glb`,
        scene,
        controls,
        details
      );
    });
  });
  updatePaginator(maxPage);
};
const getPage = (pageNumber) => {
  page = pageNumber;
  renderItems(currentSlug);
};

const updatePaginator = (totalPages) => {
  paginator.innerHTML = "";
  for (let i = 1; i < totalPages; i++) {
    paginator.innerHTML += `<a class="btn-pagination ${
      page == i ? "btn-pagination-active" : ""
    }">${i}</a>`;
  }

  paginator.childNodes.forEach((c) =>
    c.addEventListener("click", (e) => {
      getPage(Number(e.target.innerText));
    })
  );
};

const getItemsBySlug = async (slug) => {
  const res = await fetch("/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page,
      slug,
    }),
  });

  return await res.json();
};

// first render
renderItems(currentSlug);

export default populateCategoriesList;
