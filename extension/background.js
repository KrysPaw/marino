chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.source !== "marino") {
    return;
  }

  chrome.runtime.sendMessage(msg);
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    func: (data) => {
      window.postMessage(
        {
          source: "marino-extension",
          type: "getClientStorageUpdate",
          payload: data,
        },
        "*"
      );
    },
    args: [{ foo: "bar" }], // <- dowolne dane, które chcesz przekazać
  });
});
