const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const subjectBlock = document.getElementById("subjectBlock");
const chapterBlock = document.getElementById("chapterBlock");
const chapterList = document.getElementById("chapterList");

// -------------------------
// DATA (CLASS → SUBJECT → CHAPTER → FILE)
// -------------------------
const data = {

    class11: {
        physics: [
            { name: "Physical World", file: "11_physics_physical_world.pdf" },
            { name: "Units & Measurement", file: "11_physics_units.pdf" },
            { name: "Motion in Straight Line", file: "11_physics_motion_straight.pdf" }
        ],

        chemistry: [
            { name: "Basic Concepts of Chemistry", file: "11_chem_basic.pdf" },
            { name: "Structure of Atom", file: "11_chem_atom.pdf" }
        ]
    },

    class12: {
        physics: [
            { name: "Electric Charges", file: "12_physics_electric.pdf" },
            { name: "Magnetism", file: "12_physics_magnetism.pdf" }
        ],

        chemistry: [
            { name: "Solid State", file: "12_chem_solidstate.pdf" },
            { name: "Solutions", file: "12_chem_solutions.pdf" }
        ]
    }

};


// -------------------------
// CLASS SELECT
// -------------------------
classSelect.addEventListener("change", () => {
    subjectSelect.innerHTML = "";
    chapterList.innerHTML = "";
    chapterBlock.style.display = "none";

    if (!classSelect.value) {
        subjectBlock.style.display = "none";
        return;
    }

    subjectBlock.style.display = "block";

    const subjects = Object.keys(data[classSelect.value]);

    subjects.forEach(sub => {
        subjectSelect.innerHTML += `<option value="${sub}">${sub.toUpperCase()}</option>`;
    });
});


// -------------------------
// SUBJECT SELECT
// -------------------------
subjectSelect.addEventListener("change", () => {
    chapterList.innerHTML = "";

    if (!subjectSelect.value) {
        chapterBlock.style.display = "none";
        return;
    }

    chapterBlock.style.display = "block";

    const chapters = data[classSelect.value][subjectSelect.value];

    chapters.forEach(ch => {
        chapterList.innerHTML += `
            <li onclick="openPDF('${ch.file}', '${ch.name}')">${ch.name}</li>
        `;
    });
});


// -------------------------
// OPEN PDF VIEWER
// -------------------------
function openPDF(file, name) {
    window.location.href = `viewer.html?file=${file}&title=${name}`;
}
