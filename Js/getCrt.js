// certificate.js - Fully working external JS file

$(function () {
    // Bootstrap Tooltip Initialize
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Toggle Submit Button based on required fields
    function toggleSubmit() {
        const allFilled = $(".required").toArray()
            .every(input => $(input).val().trim().length > 0);

        // Agar button ko hide/show karna hai (class 'hidden' use kar rahe ho)
        $("#submitBtn").toggleClass("hidden", !allFilled);

        // Ya disabled karna chahte ho to:
        // $("#submitBtn").prop("disabled", !allFilled);
    }

    // On input change
    $(".required").on("input", toggleSubmit);

    // Initial check
    toggleSubmit();

    // Clear Button
    $("#clearBtn").on("click", function () {
        $(".required").val("");
        toggleSubmit();
    });
});

// Popup show on page load
window.onload = function () {
    // Data from server (passed safely via window variables)
    const data = window.certData;
    const msg = window.popupMessage || "";

    if (data && Array.isArray(data) && data.length > 0) {
        const cert = data[0];

        document.getElementById("popup-msg").innerText = msg;
        document.getElementById("cert-name").innerText = cert.CertificateName || "Certificate";
        document.getElementById("cert-key").innerText = cert.CertificateAccessKey || "N/A";

        // Show popup
        document.getElementById("popup").style.display = "flex";
    }
};

// Download Certificate as .txt file
function downloadCert() {
    const name = document.getElementById("cert-name").innerText.trim() || "certificate";
    const key = document.getElementById("cert-key").innerText.trim();

    const content = `Certificate: ${name}\nAccess Key: ${key}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);
}

// Close Popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}