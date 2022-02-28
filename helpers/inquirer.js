const inquirer = require('inquirer');
require('colors');

const preguntas = {
    type: 'list',
    name: 'opcion',
    message: '¿Que desea hacer?',
    choices: [
        {
            value: 1,
            name: '1. Buscar ciudad'
        },
        {
            value: 2,
            name: '2. Historial'
        },
        {
            value: 0,
            name: '0. Salir'
        }
    ]

}

const inquirerMenu = async() => {

       // console.clear()

        console.log('==========================');
        console.log('    Mostrar Aplicacion')
        console.log('==========================\n');

        const {opcion} = await inquirer.prompt(preguntas)

        return opcion
}

const pausa = async() => {
    
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar`
        }
    ]
    console.log('\n')
    await inquirer.prompt(question)
}

const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if(value.length === 0) {
                    return 'Por favor ingrese un valor'
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;

}

const listarLugar = async( lugares = [] ) => {

    const choices = lugares.map( (lugar, i) => {
        
        const idx = `${i + 1}`.green

        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`
        }
    })

    choices.push({
        value: '0',
        name: '0'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione una opcion',
            choices
        }
    ]
    const {id} = await inquirer.prompt(preguntas);
    return id;
}

const confirmar = async (message) => {
    const preguntas = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    const {ok} = await inquirer.prompt(preguntas);
    return ok
}

const mostrarListadoCheckList = async( tareas = [] ) => {

    const choices = tareas.map( (tarea, i) => {
        
        const idx = `${i + 1}`.green

        return {
            value: tarea.id,
            name: ` ${idx}. ${tarea.desc}`,
            checked: (tarea.completandoEn) ? true : false
        }
    })

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]
    const {ids} = await inquirer.prompt(pregunta);
    return ids;
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput, 
    listarLugar,
    confirmar,
    mostrarListadoCheckList
}