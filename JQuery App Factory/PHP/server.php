<?php
    $users = array(
        array("user" => "user",
        "password" => "user",
        "rol" => "operario"),
        array("user" => "admin",
        "password" => "admin",
        "rol" => "encargado"),
    );
    $machines = array(
        array("id" => "1",
        "type" => "A",
        "queue" => "0",
        "typeCreated" => "X"),
        array("id" => "2",
        "type" => "B",
        "queue" => "0",
        "typeCreated" => "X"),
    );
    $orders = array(
        array("id" => "1",
        "clientName" => "Jhon",
        "pieceName" => "Screw",
        "pieceType" => "A",
        "amount" => "10",
        "situation" => "S",
        "position" => "1"),
        array("id" => "2",
        "clientName" => "Alex",
        "pieceName" => "Sheet",
        "pieceType" => "B",
        "amount" => "5",
        "situation" => "A",
        "position" => "2"),
        array("id" => "3",
        "clientName" => "Lucia",
        "pieceName" => "PickAxe",
        "pieceType" => "C",
        "amount" => "3",
        "situation" => "A",
        "position" => "3"),
        array("id" => "4",
        "clientName" => "Jessica",
        "pieceName" => "Scissors",
        "pieceType" => "D",
        "amount" => "4",
        "situation" => "B",
        "position" => "4"),
        array("id" => "5",
        "clientName" => "Amanda",
        "pieceName" => "HackSaw",
        "pieceType" => "B",
        "amount" => "1",
        "situation" => "S",
        "position" => "5"),
        array("id" => "6",
        "clientName" => "Ivan",
        "pieceName" => "File",
        "pieceType" => "C",
        "amount" => "7",
        "situation" => "S",
        "position" => "6"),
        array("id" => "7",
        "clientName" => "Pau",
        "pieceName" => "Rasp",
        "pieceType" => "A",
        "amount" => "15",
        "situation" => "A",
        "position" => "7"),
    );

    if(isset($_POST["username"]) and isset($_POST["username"])){
        $result;
        $user = json_decode($_POST["username"]);
        $password = json_decode($_POST["password"]);
        foreach($users as $mainuser){
            if($mainuser["user"] == $user and $mainuser["password"] == $password){
                $result = $mainuser;
            }
            else{

            }
        }
        echo json_encode($result);
    };

    if(isset($_POST["getMachines"])){
        if(json_decode($_POST["getMachines"]) == "getMachines"){
            echo json_encode($machines);
        }
    };

    if(isset($_POST["getOrders"])){
        if(json_decode($_POST["getOrders"]) == "getOrders"){
            echo json_encode($orders);
        }
    };


?>