document.addEventListener("DOMContentLoaded", async () => {
  const tabList = document.getElementById("tab-list");
  const searchInput = document.getElementById("search");

  const tabs = await chrome.tabs.query({ currentWindow: true });

  tabs.forEach(tab => {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.textContent = tab.title;
    link.href = "#";
    link.onclick = () => chrome.tabs.update(tab.id, { active: true });

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    closeBtn.onclick = () => chrome.tabs.remove(tab.id);

    li.appendChild(link);
    li.appendChild(closeBtn);
    tabList.appendChild(li);
  });

  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const items = tabList.getElementsByTagName("li");

    Array.from(items).forEach(item => {
      const link = item.getElementsByTagName("a")[0];
      if (link.textContent.toLowerCase().includes(filter)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });

});
