
        window.addEventListener("load", function () {
            document.getElementById("pageLoader").style.display = "none";
        });
    

        // Toggle Color Picker Visibility
        function toggleColorPicker() {
            const picker = document.getElementById('dynamicColorPicker');
            picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
            if (picker.style.display === 'block') picker.click(); // Auto-open picker
        }

        // Calculate contrast color (black or white)
        function getContrastYIQ(hex) {
            hex = hex.replace("#", "");
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? "#000000" : "#ffffff";
        }
        // Check if the primary color is very light (including white)
        function isLightColor(hex) {
            hex = hex.replace("#", "");
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            if (hex === "ffffff") return true;
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return yiq >= 200; // High threshold for "very light"
        }

        // Enhanced: Fix button and accent text colors in light themes
        function updateLightThemeFixes(isLight) {
            const textColor = isLight ? "#000000" : "var(--dynamic-text)";
            const borderColor = isLight ? "#000000" : "var(--dynamic-primary)";

            // Inject or update dynamic CSS for light theme compatibility
            const styleId = 'light-theme-fixes';
            let style = document.getElementById(styleId);
            if (!style) {
                style = document.createElement('style');
                style.id = styleId;
                document.head.appendChild(style);
            }

            style.textContent = `
                        /* Force readable text on light-themed buttons and accents */
                        #sidebar h1, .card-hover div p.text-gray-500, .text-xl{
                            color: ${isLight ? "#000000" : "var(--dynamic-header-bg)"} !important;
                        }
                       .custom-navmenu-item{
                            color: ${isLight ? "#000000" : "var(--dynamic-header-bg)"} !important;
                            margin-bottom: 0 !important;
                            padding-bottom: 6px !important;
                            font-size: 18px;
                            font-weight: 500;
                        }
                        .custom-navmenu-item.active, .custom-bg-gradient{
                            color: ${isLight ? "#000000" : "var(--header-text)"} !important;
                            border-color:${borderColor} !important;
                            border-width: 1px !important;
                            box-shadow: 0 5px 0 ${borderColor} !important;
                            color: ${isLight ? "#000000" : "var(--header-text)"} !important;
                            padding: 10px 1rem !important;

                            }
                       .fixed-sm-screenheading, .custom-navmenu-item.active i,
                        .fixed-sm-screenText .user-text p{
                            color: ${isLight ? "#000000" : "var(--header-text)"} !important;
                        }

                        .custom-navmenu-item:hover {
                                top: 2px;
                                box-shadow: 0 4px 0 ${borderColor} !important;
                                transform: scale(1.03);
                                color: white !important;
                                background-color: ${borderColor} !important;
                                padding: 10px 1rem !important;
                        }
                    `;
        }
        // On Color Change
        document.getElementById('dynamicColorPicker').addEventListener('input', function (e) {
            const color = e.target.value;
            const textColor = getContrastYIQ(color);
            const headerBg = color + "CC";  // 80% opacity

            const bodyBg = color + "20";       // Soft tint for body (~9% opacity)
            const cardBg = color + "10";

            // Update CSS Variables
            document.documentElement.style.setProperty('--dynamic-primary', color);
            document.documentElement.style.setProperty('--dynamic-text', textColor);
            document.documentElement.style.setProperty('--dynamic-header-bg', headerBg);
            document.documentElement.style.setProperty('--dynamic-header-text', textColor);
            document.documentElement.style.setProperty('--dynamic-body-bg', bodyBg);
            document.documentElement.style.setProperty('--dynamic-card-bg', cardBg);

           
            const themeBtn = document.querySelector('.theme-sticky');
            if (themeBtn) {
                themeBtn.style.background = color;
                themeBtn.style.color = textColor;
            }
            // Force update key elements
            document.querySelectorAll('.topbar, .sidebar, .dropdown-menu.box').forEach(el => {
                el.style.background = headerBg;
                el.style.color = textColor;
            });

            document.querySelectorAll('.box .border:before').forEach(el => {
                el.style.background = color;
            });

            document.querySelectorAll('.sticky_icons_group .icon_container').forEach(el => {
                el.style.background = color;
            });
            // Apply light theme fixes if needed
            updateLightThemeFixes(isLightColor(color));

            // Save to localStorage
            localStorage.setItem('userThemeColor', color);
        });

        // Load saved color on page load
        window.addEventListener('load', () => {
            const saved = localStorage.getItem('userThemeColor') || '#98C69A';
            document.getElementById('dynamicColorPicker').value = saved;

            // Trigger input event to apply saved color
            document.getElementById('dynamicColorPicker').dispatchEvent(new Event('input'));
        });

        // Sidebar Toggle (Mobile)
        document.getElementById("openSidebar")?.addEventListener("click", () => {
            document.getElementById("sidebar").classList.add("show");
            document.getElementById("overlay").classList.add("show");
        });
        document.getElementById("closeSidebar")?.addEventListener("click", () => {
            document.getElementById("sidebar").classList.remove("show");
            document.getElementById("overlay").classList.remove("show");
        });
        document.getElementById("overlay")?.addEventListener("click", () => {
            document.getElementById("sidebar").classList.remove("show");
            document.getElementById("overlay").classList.remove("show");
        });
        // Highlight active menu item based on current URL
        document.addEventListener("DOMContentLoaded", function () {
            const currentPath = window.location.pathname.toLowerCase();
            const menuItems = document.querySelectorAll(".custom-navmenu-item");

            menuItems.forEach(item => {
                const href = item.getAttribute("href");

                // Special case for home/dashboard (sometimes root or index)
                if (href && href !== "#" && currentPath.includes(href.toLowerCase())) {
                    item.classList.add("active");
                }

                // Handle exact match for root or dashboard
                if ((currentPath === "/" || currentPath.includes("dashboard")) &&
                    href && href.includes("Dashboard")) {
                    item.classList.add("active");
                }
            });

            // Also handle click to update active state (for SPA-like behavior or future use)
            menuItems.forEach(item => {
                item.addEventListener("click", function () {
                    menuItems.forEach(i => i.classList.remove("active"));
                    this.classList.add("active");
                });
            });
        });


        // LOGOUT CONFIRM
        document.getElementById('logoutBtn').addEventListener('click', function (e) {
            e.preventDefault();
            Notiflix.Confirm.show(
                "Confirm Logout",
                "Are you sure you want to logout?",
                "Yes", "No",
                function () {
                    window.location.href = '@Url.Action("Logout", "Account")';
                }
            );
        });
