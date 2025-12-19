// signature.js - Fully working external JavaScript file (December 2025)

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('signatureForm');
    const submitButton = document.getElementById('submitButton');
    const fileInput = document.getElementById('PdfFile');
    const fileInfo = document.getElementById('fileInfo');
    const dropArea = document.getElementById('dropArea');

    if (!form || !submitButton || !fileInput || !fileInfo || !dropArea) {
        console.error("One or more required elements not found.");
        return;
    }

    // File Validation
    function isValidFile(file) {
        if (!file) return false;
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        return file.type === 'application/pdf' && file.size <= maxFileSize;
    }

    // Validate Single Field
    function validateField(input) {
        let valid = true;

        if (input.type === 'file') {
            valid = input.files.length > 0 && isValidFile(input.files[0]);
        } else {
            valid = input.value.trim() !== '';
        }

        input.classList.toggle('is-valid', valid);
        input.classList.toggle('is-invalid', !valid);
        return valid;
    }

    // Check if form is completely filled based on mode
    function checkFormFilled() {
        const mode = document.getElementById('Mode')?.value || '';

        let isValid = true;

        // Always required fields
        form.querySelectorAll('.required:not(.required-position):not(.required-key)').forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        // Position mode fields
        if (mode === 'Position') {
            form.querySelectorAll('.required-position').forEach(input => {
                if (!validateField(input)) isValid = false;
            });
        }

        // Keyword mode fields
        if (mode === 'Keyword') {
            form.querySelectorAll('.required-key').forEach(input => {
                if (!validateField(input)) isValid = false;
            });
        }

        // Update submit button
        if (isValid) {
            submitButton.classList.remove('disabled');
            submitButton.style.display = 'block';
        } else {
            submitButton.classList.add('disabled');
            submitButton.style.display = 'none';
        }
    }

    // Form Submit Validation
    form.addEventListener('submit', (e) => {
        let isValid = true;
        const mode = document.getElementById('Mode')?.value || '';

        form.querySelectorAll('.required:not(.required-position):not(.required-key)').forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (mode === 'Position') {
            form.querySelectorAll('.required-position').forEach(input => {
                if (!validateField(input)) isValid = false;
            });
        }

        if (mode === 'Keyword') {
            form.querySelectorAll('.required-key').forEach(input => {
                if (!validateField(input)) isValid = false;
            });
        }

        if (!isValid) {
            e.preventDefault();
            e.stopPropagation();
        }

        form.classList.add('was-validated');
    });

    // Card Selection - Mode Switch
    document.querySelectorAll('.card-select').forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.getAttribute('data-mode');
            const modeInput = document.getElementById('Mode');
            const selectedModeText = document.getElementById('selectedMode');

            if (modeInput) modeInput.value = mode;
            if (selectedModeText) selectedModeText.textContent = mode;

            const positionField = document.getElementById('positionField');
            const keywordField = document.getElementById('keywordFields');

            // Toggle Position fields
            if (positionField) {
                positionField.classList.toggle('d-none', mode !== 'Position');
                positionField.querySelectorAll('.required-position').forEach(input => {
                    input.required = (mode === 'Position');
                });
            }

            // Toggle Keyword fields
            if (keywordField) {
                keywordField.classList.toggle('d-none', mode !== 'Keyword');
                keywordField.querySelectorAll('.required-key').forEach(input => {
                    input.required = (mode === 'Keyword');
                });
            }

            // Show modal
            const modalElement = document.getElementById('formModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }

            // Attach real-time validation listeners (only once)
            form.querySelectorAll('input, select').forEach(input => {
                input.removeEventListener('input', checkFormFilled);
                input.removeEventListener('change', checkFormFilled);

                input.addEventListener('input', checkFormFilled);
                input.addEventListener('change', checkFormFilled); // for file/select
            });

            // Initial check
            checkFormFilled();
        });
    });

    // File Info Display
    window.showFileInfo = function (input) {
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (isValidFile(file)) {
                fileInfo.textContent = `✅ ${file.name}`;
                fileInput.classList.remove('is-invalid');
                fileInput.classList.add('is-valid');
            } else {
                fileInfo.textContent = file.type !== 'application/pdf'
                    ? '❌ Please upload a valid PDF file.'
                    : '❌ File size exceeds 10MB.';
                fileInput.classList.add('is-invalid');
                fileInput.classList.remove('is-valid');
            }
        } else {
            fileInfo.textContent = '❌ No file selected.';
            fileInput.classList.add('is-invalid');
            fileInput.classList.remove('is-valid');
        }
        checkFormFilled();
    };

    // Drag & Drop Handling
    window.handleDrop = function (e) {
        e.preventDefault();
        dropArea.classList.remove('dragover');

        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            fileInput.files = e.dataTransfer.files;
            window.showFileInfo(fileInput);
        }
    };

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    // Reset Form Function
    window.resetForm = function () {
        form.reset();
        form.classList.remove('was-validated');
        fileInfo.textContent = '📂 Drag & Drop PDF or Click to Upload';
        submitButton.style.display = 'none';
        submitButton.classList.add('disabled');

        form.querySelectorAll('input, select').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });

        checkFormFilled();
    };

    // PDF Preview Modal - Safe for external JS
    const pdfBase64 = window.pdfBase64Data || "";

    if (pdfBase64.trim() !== "") {
        try {
            const pdfIframe = document.getElementById('pdfIframe');
            const downloadLink = document.getElementById('downloadLink');
            const pdfError = document.getElementById('pdfError');
            const pdfModalElement = document.getElementById('pdfModal');

            if (!pdfIframe || !downloadLink || !pdfModalElement) {
                console.warn("PDF preview elements missing.");
                return;
            }

            const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

            pdfIframe.src = pdfDataUri;
            downloadLink.href = pdfDataUri;
            downloadLink.download = "signed-document.pdf";

            pdfIframe.onerror = () => {
                pdfError?.classList.remove('d-none');
                pdfIframe.style.display = 'none';
            };

            const pdfModal = new bootstrap.Modal(pdfModalElement);
            pdfModal.show();

        } catch (e) {
            console.error('Error loading PDF preview:', e);
            const pdfError = document.getElementById('pdfError');
            if (pdfError) pdfError.classList.remove('d-none');
        }
    }
});