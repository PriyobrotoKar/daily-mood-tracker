const monthYear = document.getElementById("month-year");
const prevNextBtns = document.querySelectorAll(".calender-button");
const dates = document.querySelector(".dates");
const moodSelector = document.querySelector(".mood-selector");
const currentDateElement = document.getElementById("today-date");

const moods = [
  {
    emoji: "😀",
    name: "Happy",
  },
  {
    emoji: "😢",
    name: "Sad",
  },
  {
    emoji: "😡",
    name: "Angry",
  },
  {
    emoji: "😴",
    name: "Tired",
  },
  {
    emoji: "😐",
    name: "Neutral",
  },
  {
    emoji: "😎",
    name: "Cool",
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const date = new Date();
let currentDate = date.getDate();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();

currentDateElement.innerHTML = `${months[currentMonth]} ${currentDate}, ${currentYear}`;

function getMood(date) {
  const moodData = JSON.parse(localStorage.getItem("moodData")) || [];

  const mood = moodData.find(
    (item) => new Date(item.date).getTime() === date.getTime(),
  );

  return mood?.emoji;
}

function saveMood(mood) {
  const moodData = JSON.parse(localStorage.getItem("moodData")) || [];

  const newMood = {
    date: new Date(date.getFullYear(), date.getMonth(), currentDate),
    emoji: mood,
  };

  const index = moodData.findIndex(
    (item) => new Date(item.date).getTime() === newMood.date.getTime(),
  );

  if (index !== -1) {
    moodData[index] = newMood;
  } else {
    moodData.push(newMood);
  }

  localStorage.setItem("moodData", JSON.stringify(moodData));
}

function renderCalender() {
  let lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  let lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();
  let lastDayOfThisMonth = new Date(currentYear, currentMonth + 1, 0).getDay();

  monthYear.innerHTML = `${months[currentMonth]} ${currentYear}`;
  dates.innerHTML = "";

  function createDateElement(date, className) {
    const li = document.createElement("li");
    if (className) li.classList.add(className);
    li.innerHTML = date;

    return li;
  }

  for (let i = firstDayOfMonth; i > 0; i--) {
    dates.appendChild(
      createDateElement(lastDateOfLastMonth - i + 1, "inactive-date"),
    );
  }

  for (let i = 1; i <= lastDateOfMonth; i++) {
    const mood = getMood(new Date(currentYear, currentMonth, i));

    const li = createDateElement(i);

    if (i === currentDate && currentMonth === date.getMonth()) {
      li.classList.add("active-date");
    }

    if (mood) {
      const span = document.createElement("span");
      span.innerHTML = mood;
      li.appendChild(span);
    }

    dates.appendChild(li);
  }

  for (let i = 1; i <= 6 - lastDayOfThisMonth; i++) {
    dates.appendChild(createDateElement(i, "inactive-date"));
  }
}

function renderMoodSelector() {
  const currentMood = getMood(new Date(currentYear, currentMonth, currentDate));

  moods.forEach((mood) => {
    const button = document.createElement("button");
    button.classList.add("outline-button");
    if (currentMood === mood.emoji) {
      button.classList.add("selected");
    }

    button.innerHTML = `
			<div class="emoji">${mood.emoji}</div>
			<div>${mood.name}</div>
		`;

    button.addEventListener("click", () => {
      const selected = document.querySelector(".selected");
      if (selected) {
        selected.classList.remove("selected");
      }

      button.classList.add("selected");

      saveMood(mood.emoji);
      renderCalender();
    });

    moodSelector.appendChild(button);
  });
}

prevNextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentMonth = btn.id === "prev" ? currentMonth - 1 : currentMonth + 1;

    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    renderCalender();
  });
});

renderMoodSelector();
renderCalender();
