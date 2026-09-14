const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const secretKey = "test_sk_zXLk5nqw3064812211z3Yo4M28B1"; 
const basicAuthHeader = "Basic " + Buffer.from(secretKey + ":").toString("base64");

app.post("/api/confirm-payment", async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    try {
        const response = await axios.post(
            "https://api.tosspayments.com/v1/payments/confirm",
            { paymentKey, orderId, amount },
            {
                headers: {
                    Authorization: basicAuthHeader,
                    "Content-Type": "application/json",
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("결제 승인 오류:", error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json(
            error.response?.data || { message: "결제 승인 처리 중 오류가 발생했습니다." }
        );
    }
});

app.listen(3000, () => {
    console.log("서버가 http://localhost:3000 에서 실행 중입니다.");
});