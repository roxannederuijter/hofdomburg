<?php
/**
 * Created by PhpStorm.
 * User: nickvanboven
 * Date: 20-05-15
 * Time: 12:46
 */

$parken = array();

    $naam = 'roompot';
$parken[$naam]['url'] = 'http://feeds.roompot.nl/xml/parklist?user=rp_business&pw=rpbus1zc';
$parken[$naam]['user'] = 'rp_business';
$parken[$naam]['password'] = 'rpbus1zc';
$parken[$naam]['prefix'] = 'rp';


$naam = 'hb';
$parken[$naam]['url'] = 'http://feeds.roompot.nl/xml/parklist?user=hb_business&pw=hbb1zz';
$parken[$naam]['user'] = 'hb_business';
$parken[$naam]['password'] = 'hbb1zz';



?>