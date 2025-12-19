function toggleClass() {

    var element = document.getElementById("ic1");
    element.classList.toggle("sticky_icons_group_first");

    var element = document.getElementById("ic2");
    element.classList.toggle("sticky_icons_group_second");

    var element = document.getElementById("ic3");
    element.classList.toggle("sticky_icons_group_third");

    var element = document.getElementById("ic4");
    element.classList.toggle("sticky_icons_group_fourth");

    var element = document.getElementById("ic5");
    element.classList.toggle("sticky_icons_group_fifth");

    var notification_div = document.getElementById("target_notification_wrapper");
    notification_div.classList.toggle("sticky_notification_position");
}




//document.addEventListener("DOMContentLoaded", function () {
//    const badge = document.getElementById("badgeMenu");
//    let offsetX = 0, offsetY = 0, isDown = false;

//    // ----- MOUSE EVENTS -----
//    badge.addEventListener('mousedown', function (e) {
//        isDown = true;
//        offsetX = e.clientX - badge.offsetLeft;
//        offsetY = e.clientY - badge.offsetTop;
//    });

//    document.addEventListener('mouseup', function () {
//        isDown = false;
//    });

//    document.addEventListener('mousemove', function (e) {
//        if (!isDown) return;
//        moveBadge(e.clientX, e.clientY);
//    });

//    // ----- TOUCH EVENTS -----
//    badge.addEventListener('touchstart', function (e) {
//        isDown = true;
//        const touch = e.touches[0];
//        offsetX = touch.clientX - badge.offsetLeft;
//        offsetY = touch.clientY - badge.offsetTop;
//    });

//    document.addEventListener('touchend', function () {
//        isDown = false;
//    });

//    document.addEventListener('touchmove', function (e) {
//        if (!isDown) return;
//        const touch = e.touches[0];
//        moveBadge(touch.clientX, touch.clientY);
//    });

//    function moveBadge(clientX, clientY) {
//        let newX = clientX - offsetX;
//        let newY = clientY - offsetY;

//        const maxX = window.innerWidth - badge.offsetWidth;
//        const maxY = window.innerHeight - badge.offsetHeight;

//        // Clamp X and Y inside screen
//        newX = Math.max(0, Math.min(newX, maxX));
//        newY = Math.max(0, Math.min(newY, maxY));

//        // Prevent Horizontal Center Stop
//        const centerX = window.innerWidth / 2 - badge.offsetWidth / 2;
//        if (Math.abs(newX - centerX) < 20) {
//            newX += (newX < centerX) ? -20 : 20;
//            newX = Math.max(0, Math.min(newX, maxX));
//        }

//        // Prevent Vertical Center Stop (only if vertical move allowed)
//        const centerY = window.innerHeight / 2 - badge.offsetHeight / 2;
//        if (newX < window.innerWidth / 2) {
//            if (Math.abs(newY - centerY) < 20) {
//                newY += (newY < centerY) ? -20 : 20;
//                newY = Math.max(0, Math.min(newY, maxY));
//            }
//            badge.style.top = newY + 'px';
//        }

//        badge.style.left = newX + 'px';
//    }

//});
