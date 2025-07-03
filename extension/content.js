window.addEventListener("message", (event) => {
  if (
    event.data?.source === "marino" &&
    (event.data.type === "clientStorageUpdate" ||
      event.data.type === "serverStorageUpdate")
  ) {
    chrome.runtime.sendMessage(event.data);
  }
});

setTimeout(() => {
  chrome.runtime.sendMessage({
    source: "marino-extension",
    type: "getClientStorageUpdate",
    payload: {},
  });
}, 500);
