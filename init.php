<?php namespace ProcessWire;

/**
 * ProcessWire Bootstrap Initialization
 * ====================================
 * This init.php file is called during ProcessWire bootstrap initialization process.
 * This occurs after all autoload modules have been initialized, but before the current page
 * has been determined. This is a good place to attach hooks. You may place whatever you'd
 * like in this file. For example:
 * 
 * $wire->addHookAfter('Page::render', function($event) {
 *   $event->return = str_replace("</body>", "<p>Hello World</p></body>", $event->return);
 * });
 * 
 */

<?php namespace ProcessWire;

/**
 * ProcessWire Bootstrap Initialization
 * ====================================
 * This init.php file is called during ProcessWire bootstrap initialization process.
 * This occurs after all autoload modules have been initialized, but before the current page
 * has been determined. This is a good place to attach hooks. You may place whatever you'd
 * like in this file. For example:
 *
 * $wire->addHookAfter('Page::render', function($event) {
 *   $event->return = str_replace("</body>", "<p>Hello World</p></body>", $event->return);
 * });
 *
 */

// Create events_listings template
$newTemplateName = 'event_listings';
if(!$templates->$newTemplateName) {
	$fg = new Fieldgroup();
	$fg->name = $newTemplateName;
	$fg->add("title");
	$fg->save();

	$t = new Template();
	$t->name = $newTemplateName;
	$t->fieldgroup = $fg;
	$t->save();
}

// Create events fields and template
$newTemplateName = 'event';

if(!$fields->summary) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeTextarea");
	$f->name = 'summary';
	$f->label = 'Summary of the event';
	$f->save();
}

if(!$fields->href) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeURL");
	$f->name = 'href';
	$f->label = 'Link to the events site';
	$f->save();
}

if(!$fields->ticket_price) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeInteger");
	$f->name = 'ticket_price';
	$f->label = 'Ticket Price';
	$f->save();
}

if(!$fields->group_name) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeText");
	$f->name = 'group_name';
	$f->label = 'Group Name';
	$f->save();
}

if(!$fields->group_contact_info) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeText");
	$f->name = 'group_contact_info';
	$f->label = 'Group Contact Info (email/website/etc)';
	$f->save();
}

if(!$fields->date) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeDatetime");
	$f->name = 'date';
	$f->label = 'Event Start Time';
	$f->save();
}

if(!$fields->date_end) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeDatetime");
	$f->name = 'date_end';
	$f->label = 'Event End Time';
	$f->save();
}

if(!$fields->location) {
	$f = new Field();
	$f->type = $modules->get("FieldtypeText");
	$f->name = 'location';
	$f->label = 'Event Location';
	$f->save();
}

if(!$templates->$newTemplateName) {
	$fg = new Fieldgroup();
	$fg->name = $newTemplateName;
	$fg->add("title");
	$fg->add("Summary2");
	$fg->save();

	$t = new Template();
	$t->name = $newTemplateName;
	$t->fieldgroup = $fg;
	$t->save();
}

// Create intiial pages
if(!$pages->get('/event-listings/')->id) {

  $p = new Page();
  $p->template = 'event_listings';
  $p->parent = $pages->get('/');
  $p->name = 'Event Listings';
  $p->title = 'Event Listings';

  $p->save();
}
