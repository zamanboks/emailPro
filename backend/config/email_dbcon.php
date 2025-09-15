<?php 

// Create connection

$conn = mysqli_connect("localhost", "coolkeyp_asraf_uzzaman", "AsRafsraf(_*_*_)uzzaman@@##", "coolkeyp_asraf_uzzaman");

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }
// header('Access-Control-Allow-Origin: *');
?>