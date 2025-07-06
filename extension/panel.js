chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "clientStorageUpdate") {
    document.getElementsByClassName("clientStorageCodeArea")[0].textContent =
      JSON.stringify(msg.data, null, 4);
  }

  if (msg.type === "clientCommandsTrackerUpdate") {
    const items = msg.data.map((command) => {
      const item = document.createElement("div");
      const typeClass =
        command.type === "OUTGOING" ? "outgoing-command" : "incoming-command";
      const handledString =
        command.handled === true
          ? "[handled]"
          : command.handled === false
          ? "[unhandled]"
          : "";
      item.className = `commands-list-item ${typeClass}`;
      item.textContent = `${new Date(
        command.timestamp
      ).toLocaleTimeString()} - ${command.type} - ${
        command.action
      } - ${handledString}`;

      item.addEventListener("click", () => {
        const payloadArea = document.getElementsByClassName(
          "clientCommandsTrackerPayloadArea"
        )[0];
        payloadArea.textContent = JSON.stringify(command.payload, null, 4);
      });

      return item;
    });

    document.getElementsByClassName("commands-list")[0].innerHTML = "";

    items.forEach((item) => {
      document.getElementsByClassName("commands-list")[0].appendChild(item);
    });
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
    .getElementById("clientCommandsTrackerBtn")
    .addEventListener("click", (event) => {
      openSection(event, "clientCommandsTrackerContent");
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
