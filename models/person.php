<?php

class Person
{
  public $id;
  public $name;
  public $preferredPosition;
  public $shiftPreferences;
  public $maximumShifts;

  public function __construct($id, $name, $preferredPosition, $maximumShifts)
  {
    $this->id = $id;
    $this->name = $name;
    $this->preferredPosition = $preferredPosition;
    $this->shiftPreferences = "";
    $this->maximumShifts = $maximumShifts;
  }

  static public function getFromDatabase()
  {
    global $conn;
    $response = array();

    $sql = "SELECT * FROM persons";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
      $persons = array();
      while ($row = $result->fetch_assoc()) {
        $persons[] = $row;
      }
      $response['persons'] = $persons;
    } else {
      $response['message'] = 'No data found.';
    }

    return $response;
  }

  // Function to save the person to the database
  public function saveToDatabase()
  {
    global $conn;
    $sql = "INSERT INTO persons (name, preferredPosition, shiftPreferences, maximumShifts) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $this->name, $this->preferredPosition, $this->shiftPreferences, $this->maximumShifts);

    if ($stmt->execute()) {
      $this->id = $conn->insert_id;
      return $this;
    } else {
      return false;
    }
  }

  // Function to update the person in the database
  public function updateInDatabase()
  {
    global $conn;
    $sql = "UPDATE persons SET name=?, preferredPosition=?, shiftPreferences=?, maximumShifts=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssii",
      $this->name,
      $this->preferredPosition,
      $this->shiftPreferences,
      $this->maximumShifts,
      $this->id);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  // Function to delete the person from the database
  public function deleteFromDatabase()
  {
    global $conn;
    $sql = "DELETE FROM persons WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $this->id);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }
}


