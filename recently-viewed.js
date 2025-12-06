function addRecent(name) {
    let list = JSON.parse(localStorage.getItem("recentNotes") || "[]");

    list.unshift(name);
    list = [...new Set(list)].slice(0, 10);

    localStorage.setItem("recentNotes", JSON.stringify(list));
}

function loadRecent() {
    let list = JSON.parse(localStorage.getItem("recentNotes") || "[]");
    document.getElementById("recentBox").innerHTML =
        list.map(x => `<div class="recent">${x}</div>`).join("");
}
