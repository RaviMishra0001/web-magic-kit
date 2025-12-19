// pdf-signature.js - Fully working external JS file for PDF signature preview & placement

document.addEventListener('DOMContentLoaded', () => {
    // Server-passed data
    const pdfUrl = window.pdfUrl || '';
    const applySignatureUrl = window.applySignatureUrl || '/Pdf/ApplySignature';  // Fallback if needed

    if (!pdfUrl) {
        console.error('PDF URL not provided from server.');
        return;
    }

    // Elements
    const canvas = document.getElementById('pdfCanvas');
    const signaturePreview = document.getElementById('signaturePreview');
    const container = document.getElementById('pdfContainer');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const signBtn = document.getElementById('signBtn');

    if (!canvas || !container || !signaturePreview || !prevBtn || !nextBtn || !signBtn) {
        console.error('Required elements missing in DOM.');
        return;
    }

    const context = canvas.getContext('2d');
    let pdfDoc = null;
    let pageNum = 1;
    let signaturePosition = null;
    let currentScale = 1;
    let canvasOffset = { x: 0, y: 0 };

    // Load PDF
    pdfjsLib.getDocument(pdfUrl).promise
        .then(pdf => {
            pdfDoc = pdf;
            renderPage(pageNum);
        })
        .catch(err => {
            console.error('Failed to load PDF:', err);
            alert('Failed to load PDF: ' + err.message);
        });

    // Render PDF Page
    async function renderPage(num) {
        if (!pdfDoc || num < 1 || num > pdfDoc.numPages) return;

        pageNum = num;
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1 });

        // Fit to container
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const scaleX = containerWidth / viewport.width;
        const scaleY = containerHeight / viewport.height;
        currentScale = Math.min(scaleX, scaleY);

        const scaledViewport = page.getViewport({ scale: currentScale });
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Calculate offset (for absolute positioning of preview)
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        canvasOffset.x = canvasRect.left - containerRect.left + container.scrollLeft;
        canvasOffset.y = canvasRect.top - containerRect.top + container.scrollTop;

        // Reset scroll
        container.scrollTop = 0;
        container.scrollLeft = 0;

        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };

        await page.render(renderContext).promise;
        signaturePreview.style.display = 'none';  // Hide preview on page change
    }

    // Page Navigation
    prevBtn.addEventListener('click', () => {
        if (pageNum > 1) renderPage(pageNum - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (pdfDoc && pageNum < pdfDoc.numPages) renderPage(pageNum + 1);
    });

    // Click to Place Signature
    canvas.addEventListener('click', e => {
        if (!pdfDoc) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Map to PDF coordinates (PDF origin: bottom-left)
        signaturePosition = {
            X: clickX / currentScale,
            Y: (canvas.height / currentScale) - (clickY / currentScale)
        };

        // Position preview (bottom-left at click point)
        const previewX = (signaturePosition.X * currentScale) + canvasOffset.x - container.scrollLeft;
        const previewY = (canvas.height - (signaturePosition.Y * currentScale)) + canvasOffset.y - container.scrollTop;

        signaturePreview.style.left = `${previewX}px`;
        signaturePreview.style.top = `${previewY}px`;
        signaturePreview.style.width = `${150 * currentScale}px`;
        signaturePreview.style.height = `${30 * currentScale}px`;
        signaturePreview.style.display = 'block';

        console.log(`Click: (${clickX}, ${clickY}), PDF: (${signaturePosition.X}, ${signaturePosition.Y}), Preview: (${previewX}, ${previewY})`);
    });

    // Apply Signature Button
    signBtn.addEventListener('click', async () => {
        if (!signaturePosition) {
            alert('Please click on the PDF to choose a signature position.');
            return;
        }

        try {
            const response = await fetch(applySignatureUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    X: signaturePosition.X - 30,  // Adjust offset if needed
                    Y: signaturePosition.Y - 50,
                    Page: pageNum
                })
            });

            const res = await response.json();
            if (res.success) {
                window.open(res.url, '_blank');
            } else {
                alert('Error: ' + res.message);
            }
        } catch (err) {
            console.error('Signature apply failed:', err);
            alert('Request failed: ' + err.message);
        }
    });
});