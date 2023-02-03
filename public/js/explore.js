const viewers = document.getElementsByClassName("product-card-img");

for (var i = 0; i < viewers.length; i++) {
  viewers[i].addEventListener("error", (element) => {
    const parent = document.getElementById(element.target.src);

    parent.remove();
  });
}
