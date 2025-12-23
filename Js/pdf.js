    $(document).ready(function () {
        $('#myTable').DataTable({
            pageLength: 5,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
            responsive: true, // Enables responsive behavior
            dom: '<"top-controls"lf>rt<"bottom-area"ip>',
            language: {
                lengthMenu: "_MENU_",
                search: "",
                searchPlaceholder: "Search records...",
                info: "Showing _START_–_END_ of _TOTAL_ entries",
                paginate: {
                    next: "Next",
                    previous: "Prev"
                }
            }
        });
    });


    function viewPdfFull(pdfUrl) {
        if (!pdfUrl || pdfUrl.trim() === "") {
        alert("PDF file not found!");
    return;
        }
    const viewer = document.getElementById("pdfFullScreen");
    const iframe = document.getElementById("pdfFrameFull");
    iframe.src = pdfUrl;
    viewer.style.display = "block";
    }

    function closePdfFull() {
        const viewer = document.getElementById("pdfFullScreen");
    const iframe = document.getElementById("pdfFrameFull");
    viewer.style.display = "none";
        setTimeout(() => {iframe.src = ""; }, 300);
    }
