document.addEventListener("DOMContentLoaded", () => {
  let curSelectedNav = null; // Ensure this is initialized at the top

  const API_KEY = "cyBpEyFw6bAzFcnYebE5xZJlZ2DLqgueNlqI-wzCb9u2l2Uu";
  const url = "https://api.currentsapi.services/v1/latest-news?";

  // Web Speech API integration
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Set recognition settings
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Get elements
  const voiceButton = document.getElementById("voice-button");
  const searchText = document.getElementById("search-text");
  const mobileSearchText = document.getElementById("mobile-search-text");
  const searchButton = document.getElementById("search-button");
  const mobileSearchButton = document.getElementById("mobile-search-button");
  const mobileVoiceButton = document.getElementById("mobile-voice-button");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const mobileSearchBar = document.getElementById("mobile-search-bar");

  // Voice command functions
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    searchText.value = result; // Populate search input with voice result
    mobileSearchText.value = result;
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed") {
      alert(
        "Microphone access denied. Please allow microphone access to use voice search."
      );
    } else {
      console.error("Speech recognition error", event.error);
    }
  };

  // Event listeners
  if (voiceButton) {
    voiceButton.addEventListener("click", () => {
      try {
        recognition.start();
      } catch (error) {
        alert(
          "An error occurred while starting voice recognition. Please ensure your microphone is working."
        );
      }
    });
  }

  if (mobileVoiceButton) {
    mobileVoiceButton.addEventListener("click", () => {
      try {
        recognition.start();
      } catch (error) {
        alert(
          "An error occurred while starting voice recognition. Please ensure your microphone is working."
        );
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const query = searchText.value;
      if (!query) return;
      fetchNews(query);
      curSelectedNav?.classList.remove("active");
      curSelectedNav = null;
    });
  }

  if (mobileSearchButton) {
    mobileSearchButton.addEventListener("click", () => {
      const query = mobileSearchText.value;
      if (!query) return;
      fetchNews(query);
    });
  }

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener("click", () => {
      hamburgerMenu.classList.toggle("active");
      mobileSearchBar.classList.toggle("visible");
    });
  }

  // Handle search requests
  async function fetchNews(query) {
    try {
      const response = await fetch(`${url}apiKey=${API_KEY}&keywords=${query}`);
      const data = await response.json();
      console.log("API Response:", data);

      if (!data.news || !Array.isArray(data.news)) {
        throw new Error("Invalid data format received from API");
      }

      bindData(data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
      alert("Failed to fetch news. Please try again later.");
    }
  }

  function bindData(news) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    news.forEach((article) => {
      if (!article.image) return; // Check if the article has an image
      const cardClone = newsCardTemplate.content.cloneNode(true);
      fillDataInCard(cardClone, article);
      cardsContainer.appendChild(cardClone);
    });
  }

  function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.image || "https://via.placeholder.com/400x200";
    newsTitle.innerHTML = article.title || "No title available";
    newsDesc.innerHTML = article.description || "No description available";

    const date = article.published
      ? new Date(article.published).toLocaleString("en-US", {
          timeZone: "Asia/Jakarta",
        })
      : "No date available";

    newsSource.innerHTML = `${
      article.source ? article.source.name : "Unknown source"
    } · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
  }

  // Handle navbar item clicks
  window.onNavItemClick = function (id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
  };

  // Reload function
  window.reload = function () {
    location.reload();
  };

  // Assuming that these IDs correspond to categories or keywords in the API
  const categories = {
    ipl: "sports",
    finance: "finance",
    politics: "politics",
  };

  // Function to fetch news based on the query or category
  async function fetchNews(query) {
    try {
      const response = await fetch(`${url}apiKey=${API_KEY}&category=${query}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Detailed logging

      if (!data.news || !Array.isArray(data.news)) {
        throw new Error("Invalid data format received from API");
      }

      bindData(data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
      alert("Failed to fetch news. Please try again later.");
    }
  }

  // Handle navbar item clicks
  function onNavItemClick(id) {
    const category = categories[id] || id; // Default to id if no category mapping
    fetchNews(category);
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
      curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
  }

  // Event listeners for search
  searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (query) {
      fetchNews(query);
      curSelectedNav?.classList.remove("active");
      curSelectedNav = null;
    }
  });

  mobileSearchButton.addEventListener("click", () => {
    const query = mobileSearchText.value.trim();
    if (query) {
      fetchNews(query);
    }
  });
});
