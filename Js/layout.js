        document.addEventListener("DOMContentLoaded", () => {
            const topbar = document.querySelector('.topbar');

            // Create hamburger button
            const hamburger = document.createElement('div');
            hamburger.classList.add('hamburger-toggle');
            hamburger.innerHTML = `
                                                                                                                                                <span></span>
                                                                                                                                                <span></span>
                                                                                                                                                <span></span>
                                                                                                                                              `;

            // Append only if viewport ≤ 768px
            const insertHamburger = () => {
                if (window.innerWidth <= 768 && !topbar.contains(hamburger)) {
                    topbar.insertBefore(hamburger, topbar.firstChild);
                } else if (window.innerWidth > 768 && topbar.contains(hamburger)) {
                    topbar.classList.remove('mobile-menu-open');
                    hamburger.remove();
                }
            };

            // Initial check and resize handler
            insertHamburger();
            window.addEventListener('resize', insertHamburger);

            // Toggle handler
            hamburger.addEventListener('click', () => {
                topbar.classList.toggle('mobile-menu-open');
            });
        });

    function checkConnection() {
        if (!navigator.onLine) {
            // Agar internet nahi hai to Offline page dikhado
            window.location.href = '@Url.Action("Offline", "Account")';
        }
    }

    // Page load hote hi check kare
    window.addEventListener("load", checkConnection);

    // Jab internet chala jaye (offline ho jaye)
    window.addEventListener("offline", checkConnection);

window.addEventListener("load", function () {
            document.getElementById("pageLoader").style.display = "none";
        });

// Toggle Color Picker Visibility
        function toggleColorPicker() {
            const picker = document.getElementById('dynamicColorPicker');
            picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
            if (picker.style.display === 'block') {
                picker.click(); // Auto-open native color picker on mobile/desktop
            }
        }

        // Calculate contrast color (black or white) using YIQ formula
        function getContrastYIQ(hex) {
            hex = hex.replace("#", "");
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join(''); // Expand #fff → #ffffff
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
                                                .btn-outline-light,
                                                .btn-outline-light:hover,
                                                .btn-outline-light:focus {
                                                    color: ${textColor} !important;
                                                    border-color: ${borderColor} !important;
                                                }
                                                .swiper-pagination-bullet-active {
                                                    background: ${isLight ? "#000000" : "var(--dynamic-primary)"} !important;
                                                }
                                                .section-title h2:before,
                                                .section-title h2::after {
                                                    background: ${borderColor} !important;
                                                }

                                                .btnClear-3d {

                                                        border: 1px solid  ${borderColor} !important;
                                                        border-color: ${borderColor} !important;
                                                        border-width: 1px !important;
                                                        color: ${isLight ? "#000000" : "var(--dynamic-header-bg)"} !important;
                                                        box-shadow: 0 6px 0  ${borderColor} !important;
                                                }
                                                .btnSubmit-3d {

                                                        border: 1px solid ${borderColor} !important;
                                                        border-color:${borderColor} !important;
                                                        border-width: 1px !important;
                                                        box-shadow: 0 6px 0 ${borderColor} !important;
                                                        color: ${isLight ? "#000000" : "var(--dynamic-header-bg)"} !important;
                                                }
                                                .btnClear-3d:hover {
                                                        top: 2px;
                                                        box-shadow: 0 4px 0 ${borderColor} !important;
                                                        transform: scale(1.03);
                                                        color: white !important;
                                                        background-color: ${borderColor} !important;
                                                }
                                                .btnSubmit-3d:hover {
                                                        top: 2px;
                                                        box-shadow: 0 4px 0 ${borderColor} !important;
                                                        transform: scale(1.03);
                                                        color: white !important;
                                                        background-color: ${borderColor} !important;
                                                }
                                            `;
        }

        // On Color Change
        document.getElementById('dynamicColorPicker').addEventListener('input', function (e) {
            const color = e.target.value.toLowerCase();
            const textColor = getContrastYIQ(color);
            const headerBg = color + "CC"; // ~80% opacity
            const bodyBg = color + "20";   // Soft body tint
            const cardBg = color + "10";

            // Update CSS Variables
            document.documentElement.style.setProperty('--dynamic-primary', color);
            document.documentElement.style.setProperty('--dynamic-text', textColor);
            document.documentElement.style.setProperty('--dynamic-header-bg', headerBg);
            document.documentElement.style.setProperty('--dynamic-header-text', textColor);
            document.documentElement.style.setProperty('--dynamic-body-bg', bodyBg);
            document.documentElement.style.setProperty('--dynamic-card-bg', cardBg);

            // Update floating theme button
            const themeBtn = document.querySelector('.theme-sticky');
            if (themeBtn) {
                themeBtn.style.background = color;
                themeBtn.style.color = textColor;
            }

            // Force update key elements (headers, sidebars, etc.)
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
            const picker = document.getElementById('dynamicColorPicker');
            picker.value = saved;

            // Trigger the input event to apply everything
            picker.dispatchEvent(new Event('input'));
        });

$(document).ready(function () {
            $(".menu-btn").on("click", function () {
                // Sidebar toggle
                $(".sidebar").toggleClass("open");

                // Icon toggle
                if ($(".sidebar").hasClass("open")) {
                    $("#menuLottieUp").hide();
                    $("#menuLottieDown").show();
                } else {
                    $("#menuLottieDown").hide();
                    $("#menuLottieUp").show();
                }
            });
        });

// Prevent resubmission on page refresh
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }

$('#logoutBtn').on('click', function(e) {
    e.preventDefault();

    Notiflix.Confirm.show(
        'Confirm Logout',
        'Are you sure you want to logout?',
        'Yes',
        'No',
        function() {
            window.location.href = '@Url.Action("Logout", "Account")';
        },
        function() {
            // Cancel clicked — do nothing
        }
    );
});

