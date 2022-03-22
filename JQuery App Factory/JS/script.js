//Primero esperamos a que se cargue el documento
$(document).ready(function(){
    var result;
    //Booleano para ver si se han cargado los pedidos en la pagina de pedidos
    var PHPRequestOnce = 0;
    var PHPRequestOnce2 = 0;
    //Array vacia para guardar las maquinas
    var machines = [];
    //Array vacia para guardar los pedidos
    var orders = [];
    /**
    * Funcion para verificar que nuestros datos de login son correctos
    * @param username Guardamos el nombre que ha introducido el usuario
    * @param password Guardamos la contraseña que ha introducido el usuario
    */
    $("#submitlogin").click(function(){
        var username = JSON.stringify($("#username").val());
        var password = JSON.stringify($("#password").val());
        $.post("PHP/server.php",{username: username, password: password},function(data,status){
            result = data;
            //Si el servidor no devuelve nada, significa que los datos son incorrectos
            //Si el servidor devuelve algo, se accede al login y se crean todas las cookies
            if(result != null){
                $("#login").css("display","none");
                $("#machines").css("display","block");
                $("#settings").css("display","block");
                $("#logout").css("display","block");
                $("#loginfieldset").css("display","none");
                $("#homepagemessage").css("display","block");
                $.cookie("idSession", JSON.stringify(result));
                localStorage.setItem("idSession", JSON.stringify(result));
                if(PHPRequestOnce == 0){
                    //Si es la primera vez que se carga la pagina crea las maquinas y los pedidos que se cojen del servidor
                    createMachines();
                    createOrders();
                    PHPRequestOnce = PHPRequestOnce + 1;
                }
            }
        }, "json");

    });

    //Si clickamos en el boton del home nos saldra el mensaje de presentación
    $("#home").click(function(){
        $("#loginfieldset").css("display","none");
        $("#homepagemessage").css("display","block");
        $("#settingsTables").css("display","none");
        $("#orderTables").css("display","none");
    });

    //Si clickamos en el boton del menu de login nos aparecera el div del login
    $("#login").click(function(){
        $("#loginfieldset").css("display","block");
        $("#homepagemessage").css("display","none");
    });

    //Si clickamos en el boton del menu de logout del login nos volvera al menu principal y eliminara las cookies
    $("#logout").click(function(){
        $("#login").css("display","block");
        $("#logout").css("display","none");
        $("#homepagemessage").css("display","block");
        $("#settingsTables").css("display","none");
        $("#machines").css("display","none");
        $("#settings").css("display","none");
        $("#orderTables").css("display","none");
        $.removeCookie("idSession");
        localStorage.removeItem("idSession");
    });

    //Si clickamos en el boton del menu de machines (que solo aparece una vez logeados) mostrara el contenido de su pagina
    $("#machines").click(function(){
        $("#loginfieldset").css("display","none");
        $("#homepagemessage").css("display","none");
        $("#settingsTables").css("display","none");
        $("#orderTables").css("display","block");
        orderFunction();
    });

    //Si clickamos en el boton del menu de settings (que solo aparece una vez logeados) mostrara el contenido de su pagina y luego llama a la funcion sortableSettings()
    $("#settings").click(function(){
        $("#loginfieldset").css("display","none");
        $("#homepagemessage").css("display","none");
        $("#orderTables").css("display","none");
        $("#settingsTables").css("display","block");
        restoreSettings();
        sortablesSettings();
    });


    /**
    * Funcion que gestiona la pagina se settings
    * @param machine1Queue Booleano para comprobar si la maquina 1 tiene cola
    * @param machine1Queue Booleano para comprobar si la maquina 2 tiene cola
    */
    function sortablesSettings(){
        let machine1Queue = true;
        let machine2Queue = true;
        let usuarioSettings = JSON.parse($.cookie("idSession"));
        let rolUsuarioSettings = usuarioSettings["rol"];
        //Itera la array de maquinas y comprueba si tienen cola
        for (const machine of machines) {
            if(machine["id"] == 1){
                if(machine["queue"] == 0){
                    machine1Queue = false;
                }
                else{
                    alert("Machine 1 has a product queue! Cannot be configured at this time!");
                };
            };
            if(machine["id"] == 2){
                if(machine["queue"] == 0){
                    machine2Queue = false;
                }
                else{
                    alert("Machine 2 has a product queue! Cannot be configured at this time!");
                };
            }
          };

            //Solo permite usar los sortable si el usuario es un encargado
            if(rolUsuarioSettings == "encargado"){
                //Si la maquina 1 no tiene cola y la 2 si, desabilita la opcion sortable de la maquina 2
                if(machine1Queue == false && machine2Queue == true){
                    $("#typePiecesTable").sortable({
                        connectWith: "#machine1Table",
                        dropOnEmpty: true,
                    });
                    $("#machine1Table").sortable({
                        connectWith: "#typePiecesTable",
                        dropOnEmpty: true,
                        //Cuando se recibe un item en el sortable, se actualiza la informacion de la maquina y se refresca la cookie
                        receive: function(event, ui) { 
                            let receiveValueChildren = $("#machine1Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 1){
                                    machine["typeCreated"] = receiveValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        },
                        //Cuando se elimina un item en el sortable, se actualiza la informacion de la maquina y se refresca la cookie
                        remove: function( event, ui ) {
                            let removeValueChildren = $("#machine1Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 1){
                                    machine["typeCreated"] = removeValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        }
                    });
                };
                //Si la maquina 1 tiene cola y la 2 no, desabilita la opcion sortable de la maquina 1
                if(machine1Queue == true && machine2Queue == false){
                    $("#typePiecesTable").sortable({
                        connectWith: "#machine2Table",
                        dropOnEmpty: true,
                    });
                    $("#machine2Table").sortable({
                        connectWith: "#typePiecesTable",
                        dropOnEmpty: true,
                        receive: function(event, ui) { 
                            let receiveValueChildren = $("#machine2Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 2){
                                    machine["typeCreated"] = receiveValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        },
                        remove: function( event, ui ) {
                            let removeValueChildren = $("#machine2Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 2){
                                    machine["typeCreated"] = removeValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        }
                    });
                }
                //Si la maquina 1 y 2 no tienen cola, permite el sortable en las dos tablas
                if(machine1Queue == false && machine2Queue == false){
                    $("#typePiecesTable").sortable({
                        connectWith: "#machine1Table , #machine2Table",
                        dropOnEmpty: true,
                    });
                    $("#machine1Table").sortable({
                        connectWith: "#machine2Table, #typePiecesTable",
                        dropOnEmpty: true,
                        receive: function(event, ui) { 
                            let receiveValueChildren = $("#machine1Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 1){
                                    machine["typeCreated"] = receiveValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        },
                        remove: function( event, ui ) {
                            let removeValueChildren = $("#machine1Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 1){
                                    machine["typeCreated"] = removeValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        }
                    });
                    $("#machine2Table").sortable({
                        connectWith: "#machine1Table, #typePiecesTable",
                        dropOnEmpty: true,
                        receive: function(event, ui) { 
                            let receiveValueChildren = $("#machine2Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 2){
                                    machine["typeCreated"] = receiveValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        },
                        remove: function( event, ui ) {
                            let removeValueChildren = $("#machine2Table").children().text();
                            for (const machine of machines) {
                                if(machine["id"] == 2){
                                    machine["typeCreated"] = removeValueChildren;
                                };
                            };
                            refreshMachinesCookie()
                        }
                    });
                }
            };
    };

    //Recoge la informacion de la cookie de maquinas y devuelve la pagina settings a como estaba aun recargando la pagina
    function restoreSettings(){
        //Si la cookie no esta definida, lo deja como esta por defecto
        if (typeof $.cookie('machinesData') === 'undefined'){
            $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeA\">A</li>");
            $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeB\">B</li>");
            $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeC\">C</li>");
            $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeD\">D</li>");
        } else {
            //Si esta definida eliminar todas las listas y las crea a partir de la cookie
            $("#typePiecesTable").children().remove();
            $("#machine1Table").children().remove();
            $("#machine2Table").children().remove();
            let machinesDataSettings = JSON.parse($.cookie("machinesData"));
            let ACheck = false;
            let BCheck = false;
            let CCheck = false; 
            let DCheck = false;
            for (const machine of machinesDataSettings) {
                if(machine["id"] == 1){
                    let arrayLetters = [];
                    let newText = machine["typeCreated"] + "";
                    for (let i = 0; i < machine["typeCreated"].length; i++) {
                        arrayLetters.push(newText.slice(i,i+1));
                    };
                    for (const letter of arrayLetters) {
                        if(letter != "X"){  
                            if(letter == "A"){
                                ACheck = true;
                            }
                            if(letter == "B"){
                                BCheck = true;
                            }
                            if(letter == "C"){
                                CCheck = true;
                            }
                            if(letter == "D"){
                                DCheck = true;
                            }
                            $("#machine1Table").append("<li class = \"settingsLiMachines\" id=\"type" + letter + "\">" + letter + "</li>");
                        }
                    }
                    
                };
                if(machine["id"] == 2){
                    let arrayLetters = [];
                    let newText = machine["typeCreated"] + "";
                    for (let i = 0; i < machine["typeCreated"].length; i++) {
                        arrayLetters.push(newText.slice(i,i+1));
                    };
                    for (const letter of arrayLetters) {
                        if(letter != "X"){
                            if(letter == "A"){
                                ACheck = true;
                            }
                            if(letter == "B"){
                                BCheck = true;
                            }
                            if(letter == "C"){
                                CCheck = true;
                            }
                            if(letter == "D"){
                                DCheck = true;
                            }
                            $("#machine2Table").append("<li class = \"settingsLiMachines\" id=\"typeA\">" + letter + "</li>");
                        }
                    }
                    
                };
            }
            if(ACheck == false){
                $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeA\">A</li>");
            }
            if(BCheck == false){
                $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeB\">B</li>");
            }
            if(CCheck == false){
                $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeC\">C</li>");
            }
            if(DCheck == false){
                $("#typePiecesTable").append("<li class = \"settingsLiMachines\" id=\"typeD\">D</li>");
            }
        }
    }

    //Funcion que gestina los sortable de la pagina de pedidos
    function orderFunction(){
        chargeOrdersFromLocal();
        $("#machine2ordersTable").css("background-color","rgb(177, 177, 177)");
        $("#machine1ordersTable").css("background-color","rgb(177, 177, 177)");
        let machinesInformation = JSON.parse($.cookie("machinesData"));
        let TypetoCreateMachine1;
        let TypeToCreateMachine2;
        //Se coje los tipos que fabrican las fabricas directamente desde la cookie
        let usuarioOrders = JSON.parse($.cookie("idSession"));
        let rolUsuarioOrders = usuarioOrders["rol"];
        for (const machine of machinesInformation) {
            if(machine["id"] == 1){
               TypetoCreateMachine1 = machine["typeCreated"];
            }
            if(machine["id"] == 2){
                TypeToCreateMachine2 = machine["typeCreated"]; 
            }
        };
        //Si el usuario es encargado permite utilizar los sortable
        if(rolUsuarioOrders == "encargado"){
            $("#MachinesTable").sortable({
                connectWith: "#machine1ordersTable, #machine2ordersTable",
                dropOnEmpty: true,
                receive: function(event, ui) {

                },
                remove: function( event, ui ) {
                    $("#machine2ordersTable").css("background-color","rgb(177, 177, 177)");
                    $("#machine1ordersTable").css("background-color","rgb(177, 177, 177)");
                },
                out: function( event, ui ){
                    if(TypetoCreateMachine1.includes(ui.item.attr("maquinaTipo"))){
                        $("#machine2ordersTable").css("background-color","red");
                        $("#machine1ordersTable").css("background-color","green");
                    }
                    else{
                        $("#machine2ordersTable").css("background-color","green");
                        $("#machine1ordersTable").css("background-color","red");
                    }
                }
            });

            $("#machine1ordersTable").sortable({
                connectWith: "#MachinesTable, #machine2ordersTable",
                dropOnEmpty: true,
                receive: function(event, ui) {
                    if(TypetoCreateMachine1.includes(ui.item.attr("maquinaTipo"))){

                    }
                    else{
                        $(this).sortable('cancel');
                        $(ui.sender).sortable('cancel');
                        alert("This order is not for this machine")
                    }
                },
                remove: function( event, ui ) {
                    $("#machine2ordersTable").css("background-color","rgb(177, 177, 177)");
                    $("#machine1ordersTable").css("background-color","rgb(177, 177, 177)");
                },
                out: function( event, ui ){
                    if(TypetoCreateMachine1.includes(ui.item.attr("maquinaTipo"))){
                        $("#machine2ordersTable").css("background-color","red");
                        $("#machine1ordersTable").css("background-color","green");
                    }
                    else{
                        $("#machine2ordersTable").css("background-color","green");
                        $("#machine1ordersTable").css("background-color","red");
                    }
                } 
            });

            $("#machine2ordersTable").sortable({
                connectWith: "#machine1ordersTable, #MachinesTable",
                dropOnEmpty: true,
                receive: function(event, ui) {
                    if(TypeToCreateMachine2.includes(ui.item.attr("maquinaTipo"))){
                    
                    }
                    else{
                        $(this).sortable('cancel');
                        $(ui.sender).sortable('cancel');
                        alert("This order is not for this machine")
                    }
                },
                remove: function( event, ui ) {
                    $("#machine2ordersTable").css("background-color","rgb(177, 177, 177)");
                    $("#machine1ordersTable").css("background-color","rgb(177, 177, 177)");
                },
                out: function( event, ui ){
                    if(TypeToCreateMachine2.includes(ui.item.attr("maquinaTipo"))){
                        $("#machine2ordersTable").css("background-color","green");
                        $("#machine1ordersTable").css("background-color","red");
                    }
                    else{
                        $("#machine2ordersTable").css("background-color","red");
                        $("#machine1ordersTable").css("background-color","green");
                    }
                } 
            });
        };

        //Muestra la informacion del pedido al pasar el raton por encima de el
        $(".ordersLi").mouseenter(function () { 
            $("#infoOrder").remove();
            $(this).css("background-color","#4e4f4d");
            let id = $(this).attr("id");
            for (const order of orders) {
                if(order["id"] == id){
                    $("#orderTables").append("<div id = \"infoOrder\">"
                    + "<h4>Order Information</h4>" 
                    + "<span>ID - " + order["id"] + "</span>" 
                    + "<span>Client Name - " + order["clientName"] + "</span>" 
                    + "<span>Piece Name - " + order["pieceName"] + "</span>" 
                    + "<span>Piece Type - " + order["pieceType"] + "</span>" 
                    + "<span>Amount - " + order["amount"] + "</span>" 
                    + "<span>Situation - " + order["situation"] + "</span>"
                    + "<span>Position - " + order["position"] + "</span>" 
                    +"</div>");
                }
            }
            
        });

        //Oculta la informacion cuando quitamos el raton
        $(".ordersLi").mouseleave(function () { 
            $(this).css("background-color","rgb(177, 177, 177)");  
            $("#infoOrder").css("display","none");
        });
            
        
    };

    function chargeOrdersFromLocal(){
        if(PHPRequestOnce2 == 0){
            $.each(orders, function( index, value ){
                let text = value["pieceName"]  + " - " +  value["amount"] + " units";
                $("#MachinesTable").append("<li maquinaTipo = \"" + value["pieceType"] + "\" class = \"ordersLi\" id=\"" + value["id"] + "\">" +  text + "</li>");
            });
            PHPRequestOnce2 = PHPRequestOnce2 + 1;
        }
    };



    /**
    * Funcion para crear crear la cookie de maquinas
    * @param resultMachines Array con todas las maquinas que tiene el servidor
    */
    function createMachines(){
        $.post("PHP/server.php",{getMachines: JSON.stringify("getMachines")},function(data,status){
            var resultMachines = data;
            if(resultMachines != null){
                $.each(resultMachines, function( index, value ){
                        //Añade a la array local de maquinas objetos tipo maquina con los datos del servidor
                        machines.push(new machine(value["id"], value["type"], value["queue"], value["typeCreated"]));
                });
            }
            if (typeof $.cookie('machinesData') === 'undefined'){
                refreshMachinesCookie();
            } else {

            }
        }, "json");
    };

    /**
    * Funcion para crear la cookie de pedidos a partir de la información del servidor
    * @param resultOrders Array con todos los pedidos que tiene el servidor
    */
    function createOrders(){
        $.post("PHP/server.php",{getOrders: JSON.stringify("getOrders")},function(data,status){
            var resultOrders = data;
            if(resultOrders != null){
                $.each(resultOrders, function( index, value ){
                        //Añade a la array local de pedidos objetos de tipo pedido con los datos del servidor
                        orders.push(new order(value["id"], value["clientName"], value["pieceName"], value["pieceType"],
                        value["amount"], value["situation"], value["position"]));
                });
            }
            refreshOrdersCookie()        
        }, "json");
    };

    /**
    * Funcion para recargar la cookie de maquinas a partir de la array local
    */
    function refreshMachinesCookie(){
        $.cookie("machinesData", JSON.stringify(machines));
        localStorage.setItem("machinesData", JSON.stringify(machines));
    }

    /**
    * Funcion para recargar la cookie de pedidos a partir de la array local
    */
    function refreshOrdersCookie(){
        $.cookie("ordersData", JSON.stringify(orders));
        localStorage.setItem("ordersData", JSON.stringify(orders));
    }


});