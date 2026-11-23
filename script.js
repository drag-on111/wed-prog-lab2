document.addEventListener('DOMContentLoaded', () =>{
        document.querySelector("#theme-toggle").addEventListener("click", toggleTheme);
        document.querySelector("#visitor-name").addEventListener("input", updateGreeting);
        document.querySelector("#comment-form").addEventListener("submit", addComment);
        document.querySelector("#load-html").addEventListener("click", loadHtml);
        document.querySelector("#load-json").addEventListener("click", loadJson);
});

function toggleTheme() {
const dark = document.body.classList.toggle("dark-theme");
document.body.classList.toggle("light-theme", !dark);
document.querySelector("#theme-toggle").setAttribute("aria-pressed", String(dark));
};

function updateGreeting(event) {
const name = event.target.value.trim();
document.querySelector("#greeting").textContent = name ? `Вітаємо, ${name}!` : "";
};

function addComment(event) {
event.preventDefault();
const form = event.currentTarget;
const authorField = form.elements.namedItem("author");
const textField = form.elements.namedItem("comment");
const author = authorField.value.trim();
const text = textField.value.trim();
if (!author || !text) return;

const item = document.createElement("li");
const heading = document.createElement("strong");
const paragraph = document.createElement("p");
heading.textContent = author;
paragraph.textContent = text;
item.appendChild(heading);

item.appendChild(paragraph);
document.querySelector("#comments").appendChild(item);
form.reset();
authorField.focus();
}

function loadHtml(event) {
const button = event.currentTarget;
const status = document.querySelector("#html-status");
const container = document.querySelector("#html-content");
button.disabled = true;
status.textContent = "Завантаження...";
container.replaceChildren();

fetch("fragment.html")
.then(response => {
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return response.text();
})
.then(html => {
// Допустимо лише для контрольованого навчального фрагмента.
container.innerHTML = html;

status.textContent = "HTML завантажено.";
})
.catch(error => {
status.textContent = "Не вдалося завантажити дані.";
console.error("Помилка завантаження HTML:", error);
})
.finally(() => { button.disabled = false; });
}

async function loadJson(event) {
const button = event.currentTarget;
const status = document.querySelector("#json-status");
const container = document.querySelector("#json-content");
button.disabled = true;
status.textContent = "Завантаження...";
container.replaceChildren();

try {
const response = await fetch("data.json");
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data = await response.json();
if (!Array.isArray(data) || !data.every(item =>

item !== null && typeof item === "object" &&
typeof item.author === "string" && typeof item.text === "string"
)) {
throw new Error("Невідповідна структура JSON");
}

const fragment = document.createDocumentFragment();
for (const item of data) {
const li = document.createElement("li");
li.textContent = `${item.author}: ${item.text}`;
fragment.appendChild(li);
}
container.appendChild(fragment);
status.textContent = data.length ? "JSON завантажено." : "Даних немає.";
} catch (error) {
status.textContent = "Не вдалося завантажити дані.";
console.error("Помилка завантаження JSON:", error);
} finally {
button.disabled = false;
}
}