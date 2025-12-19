
        // Automatically switch to login or signup based on URL parameter
        window.onload = function () {
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');

            // Set checkbox based on mode
            if (mode === 'login') {
                document.getElementById('chk').checked = true;
            } else if (mode === 'signup') {
                document.getElementById('chk').checked = false;
            }
        };
    
        window.addEventListener("load", function () {
            document.getElementById("pageLoader").style.display = "none";
        });
    
    
        $(document).ready(function () {
            $('.toggle-password').click(function () {
                const passwordField = $(this).siblings('input');
                const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                passwordField.attr('type', type);
                $(this).toggleClass('fa-eye fa-eye-slash');
            });
        });
   
  