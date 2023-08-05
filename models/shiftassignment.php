<?php

class Availability
{
  const No = 0;
  const Maybe = 1;
  const Yes = 2;
}

class ShiftAssignment
{
  public $date;
  public $morning;
  public $afternoon;
  public $evening;

  public function __construct($personId, $date, $morning, $afternoon, $evening)
  {
    $this->personId = $personId;
    $this->date = $date;
    $this->morning = $morning;
    $this->afternoon = $afternoon;
    $this->evening = $evening;
  }

  public static function getFromDatabase()
  {
    global $conn;
    $response = array();

    $sql = "SELECT * FROM shift_assignments";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
      $shift_assignments = array();
      while ($row = $result->fetch_assoc()) {
        $shift_assignments[] = $row;
      }
      $response['shift_assignments'] = $shift_assignments;
    } else {
      $response['message'] = False;
    }

    return $response;
  }
  public static function getFromDatabaseById($personid)
  {
    global $conn;
    $response = array();
    $sql = "SELECT * FROM shift_assignments WHERE `person` = ?";
    $result = $conn->prepare($sql);
    $result->bind_param("i", $personid);
    $result->execute();

    if ($result->num_rows > 0) {
      $shift_assignments = array();
      while ($row = $result->fetch_assoc()) {
        $shift_assignments[] = $row;
      }
      $response['shift_assignments'] = $shift_assignments;
    } else {
      $response['message'] = False;
    }

    return $response;
  }

  // Function to save the shift assignment to the database
  public function saveToDatabase()
  {
    global $conn;
    $sql = "INSERT INTO shift_assignments (person, date, morning, afternoon, evening) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isiis", $this->personId, $this->date, $this->morning, $this->afternoon, $this->evening);

    if ($stmt->execute()) {
      $this->id = $conn->insert_id;
      return $this;
    } else {
      return false;
    }
  }

  // Function to update the shift assignment in the database
  public function updateInDatabase()
  {
    global $conn;
    $sql = "UPDATE shift_assignments SET morning=?, afternoon=?, evening=? WHERE date=? & person=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iissi", $this->morning, $this->afternoon, $this->evening, $this->date, $this->personId);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  // Function to delete the shift assignment from the database
  public function deleteFromDatabase()
  {
    global $conn;
    $sql = "DELETE FROM shift_assignments WHERE date=? & person = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $this->date, $this->personId);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }
}


