<?php
// Convert the response array to JSON and send it as the API response
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');


// Include database connection file
include_once 'db_connect.php';
include_once 'models/person.php';
include_once 'models/shift.php';
include_once 'models/shiftassignment.php';

// Define response array
$response = array();

// Check for the HTTP method (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];
//echo json_encode($_POST);

// Process the request based on the HTTP method
switch ($method) {
  case 'GET':
    if ($_GET["action"] == "person") {
      $response['message'] = Person::getFromDatabase();
    } elseif ($_GET["action"] == "shift") {
      $response['message'] = Shift::getFromDatabase();
    } elseif ($_GET["action"] == "shift_assignments") {

      if(isset($_GET["id"])) {
        $response['message'] = ShiftAssignment::getFromDatabaseById($_GET["id"]);
      }else {
        $response['message'] = ShiftAssignment::getFromDatabase();
      }
    }
    break;
  case 'POST':
    $json = file_get_contents('php://input');
    $array = json_decode($json, true);

    if ($array["action"] == "person") {
      $person = new Person(null, $array["name"], $array["preferredPosition"], $array["maximumShifts"]);
      $response['message'] = $person->saveToDatabase();
    } elseif ($array["action"] == "shift") {
      $shift = new Shift(null, $array["date"], $array["shiftType"], $array["position"]);
      $response['message'] = $shift->saveToDatabase();
    } elseif ($array["action"] == "shift_assignments") {
      $shiftAssignment = new ShiftAssignment($array["personID"], $array["date"], $array["morning"], $array["afternoon"], $array["evening"]);
      $response['message'] = $shiftAssignment->saveToDatabase();
    }
    break;
  case 'PUT':
    $json = file_get_contents('php://input');
    $array = json_decode($json, true);
    if ($array["action"] == "person") {
      $person = new Person($array["id"], $array["name"], $array["preferredPosition"], $array["maximumShifts"]);
      $person->shiftPreferences = $array["shiftPreferences"];
      $response['message'] = $person->updateInDatabase();
    } elseif ($array["action"] == "shift") {
      $shift = new $array($_POST["id"], $array["date"], $array["shiftType"], $array["position"]);
      $response['message'] = $shift->updateInDatabase();
    } elseif ($array["action"] == "shift_assignments") {
      $shiftAssignment = new ShiftAssignment($array["date"], $array["morning"], $array["afternoon"], $array["evening"]);
      $response['message'] = $shiftAssignment->updateInDatabase();
    }
    break;
  case 'DELETE':

    if ($_GET["action"] == "person") {
      $person = new Person($_GET["id"], null, null, null);
      $response['message'] = $person->deleteFromDatabase();
    } elseif ($_GET["action"] == "shift") {
      $shift = new Shift($_GET["id"], null, null, null);
      $response['message'] = $shift->deleteFromDatabase();
    } elseif ($_GET["action"] == "shift_assignments") {
      $shiftAssignment = new ShiftAssignment($_GET["date"], 0, 0, 0);
      $response['message'] = $shiftAssignment->deleteFromDatabase();
    }
    break;
  default:
    // Invalid request method
    $response['error'] = true;
    $response['message'] = 'Invalid request method.';
    break;
}
echo json_encode($response);


?>
