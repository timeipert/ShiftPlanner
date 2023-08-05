<?php

class ShiftType
{
    const Morning = 'Morning';
    const Afternoon = 'Afternoon';
    const Evening = 'Evening';
}

class Shift
{
    public $id;
    public $date;
    public $shiftType;
    public $position;
    public $person;

    public function __construct($id, $date, $shiftType, $position)
    {
        $this->id = $id;
        $this->date = $date;
        $this->shiftType = $shiftType;
        $this->position = $position;
        $this->person = null;
    }

    public static function getFromDatabase()
    {
        global $conn;
        $response = array();

        $sql = "SELECT * FROM shifts";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $shifts = array();
            while ($row = $result->fetch_assoc()) {
                $shifts[] = $row;
            }
            $response['shifts'] = $shifts;
        } else {
            $response['message'] = 'No data found.';
        }

        return $response;
    }

    public
    function saveToDatabase()
    {
        global $conn;
        $sql = "INSERT INTO shifts (date, shiftType, position) VALUES ('$this->date', '$this->shiftType', '$this->position')";
        if ($conn->query($sql) === true) {
            $this->id = $conn->insert_id;
            return $this;
        } else {
            return false;
        }
    }

// Function to update the shift in the database
    public
    function updateInDatabase()
    {
        global $conn;
        $sql = "UPDATE shifts SET date='$this->date', shiftType='$this->shiftType', position='$this->position' WHERE id=$this->id";
        if ($conn->query($sql) === true) {
            return true;
        } else {
            return false;
        }
    }

// Function to delete the shift from the database
    public
    function deleteFromDatabase()
    {
        global $conn;
        $sql = "DELETE FROM shifts WHERE id=$this->id";
        if ($conn->query($sql) === true) {
            return true;
        } else {
            return false;
        }
    }
}


