<?php
/**
 * Created by PhpStorm.
 * User: nickvanboven
 * Date: 20-05-15
 * Time: 12:46
 */

$time_pre = microtime(true);

include_once('park_urls_info.php');

// array om alle gegevens in op te slaan tijdelijk parkids[] -> parkid -> objectids[] -> objectid
$parkids = array();
// Haal alle parken op en voeg id aan lijst toe
foreach ($parken as $park) {
  $parken_xml = simplexml_load_file($park['url']);
  $user = $park['user'];
  $password = $park['password'];
  foreach ($parken_xml as $park_xml) {
    if (0 == 0) {
      //
      $parkids[(int) $park_xml->parkRelephantId] = array();
      $parkids[(int) $park_xml->parkRelephantId]['info'] = array();
      $parkids[(int) $park_xml->parkRelephantId]['info']['user'] = $user;
      $parkids[(int) $park_xml->parkRelephantId]['info']['password'] = $password;
      $parkids[(int) $park_xml->parkRelephantId]['info']['parkMaxxtonId'] = (int)$park_xml->parkMaxxtonId;
    }
  }
}

print "Parken opgehaald\n";

//haal alle parkinfo en objecten op en voeg deze toe aan de lijst
foreach ($parkids as $key => $value) {
  $url = 'http://feeds.roompot.nl/xml/parkinfo?parkid=' . $value['info']['parkMaxxtonId'] . '&user=' . $value['info']['user'] . '&pw=' . $value['info']['password'];
  $park_xml = simplexml_load_file($url);
  $parkobjects = $park_xml->objects;
  foreach ($parkobjects->object as $parkobject) {
    $parkids[$key][] = (int) $parkobject->objectId[0];
  }
}
print "parkid + objectsid opgehaald";


//db connectie opzetten
include_once('database_info.php');

// Create connection
$conn = new mysqli("localhost", $dbUser, $dbPassword, $database);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
else {
  print "connection succes\n";
}

//table legen
$sql = "TRUNCATE TABLE availability";
if ($conn->query($sql) === TRUE) {
  print "DB empty\n";
}
else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}


$nummer = count($parkids);
// alle objecten doorlopen per park
foreach ($parkids as $parkid => $objectids) {

  $user = $objectids['info']['user'];
  $password = $objectids['info']['password'];

  print $nummer . " left\n";
  $nummer -= 1;

  foreach ($objectids as $key => $value) {
    if ($key == 'info') {

    }
    else {
      $url = 'http://feeds.roompot.nl/xml/objectinfo?objectid=' . $value . '&user=' . $user . '&pw=' . $password;
      $object_xml = simplexml_load_file($url);
      $parkavailabilities = $object_xml->availabilities;

      foreach ($parkavailabilities->availability as $availability) {

        $startDate = $availability->startDate;
        $nights = $availability->nights;
        $period = $availability->period;

        $regularPrice = (int) $availability->regularPrice;
        $price = (int) $availability->price;

        $inclusivePrice = (int) $availability->inclusivePrice;
        $inclusiveDiscountPrice = (int) $availability->inclusiveDiscountPrice;
        $bookingUrl = $availability->bookingUrl;

        $sql = "INSERT INTO `parken`.`availability` (`acco_id`, `start_date`, `period`, `price`, `regular_price`, `booking_url`, `nights`, `park_id`, `inclusive_price`, `inclusive_discount_price`) VALUES ('$value', '$startDate', '$period', '$price', '$regularPrice', '$bookingUrl', '$nights', '$parkid', '$inclusivePrice', '$inclusiveDiscountPrice');";

        if ($conn->query($sql) === TRUE) {

        }
        else {
          echo "Error: " . $sql . "<br>" . $conn->error;
        }
      }
    }
  }
}
$conn->close();

$time_post = microtime(true);
$exec_time = $time_post - $time_pre;

print "Import done\n Sec: ".number_format($exec_time,3);

