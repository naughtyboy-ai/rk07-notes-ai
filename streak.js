function updateStreak() {
    let today = new Date().toLocaleDateString();
    let last = localStorage.getItem("lastStudyDate");
    let streak = Number(localStorage.getItem("studyStreak") || 0);

    if (last === today) return streak;

    if (last) {
        let diff = 
        (new Date(today) - new Date(last)) / (1000 * 3600 * 24);

        if (diff === 1) streak++;
        else streak = 1;
    } else {
        streak = 1;
    }

    localStorage.setItem("lastStudyDate", today);
    localStorage.setItem("studyStreak", streak);

    return streak;
}
