const fs = require('fs');

const axios = require('axios');

class Busquedas {
    
    historial = [];
    pathDB = './db/database.json';
    
    constructor() {
        //TODO: Leer Db si existe
        this.leerBD()
    }

    get paramsMapbox() {
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'language' : 'es',
            'limit': 5
        }
    }

    get paramsOpenweather() {
        return {
            /* 'lat' : '',
            'lon' : '', */
            'appid' : process.env.OPENWEATHER_KEY,
            'units' : 'metric',
            'lang' : 'es'
        }
    }

    get historialCapitalizado () {
        return this.historial.map( lugar  => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            //console.log(palabras.join(' '))

            return palabras.join(' ')
        })
    }

    async ciudad (lugar = '' ) {
        
        try {
            //peticion http 
            
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return  resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
    
            //return []; //retornar los lugares
            
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {

        const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: {...this.paramsOpenweather, lat, lon}
        })

        const resp = await instance.get();
        const {weather, main} = resp.data

        return {
            desc: weather[0].description,
            min: main.temp_min,
            max: main.temp_max,
            temp: main.temp
        } 
    }

    agregarHistorial (lugar) {

        if (this.historial.includes( lugar.toLocaleLowerCase())) {

            return;
        }
        this.historial = this.historial.splice(0,4)
    
        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar DB
        this.guardarDB()
    }

    guardarDB () {

        const payload = {
            historial: this.historial
        }
        
        fs.writeFileSync(this.pathDB, JSON.stringify(payload))
    }

    leerBD() {
        if(!fs.existsSync(this.pathDB)) return;

        const info = fs.readFileSync(this.pathDB, {encoding: 'utf-8'})

        const data = JSON.parse(info);
        this.historial = data.historial
        //console.log(this.historial)

    }
}

module.exports = Busquedas;