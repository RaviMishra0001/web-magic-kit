    var encryptedQRGlobal = "";

    function showCertModal(encryptedQR, certName, downloadUrl) {
        encryptedQRGlobal = encryptedQR;
    document.getElementById('modalCertName').innerText = certName;
    document.getElementById('modalDownloadBtn').href = downloadUrl;

    // Reset fields
    document.getElementById('decryptedContent').innerText = "";
    document.getElementById('decryptedContent').style.display = "none";
    document.getElementById('decryptKey').value = "";
    document.getElementById('modalDownloadBtn').style.display = "none";

    // Show modal using Bootstrap 5 method
    const modal = new bootstrap.Modal(document.getElementById('certModal'));
    modal.show();
    }

    function closeModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('certModal'));
    if (modal) modal.hide();
    }

    function decryptModalData() {
        var key = document.getElementById('decryptKey').value.trim();
    if (!key) {
        alert("Please enter the decryption key!");
    return;
        }

    try {
        let combinedBytes = CryptoJS.enc.Base64.parse(encryptedQRGlobal);
    let iv = CryptoJS.lib.WordArray.create(combinedBytes.words.slice(0, 4)); // 16 bytes IV
    let cipherText = CryptoJS.lib.WordArray.create(combinedBytes.words.slice(4));

    let decrypted = CryptoJS.AES.decrypt(
    {ciphertext: cipherText },
    CryptoJS.enc.Utf8.parse(key.padEnd(32, " ")),
    {
        iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
                }
    );

    let result = decrypted.toString(CryptoJS.enc.Utf8);

    if (!result || result.length === 0) {
        alert("Wrong key or corrupted data!");
            } else {
                const contentEl = document.getElementById('decryptedContent');
    const downloadBtn = document.getElementById('modalDownloadBtn');

    contentEl.innerText = result;
    contentEl.style.display = "block";
    downloadBtn.style.display = "flex"; // Show download button after successful decrypt
            }
        } catch (ex) {
        console.error(ex);
    Notiflix.Notify.failure("Decryption failed! Check your key and try again.");
            //alert("Decryption failed! Check your key and try again.");
        }
    }

    // Optional: Close modal when clicking outside (Bootstrap handles this by default with backdrop)
    // But if you want to ensure close on backdrop click:
    document.getElementById('certModal').addEventListener('click', function (e) {
        if (e.target === this) {
        closeModal();
        }
    });
