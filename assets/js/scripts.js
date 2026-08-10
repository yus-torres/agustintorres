// Masonry
$('.grid').masonry({
    // options
    itemSelector: '.grid-item',
});

// Copy to Clipboard
document.addEventListener("DOMContentLoaded", function () {
const copyBtn = document.getElementById("copyAccountBtn");
const accountNumber = document.getElementById("donationAccount");

// Initialize Bootstrap Tooltip
const tooltip = new bootstrap.Tooltip(copyBtn);

copyBtn.addEventListener("click", function () {
    const text = accountNumber.textContent.trim();

    navigator.clipboard.writeText(text).then(() => {
        // Change tooltip to "Copied!"
        copyBtn.setAttribute("data-bs-original-title", "Copied!");
        tooltip.setContent({
            ".tooltip-inner": "Copied!"
        });
        tooltip.show();

        // Change button text
        copyBtn.textContent = "Copied!";

        // Reset after 2 seconds
        setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.setAttribute(
                "data-bs-original-title",
                "Copy account number"
            );
            tooltip.setContent({
                ".tooltip-inner": "Copy account number"
            });
            tooltip.hide();
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy:", err);

        copyBtn.setAttribute(
            "data-bs-original-title",
            "Copy failed"
        );
        tooltip.setContent({
            ".tooltip-inner": "Copy failed"
        });
        tooltip.show();
    });
});
});