const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const listaMenu = document.querySelector("#menu");
const btnRojo = document.querySelectorAll(".borrar-pizza");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito")
let articulosCarrito = [];


cargarEventListeners();
function cargarEventListeners(){
    //Cuando agregas una pizza presionando el boton agregar 
    listaMenu.addEventListener("click" , agregarPizza);

    //Elimina pizza del carrito
    carrito.addEventListener("click", eliminarPizza);


    //Vaciar carrito completo
    vaciarCarritoBtn.addEventListener("click", vaciarCarro);

    //Muestra los cursos de Local storage
    document.addEventListener("DOMContentLoaded", function(){
        articulosCarrito = JSON.parse (localStorage.getItem("carrito")) || []

        carritoHTML();
    });
}

 
//Funciones
//Agregar Pizza
function agregarPizza(e){
    e.preventDefault();
    if(e.target.classList.contains("btn-menu")){
        const pizzaSeleccionada = e.target.parentElement.parentElement;
        
        leerDatosPizza(pizzaSeleccionada);
}
};

//Elimina una pizza del carrito
function eliminarPizza(e){
    if(e.target.classList.contains("borrar-pizza")){
        const pizzaId = e.target.getAttribute("id");

        //Elimina del array articulosCarrito por su Id
        articulosCarrito = articulosCarrito.filter ( (pizza) =>{
            if(pizza.id === pizzaId){
                if(pizza.cantidad > 1){
                    pizza.cantidad--;

                    //Actualizar precio
                    let precioPizza = Number(pizza.precio.slice(1,pizza.precio.length)) 
                    
                    //Quitarel signo de $
                    const precioUnitario = Number(pizza.precioUnitario.slice(1, pizza.precioUnitario.length)) //Quitar el signo de $
                    
                    pizza.precio = `$${precioPizza - precioUnitario}`;
                    
                    return pizza;
                
                }
            } else{
                
                return pizza;
            }

        });

        carritoHTML();//Iterar sobre el carrito y muestra su HTML
        }
    }

    ////Vaciar carrito
function vaciarCarro() {
    if(articulosCarrito.length === 0){
        return;
    } else{
        articulosCarrito = [];
        limpiarHTML();
        sincronizarStorage();
        alert("El carrito se ha vaciado")
    }
};

//Lee el contenido del HTML que le dimos click y extrae la info de la pizza
function leerDatosPizza(pizza){

    //Crear un object con el contenido del curso actual
    const infoPizza = {
        imagen : pizza.querySelector("img").getAttribute("src"),
        nombre: pizza.querySelector("h2").textContent,
        precio: pizza.querySelector("h3").textContent,
        precioUnitario: pizza.querySelector('h3').textContent,
        id: pizza.querySelector("button").id,
        cantidad: 1
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( (pizza) =>  pizza.id === infoPizza.id );
    if(existe) {
        //Actualizamos la cantidad
        const pizzas = articulosCarrito.map ( (pizza) => {
            if(pizza.id === infoPizza.id ) {
                
                let precioPizza = Number(infoPizza.precio.slice(1,infoPizza.precio.length)); //Quitar el signo de $
                
                pizza.cantidad++;
                alert(`La pizza de ${pizza.nombre} fue añadida correctamente`);
                
                pizza.precio = `$${pizza.cantidad * precioPizza}`;

                return pizza;//Retorna el objeto actualizado
            } else{
                return pizza;//Retorna los objetos que no son duplicados
            }
        } );
        articulosCarrito = [...pizzas];
        
    } else{
        //Agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoPizza];
        alert(`La pizza de ${infoPizza.nombre} fue añadida correctamente`);
    }

    carritoHTML();
}

//Muestra el carrito en el HTML
function carritoHTML() {
    //Limpiar el HTML
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    
    articulosCarrito.forEach( (pizza) => {
        //Desctructuring objects
        const {nombre,precio,imagen,cantidad,id} = pizza;

        const row = document.createElement("tr");
        row.innerHTML =`
        <td>
            <img src = "${imagen}" width = "80">
        </td>
        <td>
            ${nombre}
        </td>
        <td>
            ${precio}
        </td>
        <td>
            ${cantidad}
        </td>
        <td>
            <a href= "#" class = "borrar-pizza" id = ${id}> X </a>
        </td>
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    //Agregar el carrito de compras al Local Storage
    sincronizarStorage();
}

//Local Storage
function sincronizarStorage(){
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito))
}


function limpiarHTML(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
};


