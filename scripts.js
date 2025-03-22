function setScore(score) {
    const needle = document.querySelector('.needle');
    // Convert score to degrees
    // 0 score = -90deg, 100 score = 90deg
    const degrees = -90 + (score * 1.8); // 1.8 = 180/100 to spread 180 degrees
    needle.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
}


