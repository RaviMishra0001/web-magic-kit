        // Font-based signature
        const preview = document.getElementById("fontSignaturePreview");
        const nameInput = document.getElementById("typedName");
        const fontSelector = document.getElementById("fontSelector");
        const fontScroller = document.getElementById("fontScroller");

        // List of fonts for scroller (matches dropdown)
        const fonts = [
            "Great Vibes", "Pacifico", "Dancing Script", "Satisfy", "Sacramento",
            "Alex Brush", "Allura", "Bad Script", "Courgette", "Cookie",
            "Parisienne", "Tangerine", "Homemade Apple", "Mr Dafoe", "Kaushan Script",
            "Yellowtail", "Marck Script", "Clicker Script", "Herr Von Muellerhoff", "Zeyada",
            "Italianno", "Merienda", "Mogra", "Gochi Hand", "Patrick Hand",
            "Neucha", "Indie Flower", "Gloria Hallelujah", "Reenie Beanie", "Caveat",
            "Cedarville Cursive", "Qwigley", "Mansalva", "Short Stack", "Rock Salt",
            "Shadows Into Light", "Give You Glory", "Just Another Hand"
        ];

        // Populate font scroller
        function populateFontScroller() {
            // Create two sets of font spans for seamless looping
            const content = fonts.map(font => `<span style="font-family: '${font}', cursive;">${font.toLowerCase()}</span>`).join('');
            fontScroller.innerHTML = content + content; // Duplicate for continuous scroll
        }

        populateFontScroller();

        nameInput.addEventListener("input", updateSignature);
        fontSelector.addEventListener("change", updateSignature);

        function updateSignature() {
            const name = nameInput.value;
            const font = fontSelector.value || 'Great Vibes';
            preview.style.fontFamily = `'${font}', cursive`;
            preview.textContent = name || "Your signature";
        }

        function downloadFontSignature() {
            if (!fontSelector.value) {
                alert("Please select a font before downloading.");
                return;
            }
            const canvas = document.createElement("canvas");
            canvas.width = 600;
            canvas.height = 150;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `48px '${fontSelector.value}', cursive`;
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(nameInput.value || "Signature", canvas.width / 2, canvas.height / 2);
            const link = document.createElement("a");
            link.download = "typed-signature.png";
            link.href = canvas.toDataURL();
            link.click();
        }

        // Manual canvas signature
        const canvas = document.getElementById("manualCanvas");
        const ctx = canvas.getContext("2d");
        let drawing = false;

        canvas.addEventListener("mousedown", (e) => {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });
        canvas.addEventListener("mouseup", () => drawing = false);
        canvas.addEventListener("mouseout", () => drawing = false);
        canvas.addEventListener("mousemove", draw);

        // Touch support for mobile devices
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            drawing = true;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            ctx.beginPath();
            ctx.moveTo(x, y);
        });
        canvas.addEventListener("touchend", () => drawing = false);
        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            if (!drawing) return;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#000";
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        });

        function draw(e) {
            if (!drawing) return;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#000";
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
        }

        function downloadCanvas() {
            const link = document.createElement("a");
            link.download = "manual-signature.png";
            link.href = canvas.toDataURL();
            link.click();
        }

        // Modal functionality
        const modal = document.getElementById("signatureModal");
        const modalFontPreview = document.getElementById("modalFontPreview");
        const modalCanvasPreview = document.getElementById("modalCanvasPreview");
        const modalTitle = document.getElementById("modalTitle");

        function openModal(type) {
            modal.style.display = "flex";
            if (type === "font") {
                if (!fontSelector.value) {
                    alert("Please select a font to preview.");
                    return;
                }
                modalTitle.textContent = "Font Style Signature Preview";
                modalFontPreview.style.display = "flex";
                modalCanvasPreview.style.display = "none";
                modalFontPreview.style.fontFamily = `'${fontSelector.value}', cursive`;
                modalFontPreview.style.fontSize = "32px";
                modalFontPreview.textContent = nameInput.value || "Your signature";
            } else if (type === "canvas") {
                modalTitle.textContent = "Manual Signature Preview";
                modalFontPreview.style.display = "none";
                modalCanvasPreview.style.display = "block";
                const modalCtx = modalCanvasPreview.getContext("2d");
                modalCtx.clearRect(0, 0, modalCanvasPreview.width, modalCanvasPreview.height);
                modalCtx.fillStyle = "#fff";
                modalCtx.fillRect(0, 0, modalCanvasPreview.width, modalCanvasPreview.height);
                modalCtx.drawImage(canvas, 0, 0, modalCanvasPreview.width, modalCanvasPreview.height);
            }
        }

        function closeModal() {
            modal.style.display = "none";
            modalFontPreview.style.display = "none";
            modalCanvasPreview.style.display = "none";
        }

        // Close modal when clicking outside
        window.onclick = function (event) {
            if (event.target === modal) {
                closeModal();
            }
        };

        // Initialize signature preview with default font
        updateSignature();
