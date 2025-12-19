// Disable Right Click
document.addEventListener('contextmenu', event => event.preventDefault());

        // Disable Shortcut Keys
        document.onkeydown = function (e) {
    // F12
    if (e.keyCode == 123) return false;
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) return false;
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) return false;
        // Ctrl+U
        if (e.ctrlKey && e.keyCode == 85) return false;
        // Ctrl+S
        if (e.ctrlKey && e.keyCode == 83) return false;
        // Ctrl+C / Ctrl+X
        if (e.ctrlKey && (e.keyCode == 67 || e.keyCode == 88)) return false;
};

// Disable text selection and drag
document.addEventListener('selectstart', event => event.preventDefault());
document.addEventListener('dragstart', event => event.preventDefault());

// Optional: Block copy event
document.addEventListener('copy', event => {
            event.preventDefault();
        alert("Copying is disabled!");
});
