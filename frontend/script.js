// ========================================
// FASTAPI CONNECTION
// ========================================

const API_URL = "https://staysforu-2.onrender.com";


// ========================================
// GET ELEMENTS
// ========================================

const form = document.getElementById("predictionForm");

const exampleBtn =
    document.getElementById("exampleBtn");

const availabilitySlider =
    document.getElementById("availability_365");

const availabilityValue =
    document.getElementById("availabilityValue");

const emptyPrediction =
    document.getElementById("emptyPrediction");

const predictionResult =
    document.getElementById("predictionResult");

const loading =
    document.getElementById("loading");

const errorBox =
    document.getElementById("errorBox");

const predictedRoom =
    document.getElementById("predictedRoom");



// ========================================
// UPDATE AVAILABILITY NUMBER
// ========================================

availabilitySlider.addEventListener(
    "input",
    function () {

        availabilityValue.textContent =
            this.value;

    }
);



// ========================================
// TRY AN EXAMPLE
// ========================================

exampleBtn.addEventListener(
    "click",
    function () {

        document.getElementById("latitude").value =
            "40.7128";

        document.getElementById("longitude").value =
            "-74.0060";

        document.getElementById("neighbourhood_group").value =
            "Brooklyn";

        document.getElementById("neighbourhood").value =
            "Williamsburg";

        document.getElementById("price").value =
            "150";

        document.getElementById("minimum_nights").value =
            "1";

        document.getElementById("availability_365").value =
            "365";

        document.getElementById("number_of_reviews").value =
            "25";

        document.getElementById("reviews_per_month").value =
            "2.5";

        document.getElementById(
            "calculated_host_listings_count"
        ).value = "1";


        availabilityValue.textContent = "365";

    }
);



// ========================================
// FORM SUBMISSION
// ========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Hide previous messages
        errorBox.classList.add("hidden");

        predictionResult.classList.add("hidden");

        emptyPrediction.classList.add("hidden");


        // Show loading
        loading.classList.remove("hidden");


        // ==================================
        // CREATE REQUEST DATA
        // ==================================

        const data = {

            latitude: Number(
                document.getElementById(
                    "latitude"
                ).value
            ),

            longitude: Number(
                document.getElementById(
                    "longitude"
                ).value
            ),

            price: Number(
                document.getElementById(
                    "price"
                ).value
            ),

            minimum_nights: Number(
                document.getElementById(
                    "minimum_nights"
                ).value
            ),

            number_of_reviews: Number(
                document.getElementById(
                    "number_of_reviews"
                ).value
            ),

            reviews_per_month: Number(
                document.getElementById(
                    "reviews_per_month"
                ).value
            ),

            calculated_host_listings_count:
                Number(
                    document.getElementById(
                        "calculated_host_listings_count"
                    ).value
                ),

            availability_365: Number(
                document.getElementById(
                    "availability_365"
                ).value
            ),

            neighbourhood_group:
                document.getElementById(
                    "neighbourhood_group"
                ).value,

            neighbourhood:
                document.getElementById(
                    "neighbourhood"
                ).value
        };


        console.log(
            "Sending data:",
            data
        );


        // ==================================
        // SEND REQUEST TO FASTAPI
        // ==================================

        try {

            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            // ==================================
            // HANDLE HTTP ERROR
            // ==================================

            if (!response.ok) {

                const error =
                    await response.json();

                throw new Error(
                    JSON.stringify(error.detail)
                );

            }


            // ==================================
            // GET MODEL RESPONSE
            // ==================================

            const result =
                await response.json();


            console.log(
                "Model response:",
                result
            );


            // ==================================
            // DISPLAY RESULT
            // ==================================

            displayPrediction(result);

        }


        catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            errorBox.textContent =
                "Prediction failed: " +
                error.message;


            errorBox.classList.remove(
                "hidden"
            );


            emptyPrediction.classList.remove(
                "hidden"
            );

        }


        finally {

            loading.classList.add(
                "hidden"
            );

        }

    }
);



// ========================================
// DISPLAY PREDICTION
// ========================================

function displayPrediction(result) {


    const prediction =
        result.Predicted_room_type;


    const probabilities =
        result.Probability;


    // ------------------------------------
    // Show predicted room
    // ------------------------------------

    predictedRoom.textContent =
        prediction;


    // ------------------------------------
    // Show probabilities
    // ------------------------------------

    /*
       Your FastAPI returns:

       Probability: [
           probability_class_1,
           probability_class_2,
           probability_class_3
       ]

       For the NYC Airbnb dataset the classes
       are:

       0 = Entire home/apt
       1 = Private room
       2 = Shared room
    */


    const entireProbability =
        probabilities[0] || 0;

    const privateProbability =
        probabilities[1] || 0;

    const sharedProbability =
        probabilities[2] || 0;


    // Convert to percentages

    const entirePercent =
        entireProbability * 100;

    const privatePercent =
        privateProbability * 100;

    const sharedPercent =
        sharedProbability * 100;


    // ------------------------------------
    // Set numbers
    // ------------------------------------

    document.getElementById(
        "entirePercent"
    ).textContent =
        entirePercent.toFixed(0) + "%";


    document.getElementById(
        "privatePercent"
    ).textContent =
        privatePercent.toFixed(0) + "%";


    document.getElementById(
        "sharedPercent"
    ).textContent =
        sharedPercent.toFixed(0) + "%";


    // ------------------------------------
    // Set bars
    // ------------------------------------

    setTimeout(function () {

        document.getElementById(
            "entireBar"
        ).style.width =
            entirePercent + "%";


        document.getElementById(
            "privateBar"
        ).style.width =
            privatePercent + "%";


        document.getElementById(
            "sharedBar"
        ).style.width =
            sharedPercent + "%";

    }, 100);


    // ------------------------------------
    // Show result
    // ------------------------------------

    predictionResult.classList.remove(
        "hidden"
    );

}