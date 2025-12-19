        document.addEventListener('DOMContentLoaded', () => {
            // Form and Elements
            const form = document.getElementById('signatureForm');
        const submitButton = document.getElementById('submitButton');
        const fileInput = document.getElementById('PdfFile');
        const fileInfo = document.getElementById('fileInfo');
        const dropArea = document.getElementById('dropArea');

        // Validate Individual Field
        function validateField(input) {
                if (input.type === 'file') {
                    if (!input.files.length || !isValidFile(input.files[0])) {
            input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        return false;
                    }
                } else if (!input.value.trim()) {
            input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        return false;
                }
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        return true;
            }

        // File Validation Function
        function isValidFile(file) {
                const maxFileSize = 10 * 1024 * 1024; // 10MB
        return file && file.type === 'application/pdf' && file.size <= maxFileSize;
            }

        // Check Form Completion
        function checkFormFilled() {
            let isValid = true;
        const mode = document.getElementById('Mode').value;

                // Validate all always-required fields (excluding Position and Keyword fields)
                form.querySelectorAll('.required:not(.required-position):not(.required-key)').forEach(input => {
                    if (!validateField(input)) {
            isValid = false;
                    }
                });

        // Validate Position field if in Position mode
        if (mode === 'Position') {
            form.querySelectorAll('.required-position').forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
                }

        // Validate Keyword fields if in Keyword mode
        if (mode === 'Keyword') {
            form.querySelectorAll('.required-key').forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
                }

        // Enable/disable submit button
        if (isValid) {
            submitButton.classList.remove('disabled');
        submitButton.style.display = 'block';
                } else {
            submitButton.classList.add('disabled');
        submitButton.style.display = 'none';
                }
            }

            // Form Submission Validation
            form.addEventListener('submit', (e) => {
            let isValid = true;
        const mode = document.getElementById('Mode').value;

                // Validate always-required fields
                form.querySelectorAll('.required:not(.required-position):not(.required-key)').forEach(input => {
                    if (!validateField(input)) {
            isValid = false;
                    }
                });

        // Validate Position field if in Position mode
        if (mode === 'Position') {
            form.querySelectorAll('.required-position').forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
                }

        // Validate Keyword fields if in Keyword mode
        if (mode === 'Keyword') {
            form.querySelectorAll('.required-key').forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
                }

        if (!isValid) {
            e.preventDefault();
        e.stopPropagation();
                }
        form.classList.add('was-validated');
            });

            // Card Selection and Mode Switching
            document.querySelectorAll('.card-select').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.getAttribute('data-mode');
                document.getElementById('Mode').value = mode;
                document.getElementById('selectedMode').textContent = mode;

                // Toggle visibility and required attribute for Position and Keyword fields
                const positionField = document.getElementById('positionField');
                const keywordField = document.getElementById('keywordFields');
                if (positionField) {
                    positionField.classList.toggle('d-none', mode !== 'Position');
                    positionField.querySelectorAll('.required-position').forEach(input => {
                        input.required = (mode === 'Position');
                    });
                }
                if (keywordField) {
                    keywordField.classList.toggle('d-none', mode !== 'Keyword');
                    keywordField.querySelectorAll('.required-key').forEach(input => {
                        input.required = (mode === 'Keyword');
                    });
                }

                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('formModal'));
                modal.show();

                // Attach input listeners
                document.querySelectorAll('#signatureForm input, #signatureForm select').forEach(input => {
                    input.removeEventListener('input', checkFormFilled);
                    input.removeEventListener('change', checkFormFilled);
                    input.addEventListener('input', () => {
                        validateField(input);
                        checkFormFilled();
                    });
                    if (input.type === 'file') {
                        input.addEventListener('change', () => {
                            validateField(input);
                            checkFormFilled();
                        });
                    }
                });

                // Initial form check
                checkFormFilled();
            });
            });

        // File Upload Handling
        window.showFileInfo = function (input) {
                if (input.files.length) {
                    const file = input.files[0];
        if (isValidFile(file)) {
            fileInfo.textContent = `✅ ${file.name}`;
        fileInput.classList.remove('is-invalid');
        fileInput.classList.add('is-valid');
                    } else {
            fileInfo.textContent = file.type !== 'application/pdf' ? '❌ Please upload a valid PDF file.' : '❌ File size exceeds 10MB.';
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

        window.handleDrop = function (e) {
            e.preventDefault();
        dropArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
                    const file = e.dataTransfer.files[0];
        if (isValidFile(file)) {
            fileInput.files = e.dataTransfer.files;
        fileInfo.textContent = `✅ ${file.name}`;
        fileInput.classList.remove('is-invalid');
        fileInput.classList.add('is-valid');
                    } else {
            fileInfo.textContent = file.type !== 'application/pdf' ? '❌ Please upload a valid PDF file.' : '❌ File size exceeds 10MB.';
        fileInput.classList.add('is-invalid');
        fileInput.classList.remove('is-valid');
                    }
        checkFormFilled();
                }
            };

            dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
        dropArea.classList.add('dragover');
            });

            dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('dragover');
            });

        // Form Reset
        window.resetForm = function () {
            submitButton.style.display = 'none';
        form.reset();
        form.classList.remove('was-validated');
        fileInfo.textContent = '📂 Drag & Drop PDF or Click to Upload';
        submitButton.classList.add('disabled');
                document.querySelectorAll('#signatureForm input, #signatureForm select').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
                });
        checkFormFilled();
            };

        // PDF Preview Modal
        const pdfBase64 = '@Html.Raw(TempData["pdfBase64"])';
        if (pdfBase64) {
                try {
                    const pdfIframe = document.getElementById('pdfIframe');
        const downloadLink = document.getElementById('downloadLink');
        const pdfError = document.getElementById('pdfError');
        const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;
        pdfIframe.src = pdfDataUri;
        downloadLink.href = pdfDataUri;
                    pdfIframe.onerror = () => {
            pdfError.classList.remove('d-none');
        pdfIframe.style.display = 'none';
                    };
        const pdfModal = new bootstrap.Modal(document.getElementById('pdfModal'));
        pdfModal.show();
                } catch (e) {
            console.error('Error loading PDF preview:', e);
        document.getElementById('pdfError').classList.remove('d-none');
                }
            }
        });

