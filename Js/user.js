// users-management.js

let baseUrl = "";
let users = [];

// Mouse tracking for glare effect
function initCardEffects() {
    document.querySelectorAll('.user-card').forEach(card => {
        if (!card.querySelector('.glare')) {
            card.insertAdjacentHTML('afterbegin', '<div class="glare"></div>');
        }
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            card.style.setProperty('--x', x + '%');
            card.style.setProperty('--y', y + '%');
        });
        card.addEventListener('pointerleave', () => {
            card.style.setProperty('--x', '50%');
            card.style.setProperty('--y', '50%');
        });
    });
}

// Open Edit Modal
function openEditModal(id) {
    const u = users.find(x => x.UserId == id);
    if (!u) return;

    document.getElementById("editUserId").value = u.UserId;
    document.getElementById("editUserName").value = u.UserName;
    document.getElementById("editEmail").value = u.Email;
    document.getElementById("editPhone").value = u.Phone;
    document.getElementById("editCompanyName").value = u.CompanyName;
    document.getElementById("editIsActive").value = u.IsActive ? "1" : "0";
    document.getElementById("editUserRole").value = u.UserRole;

    let logoSrc = "/images/no-image.png";
    if (u.CompanyLogoPath) {
        if (u.CompanyLogoPath.startsWith("http")) {
            logoSrc = u.CompanyLogoPath;
        } else if (u.CompanyLogoPath.startsWith("/")) {
            logoSrc = baseUrl + u.CompanyLogoPath;
        } else {
            logoSrc = u.CompanyLogoPath;
        }
    }
    document.getElementById("currentLogo").src = logoSrc + "?v=" + Date.now();

    const modal = document.getElementById("editModal");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

// Close Modal
function closeEditModal() {
    const modal = document.getElementById("editModal");
    modal.classList.remove("show");
    document.body.style.overflow = "auto";

    document.getElementById("editUserForm").reset();
    document.getElementById("currentLogo").src = "/images/no-image.png";
}

// Logo Preview
document.getElementById("editCompanyLogo").addEventListener("change", function () {
    if (this.files && this.files[0]) {
        document.getElementById("currentLogo").src = URL.createObjectURL(this.files[0]);
    }
});

// Form Submit
document.getElementById("editUserForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch(this.action, {
        method: "POST",
        body: formData
    })
        .then(r => {
            if (!r.ok) throw new Error("Server error");
            return r.json();
        })
        .then(d => {
            if (d.success) {
                Notiflix.Notify.success(d.message || "User updated successfully!");
                closeEditModal();
                location.reload(); // ya table refresh
            } else {
                Notiflix.Notify.failure(d.message || "Update failed");
            }
        })
        .catch(err => {
            Notiflix.Notify.failure("Error: " + err.message);
        });
});

// Initialize on load
document.addEventListener("DOMContentLoaded", initCardEffects);