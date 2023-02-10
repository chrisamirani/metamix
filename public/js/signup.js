const signupForm = document.querySelector("form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);

  const info = {
    name: form.get("name"),
    password: form.get("password"),
    email: form.get("email"),
  };

  const res = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  if (res.status >= 400) {
    showToast(await res.text());
  } else {
    window.location.href = "/explore/living-room-furniture/sofas";
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
