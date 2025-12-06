document.getElementById("uploadBtn").addEventListener("click", () => {
    let fileInput = document.getElementById("noteFile");
    let titleInput = document.getElementById("noteTitle");

    if (!fileInput.files.length || !titleInput.value.trim()) {
        alert("Please enter title and select a file.");
        return;
    }

    let file = fileInput.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        let note = {
            title: titleInput.value,
            fileName: file.name,
            fileData: e.target.result,
            time: new Date().toLocaleString()
        };

        let notes = JSON.parse(localStorage.getItem("savedNotes") || "[]");
        notes.push(note);
        localStorage.setItem("savedNotes", JSON.stringify(notes));

        alert("Note Saved Successfully!");
    };

    reader.readAsDataURL(file);
});
