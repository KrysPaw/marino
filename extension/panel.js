chrome.runtime.onMessage.addListener((msg) => {
  console.log("Received message in panel.js:", msg);
  if (msg.type === "clientStorageUpdate") {
    document.getElementsByClassName("clientStorageCodeArea")[0].textContent =
      JSON.stringify(msg.data.storageState, null, 4);
  }

  if (msg.type === "serverStorageUpdate") {
    if (msg.data.storageState) {
      document.getElementsByClassName("serverStorageCodeArea")[0].textContent =
        JSON.stringify(msg.data.storageState, null, 4);
    }

    if (msg.data.connectedClients) {
      document.getElementsByClassName(
        "connectedClientsCodeArea"
      )[0].textContent = JSON.stringify(msg.data.connectedClients, null, 4);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({
    source: "marino-extension",
    type: "getClientStorageUpdate",
    payload: {},
  });

  document
    .getElementById("clientStorageBtn")
    .addEventListener("click", (event) => {
      openSection(event, "clientStorageContent");
    });

  document
    .getElementById("serverStorageBtn")
    .addEventListener("click", (event) => {
      openSection(event, "serverStorageContent");
    });

  document
    .getElementById("connectedClientsBtn")
    .addEventListener("click", (event) => {
      openSection(event, "connectedClientsContent");
    });
});

function openSection(evt, name) {
  console.log("openCity called with cityName:", name);
  console.log("onclick");
  var i;
  var tabcontent;
  var tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");

  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementsByClassName(name)[0].style.display = "block";
  evt.currentTarget.className += " active";
}
