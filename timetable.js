function generateTimetable(className) {
    let base = {
        "12 science": ["Physics", "Chemistry", "Maths", "English", "CS"],
        "12 commerce": ["Accounts", "Business", "Economics", "Maths"],
        "12 arts": ["History", "Geo", "Political Sci", "English"],
        "11 science": ["Physics", "Chemistry", "Maths", "English"],
    };

    let subjects = base[className.toLowerCase()] || ["General Study"];

    let table = `<h2>${className} Timetable</h2>`;
    table += "<table border='1' style='width:100%;text-align:center;'>";

    subjects.forEach((sub, i) => {
        table += `<tr><td>Day ${i+1}</td><td>${sub}</td><td>2 hours</td></tr>`;
    });

    table += "</table>";

    document.getElementById("result").innerHTML = table;
}
