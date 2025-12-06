const formulas = {
    math: [
        "sin²θ + cos²θ = 1",
        "tanθ = sinθ / cosθ",
        "a² + b² + c² − 2ab − 2bc − 2ca"
    ],
    physics: [
        "v = u + at",
        "F = ma",
        "E = mc²"
    ],
    chemistry: [
        "Molarity = moles / liters",
        "PV = nRT"
    ]
};

function loadFormulas(type) {
    let box = document.getElementById("formulaBox");
    box.innerHTML = "";

    formulas[type].forEach(f => {
        box.innerHTML += `<div class="formula">${f}</div>`;
    });
}
