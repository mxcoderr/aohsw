import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

console.clear();
console.log("=== RCOS (Realtime COuntdown System) ===");
console.log("The greatest modern realtime REST API (not really)\n");

const url = await rl.question("Server URL: ");
const dateString = await rl.question("Target date (YYYY-MM-DD HH:MM:SS): ");
rl.close();


const normalizedDate = dateString.replace(" ", "T");
const targetDate = new Date(normalizedDate).getTime();


if (isNaN(targetDate)) {
  console.error("❌ Неверный формат даты. Используйте: YYYY-MM-DD HH:MM:SS");
  process.exit(1);
}

const now = Date.now();
const delay = targetDate - now;

if (delay > 0) {
  console.log(`⏳ Ожидание ${Math.round(delay / 1000)} секунд до отправки...`);
  setTimeout(() => {
    sendRequest(url);
  }, delay);
} else {
  console.log("⏩ Целевая дата уже прошла, выполняем запрос сразу.");
  sendRequest(url);
}


async function sendRequest(url) {
  try {
    console.log(`🚀 Отправка GET-запроса на ${url}...`);
    const response = await fetch(url);

    
    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
    }

    // Пытаемся прочитать как JSON, если не выйдет — выводим как текст
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("✅ Ответ сервера:");
    console.log(data);
  } catch (error) {
    console.error("❌ Ошибка при выполнении запроса:", error.message);
  }
}