// Function to delete the row when "Delete" button is clicked
function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// Function to format date in yyyy-mm-dd format
function formatDate(dateString) {
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}
// Function to format date in yyyy-mm-dd format (in UTC)
function formatDateUTC(dateString) {
    var date = new Date(dateString);
    var year = date.getUTCFullYear();
    var month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    var day = date.getUTCDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}


// Set the "Next Charge Date" input field to today's date
var today = new Date();
var formattedToday = formatDate(today);
var nextChargeDateInputs = document.querySelectorAll(".next-charge-date input");

nextChargeDateInputs.forEach(function(input) {
    input.value = formattedToday;
});

// Event listener for the "payment-options" select element
document.getElementById("payment-options").addEventListener("change", function() {
    var paymentOptionElement = document.getElementById("payment-options");
    let customerId = paymentOptionElement.options[paymentOptionElement.selectedIndex].getAttribute("data-customer");
    let paymentProcessor = paymentOptionElement.options[paymentOptionElement.selectedIndex].getAttribute("data-processor");
    document.getElementById("customer-id").value = customerId;
    document.getElementById("payment-processor").value = paymentProcessor;
});


// Event listener for the "Checkout" button
document.getElementById("checkoutBtn").addEventListener("click", function() {
    var subscriptions = [];

    // Get all rows in the table body
    var rows = document.querySelectorAll("tbody tr");

    // Loop through each row and extract column values
    rows.forEach(function(row) {
        var product = {
            "title": row.querySelector(".product-title").textContent,
            "shopify_variant_id": row.querySelector(".product-variant-id").textContent,
            "next_charge_scheduled_at": formatDateUTC(row.querySelector(".next-charge-date input").value),
            "charge_interval_frequency": row.querySelector(".charge-interval-frequency input").value,
            "order_interval_frequency": row.querySelector(".product-interval-freq input").value,
            "order_interval_unit": row.querySelector(".product-interval-unit select").value,
            "quantity": row.querySelector(".product-quantity input").value,
            "price": row.querySelector(".product-price").textContent.replace("$", "")
        };

        subscriptions.push(product);
    });

    // Get form data and convert to JSON
    var formData = new FormData(document.getElementById("checkoutForm"));
    var formObject = {};

    formData.forEach(function(value, key) {
        formObject[key] = key === 'nextChargeDate' ? formatDateUTC(value) : value;
    });

    // Convert the form data object to JSON
    var formJson = JSON.stringify(formObject);

    // Combine the JSON data
    var combinedData = {
        subscriptions: subscriptions,
        formData: JSON.parse(formJson)
    };

    // Convert the combined data object to JSON
    var jsonData = JSON.stringify(combinedData, null, 2);

    // Log or use the generated JSON data
    console.log(jsonData);

    // Send the JSON data to the endpoint using Fetch API
    fetch('https://e8928c22c041bf50dc1022d105c1d4e3.m.pipedream.net', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data)
        // Show the popup
        showPopup();

        // Hide the popup after a delay (e.g., 3 seconds)
        setTimeout(hidePopup, 3000);
    })
    .catch(error => console.error('Error:', error));
});


// Function to show the popup
function showPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
}

// Function to hide the popup
function hidePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}
