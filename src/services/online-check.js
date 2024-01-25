function checkOnlineState() {
  if (!navigator.onLine) {
    return false;
  }
  return true;
}

export default checkOnlineState;
