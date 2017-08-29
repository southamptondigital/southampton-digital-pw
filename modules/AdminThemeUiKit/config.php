<?php namespace ProcessWire;

if(!defined("PROCESSWIRE")) die();

/**
 * Implementation for Uikit admin theme getConfigInputfields method
 * 
 * @param AdminTheme|AdminThemeUikit $adminTheme
 * @param InputfieldWrapper $inputfields
 * 
 */
function AdminThemeUikitConfig(AdminTheme $adminTheme, InputfieldWrapper $inputfields) {

	$defaultNote = __('When blank, the default file used.') . ' ';
	$defaultDesc = __('Enter path relative to homepage URL.');

	$modules = $adminTheme->wire('modules');
	$session = $adminTheme->wire('session');
	$layout = $adminTheme->layout;

	/** @var InputfieldRadios $f */
	$f = $modules->get('InputfieldRadios');
	$f->attr('name', 'layout');
	$f->label = __('Layout');
	$f->addOption('', __('Masthead navigation only (RECOMMENDED)'));
	$opt = __('Masthead navigation + page tree navigation in sidebar');
	$f->addOption('sidenav-tree', $opt . ' ' . __('(left)'));
	$f->addOption('sidenav-tree-alt', $opt . ' ' . __('(right)')); 
	$f->addOption('sidenav', __('Sidebar navigation (left) + page tree navigation (right)'));
	$f->attr('value', $layout);
	$f->icon = 'newspaper-o';
	$inputfields->add($f);

	$lastLayout = $session->getFor($adminTheme, 'lastLayout');
	if($lastLayout != $layout) {
		$o = '[script]';
		if(strpos($layout, 'sidenav') === 0) {
			$o .=
				"if(typeof parent.isPresent != 'undefined') {" .
				"   parent.location.href = './?layout=sidenav-init';" .
				"} else {" .
				"   window.location.href = './?layout=sidenav-init';" .
				"}";
		} else {
			$o .=
				"if(typeof parent.isPresent != 'undefined') {" .
				"   parent.location.href = './edit?name=$adminTheme->className';" .
				"}";
		}
		$o .= '[/script]';
		$f->appendMarkup = str_replace(array('[', ']'), array('<', '>'), $o);
	}

	if(empty($_POST)) $session->setFor($adminTheme, 'lastLayout', $layout);

	/** @var InputfieldFieldset $fieldset */
	$fieldset = $modules->get('InputfieldFieldset');
	$fieldset->label = __('Custom files');
	$fieldset->collapsed = Inputfield::collapsedBlank;
	$fieldset->icon = 'files-o';
	$inputfields->add($fieldset);

	/** @var InputfieldText $f */
	$f = $modules->get('InputfieldText');
	$f->attr('name', 'cssURL');
	$f->attr('value', $adminTheme->get('cssURL'));
	$f->label = __('Primary CSS file');
	$f->description = $defaultDesc;
	$f->notes = $defaultNote . "\nsite/modules/AdminThemeUikit/uikit/dist/css/uikit.pw.css";
	$f->collapsed = Inputfield::collapsedBlank;
	$f->icon = 'file-code-o';
	$fieldset->add($f);

	/** @var InputfieldText $f */
	$f = $modules->get('InputfieldText');
	$f->attr('name', 'logoURL');
	$f->attr('value', $adminTheme->get('logoURL'));
	$f->label = __('Logo image file');
	$f->description = $defaultDesc;
	$f->notes = $defaultNote . __('File should be PNG, GIF or JPG and at least 100px in both dimensions.');
	$f->collapsed = Inputfield::collapsedBlank;
	$f->icon = 'file-image-o';
	$fieldset->add($f);

	/** @var InputfieldFieldset $fieldset */
	$fieldset = $modules->get('InputfieldFieldset');
	$fieldset->label = __('Form field visibility settings');
	$fieldset->description =
		__('These settings affect all form fields in the admin.') . ' ' .
		__('Any of these settings (and others) may also be specified individually for a given field.') . ' ' .
		__('If you specify a setting here, it will override individual field settings.') . ' ' .
		__('See: Setup > Fields > [any field] > Visibility > Theme settings.');
	$fieldset->icon = 'flask';
	$fieldset->collapsed = Inputfield::collapsedBlank;
	$inputfields->add($fieldset);

	$types = $modules->findByPrefix('Inputfield');
	ksort($types);
	$skipTypes = array('Button', 'Submit', 'Form', 'Hidden');
	foreach($types as $key => $name) {
		$name = str_replace('Inputfield', '', $name);
		if(in_array($name, $skipTypes)) {
			unset($types[$key]);
		} else {
			$types[$key] = $name;
		}
	}

	/** @var InputfieldAsmSelect $f */
	$f = $modules->get('InputfieldAsmSelect');
	$f->attr('name', 'noBorderTypes');
	$f->label = __('Input types that should have no border');
	$f->description = __('This setting applies to any selected types when used at 100% width.');
	$f->icon = 'low-vision';
	$f->set('themeOffset', true);
	foreach($types as $className => $name) {
		$f->addOption($className, $name);
	}
	$f->attr('value', $adminTheme->noBorderTypes);
	$fieldset->add($f);

	/** @var InputfieldAsmSelect $f */
	$f = $modules->get('InputfieldAsmSelect');
	$f->attr('name', 'cardTypes');
	$f->label = __('Input types that should use the “Card” style');
	$f->description = __('This field is an example of the card style.');
	$f->notes = __('Does not apply to types selected to have no border.');
	$f->icon = 'list-alt';
	$f->set('themeBorder', 'card');
	$f->set('themeOffset', true);
	foreach($types as $className => $name) {
		$f->addOption($className, $name);
	}
	$f->attr('value', $adminTheme->cardTypes);
	$fieldset->add($f);

	/** @var InputfieldAsmSelect $f */
	$f = $modules->get('InputfieldAsmSelect');
	$f->attr('name', 'offsetTypes');
	$f->label = __('Input types that should be vertically offset');
	$f->description = __('You can select types individually here, or you can offset ALL types by using the field below this.');
	$f->icon = 'arrows-v';
	foreach($types as $className => $name) {
		$f->addOption($className, $name);
	}
	$f->attr('value', $adminTheme->offsetTypes);
	$f->showIf = 'useOffset=0';
	$fieldset->add($f);

	/** @var InputfieldCheckboxes $f */
	$f = $modules->get('InputfieldCheckbox');
	$f->attr('name', 'useOffset');
	$f->label = __('Vertically offset ALL input types?');
	$f->description =
		__('When checked, a vertical margin is added to every field.') . ' ' .
		__('This may provide additional clarity in some cases, but consumes more vertical space.');
	$f->collapsed = Inputfield::collapsedBlank;
	$f->icon = 'arrows-v';
	if($adminTheme->useOffset) $f->attr('checked', 'checked');
	$fieldset->add($f);

}