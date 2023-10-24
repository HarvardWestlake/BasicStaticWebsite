

class Main {
    constructor() {
        this.someVariable = [];
        this.pageViewsKey = 'pageViewsCount';
        this.initializeCounter();
        this.displayCount();
    }

    initializeCounter() {
        if (!localStorage.getItem(this.pageViewsKey)) {
            localStorage.setItem(this.pageViewsKey, '0');
        }
    }

    incrementCount() {
        let currentCount = parseInt(localStorage.getItem(this.pageViewsKey));
        currentCount++;
        localStorage.setItem(this.pageViewsKey, currentCount.toString());
    }

    displayCount() {
        this.incrementCount();
        // Update count in div id count
        //document.getElementById('count').innerHTML = 'You have visited this page ' + localStorage.getItem(this.pageViewsKey)  + ' times.'
    }

    clearCount() {
        localStorage.removeItem(this.pageViewsKey);
        this.displayCount();
    }
}

// Note that we construct the class here, but we don't need to assign it to a variable.
new Main();











document.addEventListener('click', function(event) {
    const container = document.getElementById('particle-container');

    for (let i = 0; i < 50; i++) {  /* More particles */
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Position particle at mouse location
        particle.style.left = (event.clientX - 5) + 'px';  /* Adjusted for increased size */
        particle.style.top = (event.clientY - 5) + 'px';   /* Adjusted for increased size */

        // Random direction for each particle
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 150;  /* Particles travel farther */

        // Calculate position based on the angle and distance
        particle.style.transform = 'translate(' + Math.cos(angle) * distance + 'px, ' + Math.sin(angle) * distance + 'px)';

        container.appendChild(particle);

        // Remove particle after animation complete to prevent DOM clutter
        setTimeout(function() {
            particle.remove();
        }, 1500);  /* Adjusted for longer animation duration */
    }
});
