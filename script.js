"use strict";

const requestLyrics = async function (artist, title) {
  try {
    const response = await fetch(
      `http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${title}`,
      {
        method: "GET",
      }
    );
    const string = await response.text();
    const data = new window.DOMParser().parseFromString(string, "text/xml");
    const lyrics = data.documentElement.lastChild.previousSibling.textContent;
    countLyric(lyrics);
  } catch (err) {
    console.error(err);
  }
};

const countLyric = function (lyrics) {
  const lyricCounter = {};
  const lyricsArr = lyrics.split(/ |\n/);

  lyricsArr.forEach((el) => {
    if (el[el.length - 1] === ",") {
      el = el.replace(",", "");
    }
    if (lyricCounter[el]) {
      lyricCounter[el]++;
    } else {
      lyricCounter[el] = 1;
    }
  });

  const sortedArr = [];

  for (const lyric in lyricCounter) {
    sortedArr.push([lyric, lyricCounter[lyric]]);
  }

  sortedArr.sort((a, b) => b[1] - a[1]);

  renderLyrics(sortedArr);
};

const main = document.querySelector("main");
let spanElements;

const renderLyrics = function (arr) {
  main.innerHTML = "";
  if (arr.length === 0) {
    return;
  }
  const max = arr[0][1];

  arr.forEach((el) => {
    const spanEl = document.createElement("span");
    spanEl.textContent = `${el[0]} : ${el[1]}`;
    spanEl.style.fontSize = `${(el[1] / max) * 3 + 1}rem`;
    main.appendChild(spanEl);
  });

  spanElements = document.querySelectorAll("main span");

  spanElements.forEach((el, index) => {
    el.addEventListener("click", function () {
      arr.splice(index, 1);
      renderLyrics(arr);
    });
  });
};

const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", function () {
  const searchResult = searchInput.value.split(";");
  const artist = searchResult[0];
  const title = searchResult[1];
  requestLyrics(artist, title);
});
