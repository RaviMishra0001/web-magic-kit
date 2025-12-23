    document.addEventListener("DOMContentLoaded", function () {
        const loader = document.getElementById("loader");
    const blurLayer = document.getElementById("blurLayer");

    if (!loader || !blurLayer) return;

    let loaderHidden = false;
    const minLoaderTime = 1000; // कम से कम 2 seconds loader दिखेगा
    const startTime = Date.now();

    // Loader दिखाओ (हर page load पर)
    loader.classList.add("show");
    blurLayer.classList.add("show");

    // Page पूरी तरह load होने पर loader hide करो
    window.addEventListener("load", function () {
            const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoaderTime - elapsedTime);

            setTimeout(() => {
                if (!loaderHidden) {
        loader.classList.remove("show");
    blurLayer.classList.remove("show");
    loaderHidden = true;
                }
            }, remainingTime);
        });

    // Link click पर (navigation शुरू होते ही loader show)
    document.addEventListener("click", function (e) {
            const link = e.target.closest("a");
    if (link && link.href && !link.target && !link.href.includes("#") && !link.href.includes("javascript:")) {
        loader.classList.add("show");
    blurLayer.classList.add("show");
    loaderHidden = false;
            }
        });

        // Form submit पर भी loader show
        document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", () => {
            loader.classList.add("show");
            blurLayer.classList.add("show");
            loaderHidden = false;
        });
        });
    });
