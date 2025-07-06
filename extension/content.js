const handledTypes = [
  "clientStorageUpdate",
  "serverStorageUpdate",
  "clientCommandsTrackerUpdate",
];

window.addEventListener("message", (event) => {
  if (
    event.data?.source === "marino" &&
    handledTypes.includes(event.data.type)
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
