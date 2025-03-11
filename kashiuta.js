const element = document.getElementById("kashi_area");
if (element) {
    let text = element.innerHTML;
    text = text.replace(/<br\s*\/?>/gi, "\n");
    console.log(text);
} else {
    console.log("");
}
