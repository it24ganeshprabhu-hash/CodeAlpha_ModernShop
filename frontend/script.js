document.addEventListener('DOMContentLoaded', () => {
    console.log("Modern_Shop home page loaded successfully.");

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning!" : "Welcome to Modern_Shop!";
    console.log(greeting);
});