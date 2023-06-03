const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080; // Puerto en el que se ejecutará el servidor Express
const TIEMPO = 60000; // Acá se define con que frecuencia se ejecutará el método executeMultipleCallbacks()
const HTTP_PORT = 7897; // Puerto del agente IoT
const APIKEY = '4jggokgpepnvsb2uv4s40d59ov'; // apikey usado cuando se crea el service group del agente IoT
const ENTITY_TYPE = 'AirQualityObserved'; // entity_type usado cuando se crea el service group del agente IoT
const ENTITY_ID = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010']; // Los numeros de las entidades

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
        const url = `http://localhost:${HTTP_PORT}/iot/d?k=${APIKEY}&i=${ENTITY_TYPE}${number}`;
        const contentType = 'text/plain';

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': contentType,
            },
        });

        console.log(new Date().toLocaleString(), response.status, response.statusText, ENTITY_TYPE, number);

    } catch (error) {
        console.error(error);
    }
}

async function executeMultipleCallbacks() {
    for (let i of ENTITY_ID) {
        await executeCallback(i);
    }
}

// Ejecutar executeMultipleCallbacks cada TIEMPO
setInterval(executeMultipleCallbacks, TIEMPO);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});