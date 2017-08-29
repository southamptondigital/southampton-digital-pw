<?php namespace ProcessWire;

$eventListings = $pages->findOne("template=event_listings")->children();


$view->set('eventListings', $eventListings);
