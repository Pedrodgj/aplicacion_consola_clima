require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugar } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {

    let opt;
    const busquedas = new Busquedas();

    do {
        
        opt = await inquirerMenu()
        
        switch (opt) {
            case 1:
                //ingresar valor
                const lugar = await leerInput('Ciudad: ')
                
                //buscar los lugares
                const lugares = await busquedas.ciudad( lugar );
                
                //seleccionar lugar
                const idSel = await listarLugar( lugares )
                if(idSel === '0') continue 
                
                const lugarSel = lugares.find( l => l.id === idSel )
                
                //guardar db
                busquedas.agregarHistorial(lugarSel.nombre);
                
                
                //clima
                const mostrarClima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                console.log(mostrarClima);


                //mostrar resultados
                const {nombre, lng, lat} = lugarSel;

                console.clear()
                console.log('\nInformacion de la Ciudad\n')
                console.log('Ciudad: ' + nombre)
                console.log('Latitud: ' + lat)
                console.log('Longitud: ' + lng)
                console.log('Temperatura: ' + mostrarClima.temp)                
                console.log('Maxima: ' + mostrarClima.max)                
                console.log('Minima: ' + mostrarClima.min) 
                console.log('Descripción: ' + mostrarClima.desc)
                
                
                break;
                case 2:
                    
                    busquedas.historialCapitalizado.forEach( (lugar, i) => {
                        const idx = `${i + 1}`
                        console.log(`${idx} ${lugar}`);
                    })
                break;
            
        }
        
        if (opt !== 0) await pausa()
        console.clear()

    } while (opt !== 0);
    
}

main();