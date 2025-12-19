        document.addEventListener('DOMContentLoaded', function () {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
        });


        document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('certForm');
            const inputs = form.querySelectorAll('input[required]');
            const submitBtn = form.querySelector('button[type="submit"]');

            // Initially hide the submit button
            submitBtn.style.display = 'none';

            function checkFormFilled() {
                let allFilled = true;
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        allFilled = false;
                    }
                });

                submitBtn.style.display = allFilled ? 'block' : 'none';
            }

            // Check on input change
            inputs.forEach(input => {
                input.addEventListener('input', checkFormFilled);
            });

            // Also check once on load
            checkFormFilled();
        });


        $(function () {
            const dropZone = $('#dropZone');
            const fileInput = $('#PdfFile');
            const errorSpan = $('#errorPdfFile');
            const toastContainer = $('#toastContainer');
            const dropZoneText = $('#dropZoneText');

            function showToast(message) {
                const toast = $('<div class="toast" role="alert" aria-live="assertive"></div>').text(message);
                toastContainer.append(toast);
                setTimeout(() => toast.fadeOut(300, () => toast.remove()), 3500);
            }

            function showEmoji(emoji) {
                $("#emojiPopup").text(emoji).fadeIn();
                setTimeout(() => $("#emojiPopup").fadeOut(), 2500);
            }
           
            function validateFile(file) {
                const allowedExtensions = ['.pfx', '.jpg', '.jpeg', '.png'];
                const fileName = file.name.toLowerCase();

                const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

                if (!isValid) {
                    showToast('❌ Only .pfx, .jpg, .jpeg, or .png files are allowed!');
                    showEmoji('😣');
                    return false;
                }

                return true;
            }

            function updateDropZone(fileName) {
                if (fileName) {
                    dropZone.addClass('uploaded');
                    dropZoneText.html(`<i class="material-icons me-2">check_circle</i>File selected: ${fileName}`);
                    showEmoji('✅');
                } else {
                    dropZone.removeClass('uploaded');
                    dropZoneText.html('<i class="material-icons me-2">cloud_upload</i>Drag & drop your .pfx file here or click to select');
                    showEmoji('😐');
                }
            }

            function clearForm() {
                $('#certForm')[0].reset();
                updateDropZone(null);
                $('#APIAccessUserId, #APIAccessKey, #FullName, #Password, #PdfFile').removeClass('is-invalid');
                $('#errorUserId, #errorAccessKey, #errorFullName, #errorPassword, #errorPdfFile').text('');
                showToast('Form cleared!');
                showEmoji('🧹');
                checkFormFilled();
            }

            dropZone.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.addClass('dragover');
            });

            dropZone.on('dragleave drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.removeClass('dragover');
            });

            dropZone.on('drop', function (e) {
                const files = e.originalEvent.dataTransfer.files;
                if (files.length) {
                    if (validateFile(files[0])) {
                        fileInput.prop('files', files);
                        errorSpan.text('');
                        updateDropZone(files[0].name);
                    } else {
                        fileInput.val('');
                        errorSpan.text('Invalid file type. Only .pfx allowed.');
                        dropZone.addClass('shake');
                        setTimeout(() => dropZone.removeClass('shake'), 400);
                        updateDropZone(null);
                    }
                }
            });

            fileInput.on('change', function () {
                const file = this.files[0];
                if (file && validateFile(file)) {
                    errorSpan.text('');
                    updateDropZone(file.name);
                } else {
                    fileInput.val('');
                    errorSpan.text('Invalid file type. Only .pfx allowed.');
                    dropZone.addClass('shake');
                    setTimeout(() => dropZone.removeClass('shake'), 400);
                    updateDropZone(null);
                }
            });

            const fields = [
                { id: "APIAccessUserId", error: "errorUserId" },
                { id: "APIAccessKey", error: "errorAccessKey" },
                { id: "FullName", error: "errorFullName" },
                { id: "Password", error: "errorPassword" },
                { id: "PdfFile", error: "errorPdfFile" }
            ];

            function validateField(id, errorId) {
                const field = $("#" + id);
                const error = $("#" + errorId);
                const isEmpty = id === "PdfFile" ? !field[0].files.length : !field.val().trim();

                if (isEmpty) {
                    field.addClass("is-invalid shake");
                    error.text("This field is required.");
                    showEmoji("😡");
                    return false;
                } else {
                    field.removeClass("is-invalid");
                    error.text("");
                    return true;
                }
            }

            $("#certForm").on("submit", function (e) {
                let valid = true;
                for (let f of fields) {
                    if (!validateField(f.id, f.error)) {
                        valid = false;
                    }
                }
                if (!valid) {
                    e.preventDefault();
                } else {
                    showEmoji("🚀");
                }
            });

            $("#clearFormBtn").on("click", clearForm);
        });
