document.addEventListener("DOMContentLoaded", async () => {
  const tabList = document.getElementById("tab-list");
  const searchInput = document.getElementById("search");

  const tabs = await chrome.tabs.query({});
  

  tabs.forEach(tab => {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.textContent = tab.title;
    link.href = "#";
    // link.onclick = () => chrome.tabs.update(tab.id, { active: true });

    link.onclick = async (e) => {
      e.preventDefault();
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
    };

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

    Array.from(items).forEach((item, idx) => {
      const link = item.getElementsByTagName("a")[0];
      const tab = tabs[idx];
      const titleMatch = link.textContent.toLowerCase().includes(filter);
      const ytMatch = filter === "yt" && tab.url && tab.url.includes("youtube.com");
      const fbMatch = filter === "fb" && tab.url && tab.url.includes("facebook.com");

      if (titleMatch || ytMatch || fbMatch) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });

});
