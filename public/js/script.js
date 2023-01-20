const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);

  const info = {
    name: form.get("name"),
    tel: form.get("tel"),
    email: form.get("email"),
  };

  const res = await fetch("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  const status = await res.json();

  if (res.status >= 400) {
    showToast("Something went wrong");
  } else {
    showToast("We'll be in touch shortly");
    e.target.reset();
  }
});

function showToast(message) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";
  x.innerText = message;

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
