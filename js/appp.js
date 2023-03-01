class Dato{

    constructor(descripcion, valor){
        this._descripcion = descripcion
        this._valor = valor
    }

    get descripcion(){
        return this._descripcion;
    }
    set descripcion(descripcion){
        this._descripcion = descripcion
    }

    get valor(){
        return this._valor;
    }
    set valor(valor){
        this._valor = valor
    }
}

class Ingreso extends Dato{

    static contadorIngresos = 0;

    constructor(descripcion, valor){
        super(descripcion, valor)
        this._id = ++Ingreso.contadorIngresos;
    }

    get id(){
        return this._id
    }
}

class Egreso extends Dato{

    static contadorEngresos = 0;

    constructor(descripcion, valor){
        super(descripcion, valor);
        this._id = ++Egreso.contadorEgresos;
    }
    get id(){
        return this._id
    }
}

const ingresos = [];

const egresos = [];

let cargarApp = () => {
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}

// Calcular total de ingresos y total egresos

let totalIngresos = () => {
    let totalIngreso = 0;
    for( let ingreso of ingresos ){
        totalIngreso += ingreso.valor;
    }

    return totalIngreso;
}

let totalEgresos = () => {
    let totalEgreso = 0;
    for( let egreso of egresos){
        totalEgreso += egreso.valor;
    }

    return totalEgreso;
}

let cargarCabecero = () => {
    let presupuesto = totalIngresos() - totalEgresos();
    let porcentajeEgreso = totalEgresos()/totalIngresos();
    
    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML = formatoMoneda(totalIngresos());
    document.getElementById('egresos').innerHTML = formatoMoneda(totalEgresos());
}

const formatoMoneda = (valor) => {
    return valor.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2});
}

const formatoPorcentaje = (valor) => {
    return valor.toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 0});
}

const cargarIngresos = () => {
    let ingresosHTML = '';
    for( ingreso of ingresos){
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
}

const crearIngresoHTML = (ingreso) => {
    let ingresoHTML = `
        <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${ingreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
        <div class="elemento_valor">${formatoMoneda(ingreso.valor)}</div>
        <div class="elemento_eliminar">
        <button class="elemento_eliminar--btn">
        <ion-icon name='close-circle-outline' style="color: tomato;" 
        onclick='eliminarIngreso(${ingreso.id})'></ion-icon>
        </button>
        </div>
        </div>
        </div>
    `;
    return ingresoHTML;
}

const eliminarIngreso = (id) => {
    let indiceEliminar = ingresos.findIndex(ingreso => ingreso.id === id);
    ingresos.splice(indiceEliminar, 1);
    cargarCabecero()
    cargarIngresos()
}

const cargarEgresos = () => {
    let egresosHTML = '';
    for( egreso of egresos){
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
}

const crearEgresoHTML = (egreso) => {
    let egresoHTML = `
        <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${egreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
        <div class="elemento_valor">${formatoMoneda(egreso.valor)}</div>
        <div class="elemento_porcentaje">${formatoPorcentaje(egreso.valor/totalIngresos())}</div>
        <div class="elemento_eliminar">
        <button class="elemento_eliminar--btn">
        <ion-icon name='close-circle-outline' style="color: tomato;"
        onclick='eliminarEgreso(${egreso.id})'></ion-icon>
        </button>
        </div>
        </div>
        </div>
    `;

    return egresoHTML;
}

const eliminarEgreso = (id) => {
    let indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
    egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarEgresos();
}

const agregarDato = () => {

    let forma = document.forms['forma']
    let tipo = forma['tipo']
    let descripcion = forma['descripcion']
    let valor = forma['valor']
    let validar = document.getElementById('validar')
    const er = /^[0-9]+$/;

    if(tipo.value === 'Agrega'){
        validar.classList.remove('novisible');
        tipo.classList.add('borderojo');
        tipo.focus()
        return
    }
    validar.classList.add('novisible');
    tipo.classList.remove('borderojo');
    
    if(descripcion.value === ''){
        validar.classList.remove('novisible');
        descripcion.classList.add('borderojo')
        descripcion.focus();
        return
    }
    validar.classList.add('novisible');
    descripcion.classList.remove('borderojo');

    if(valor.value === ''){
        validar.classList.remove('novisible');
        valor.classList.add('borderojo');
        valor.focus();
        return
    }
    validar.classList.add('novisible');
    valor.classList.remove('borderojo');
    

    if(descripcion.value !== '' && valor.value !== ''){

        if(tipo.value === 'ingreso' && er.test(valor.value) ){
            ingresos.push( new Ingreso(descripcion.value, +valor.value))
            cargarCabecero();
            cargarIngresos();
            forma.reset();
            validar.classList.add('novisible');
        }

        else if(tipo.value === 'egreso' && er.test(valor.value)){
            egresos.push( new Egreso(descripcion.value, +valor.value))
            cargarCabecero();
            cargarEgresos();
            forma.reset();
            validar.classList.add('novisible');
        }
        else if(!er.test(valor.value)){
            validar.classList.remove('novisible');
            valor.focus();
        }
    }

}
