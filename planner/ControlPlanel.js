const controlPanel = document.querySelector(".control-panel");

export const onControlPanelDisplayClick = (event) => {
  const isOpen = event.target.innerText.includes("Hide");

  if (isOpen) {
    controlPanel.style.display = "none";
    event.target.innerText = "Open Controls";
  } else {
    controlPanel.style.display = "block";
    event.target.innerText = "Hide Controls";
  }
};
