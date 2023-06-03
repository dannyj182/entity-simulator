const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080; // Puerto en el que se ejecutará el servidor Express
const TIEMPO = 60000; // 1 minuto

function generateDataString() {
    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    const pm1 = getRandomNumber(0, 100).toFixed(2);
    const pm10 = getRandomNumber(0, 200).toFixed(2);
    const pm25 = getRandomNumber(0, 100).toFixed(2);
    const reliability = getRandomNumber(0, 1).toFixed(2);
    const temperature = getRandomNumber(-10, 40).toFixed(1);

    return `pm1|${pm1}|pm10|${pm10}|pm25|${pm25}|temperature|${temperature}|reliability|${reliability}`;
}

async function executeCallback(number) {
    try {
        const data = generateDataString();
        const url = `http://localhost:7897/iot/d?k=4jggokgpepnvsb2uv4s40d59ov&i=AirQualityObserved00${number}`;
        const contentType = 'text/plain';

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': contentType,
            },
        });
        console.log(new Date().toLocaleString(), response.status, response.statusText);

    } catch (error) {
        console.error(error);
    }
}

async function executeMultipleCallbacks() {
    for (let i = 0; i <= 9; i++) {
        await executeCallback(i);
    }
}

// Ejecutar executeMultipleCallbacks cada TIEMPO
setInterval(executeMultipleCallbacks, TIEMPO);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});