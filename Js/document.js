  function toggleCollapsible(element) {
            element.classList.toggle("active");
            const content = element.nextElementSibling;
            content.classList.toggle("active");
        }

        function copyCode(button) {
            const code = button.parentElement.nextElementSibling.textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = "Copied!";
                setTimeout(() => button.textContent = "Copy", 2000);
            }).catch(() => {
                alert("Copy failed!");
            });
        }
