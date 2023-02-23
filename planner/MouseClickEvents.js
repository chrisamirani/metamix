export const setControlMode = (translateBtn, rotateBtn, controls, mode) => {
  controls.mode = mode;

  if (mode == "translate") {
    translateBtn.classList.add("control-btn-active");
    rotateBtn.classList.remove("control-btn-active");
  } else {
    translateBtn.classList.remove("control-btn-active");
    rotateBtn.classList.add("control-btn-active");
  }
};
