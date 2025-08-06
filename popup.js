document.addEventListener("DOMContentLoaded", async () => {
  const tabList = document.getElementById("tab-list");
  const searchInput = document.getElementById("search");
  const toggleBtn = document.getElementById("toggle-scope");

  let tabs = await chrome.tabs.query({});
  let showAllWindows = true;

  function renderTabs() {
    tabList.innerHTML = ""; // Clear existing list
    tabs.forEach(tab => {
      const li = document.createElement("li");

      const favicon = document.createElement("img");
      favicon.src = tab.favIconUrl || "";
      favicon.alt = "";
      favicon.width = 16;
      favicon.height = 16;
      favicon.style.verticalAlign = "middle";
      favicon.style.marginRight = "6px";

      const link = document.createElement("a");
      link.textContent = tab.title;
      link.href = "#";
      link.onclick = async (e) => {
        e.preventDefault();
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
      };

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "X";
      closeBtn.onclick = async () => {
      await chrome.tabs.remove(tab.id);
      li.remove(); // Remove the tab's list item from the popup
    };
      

      li.appendChild(favicon);
      li.appendChild(link);
      li.appendChild(closeBtn);
      tabList.appendChild(li);
    });
  }

  toggleBtn.onclick = async () => {
    showAllWindows = !showAllWindows;
    searchInput.value = ""; // Clear search input on toggle
    await loadTabs();
  };

  async function loadTabs() {
    if (showAllWindows) {
      tabs = await chrome.tabs.query({});
      toggleBtn.textContent = "Show Current Only";
    } else {
      const currentWindow = await chrome.windows.getCurrent();
      tabs = await chrome.tabs.query({ currentWindow: true });
      toggleBtn.textContent = "Show All Windows";
    }
    renderTabs();
  }

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

  // Initial render
  renderTabs();
});