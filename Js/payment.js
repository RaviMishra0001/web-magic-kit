// payment.js
// Razorpay Payment Integration for Digital Sign Plans

$(document).on("click", ".buy-btn", function (e) {
    e.preventDefault();

    const $planCard = $(this).closest(".product-plan");
    const amountUSD = parseFloat($planCard.data("amount"));
    const planName = $planCard.find(".title").text().trim();

    // Validate amount
    if (isNaN(amountUSD) || amountUSD < 0) {
        Notiflix.Notify.failure("Invalid plan amount.");
        return;
    }

    // Free plan handling
    if (amountUSD === 0) {
        Notiflix.Notify.success("Free Starter Plan activated successfully! 🎉");
        // Add your free plan activation logic here if needed
        return;
    }

    // Current USD to INR exchange rate (as of Dec 2025 ≈ 89.7)
    // For production: fetch dynamically from a reliable API
    const exchangeRate = 89.7;
    const amountINRInPaise = Math.round(amountUSD * exchangeRate * 100); // Razorpay uses paise

    // Backend endpoints (update these if your routes are different)
    const createOrderUrl = "/Payment/CreateOrder";
    const verifyUrl = "/Payment/VerifyPayment";

    Notiflix.Loading.pulse("Preparing payment...");

    $.post(createOrderUrl, {
        amount: amountINRInPaise,
        currency: "INR"
    })
    .done(function (orderData) {
        Notiflix.Loading.remove();

        if (orderData.error) {
            Notiflix.Notify.failure("Error: " + orderData.error);
            return;
        }

        const options = {
            key: orderData.key,                    // Razorpay Key ID
            amount: orderData.amount,              // In paise (from backend)
            currency: orderData.currency,
            name: "Digital Sign",
            description: planName,
            order_id: orderData.orderId,
            handler: function (response) {
                Notiflix.Loading.pulse("Verifying payment...");

                $.post(verifyUrl, {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                })
                .done(function (result) {
                    Notiflix.Loading.remove();
                    if (result.success) {
                        Notiflix.Notify.success(result.message || "Payment Successful! 🎉");
                        // Optional: Redirect or refresh page
                        // window.location.reload();
                    } else {
                        Notiflix.Notify.failure(result.message || "Payment verification failed.");
                    }
                })
                .fail(function () {
                    Notiflix.Loading.remove();
                    Notiflix.Notify.failure("Failed to verify payment.");
                });
            },
            prefill: {
                // In production: Populate from logged-in user data
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#164fa9"
            },
            modal: {
                ondismiss: function () {
                    Notiflix.Notify.info("Payment was cancelled.");
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    })
    .fail(function (xhr, status, error) {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure("Failed to connect to server. Please try again.");
        console.error("Order creation failed:", error);
    });
});
