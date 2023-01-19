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

  console.log(status);
});
