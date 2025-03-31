function warn(message) {
  const warnZone = document.getElementById("Warning");
  warnZone.textContent = message;
  setTimeout(() => {
    warnZone.textContent = "";
  }, 2000);
}
export default warn;
