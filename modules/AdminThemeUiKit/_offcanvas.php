<?php namespace ProcessWire;

if(!defined("PROCESSWIRE")) die();

/** @var AdminThemeUikit $adminTheme */
/** @var Paths $urls */
/** @var Config $config */

?>

<!-- OFFCANVAS NAV TOGGLE -->
<a id='offcanvas-toggle' class='uk-hidden' href="#offcanvas-nav" uk-toggle>
	<?php echo $adminTheme->renderIcon('bars fa-lg'); ?>
</a>

<!-- OFFCANVAS NAVIGATION -->
<div id="offcanvas-nav" uk-offcanvas>
	<div class="uk-offcanvas-bar">
		<p>
			<a href='#offcanvas-nav' class='uk-text-muted' onclick='return false;' data-uk-toggle>
				<i class='fa fa-times uk-float-right uk-margin-small-top'></i>
			</a>
			<img width='200' style='margin-left:-5px' src='<?php echo $config->urls($adminTheme->className()); ?>uikit/custom/images/logo.png' />
		<p>	
		<?php include(__DIR__ . '/_search-form.php'); ?>
		<ul class='pw-sidebar-nav uk-nav uk-nav-primary uk-nav-parent-icon uk-margin-small-top' data-uk-nav='animation: false; multiple: true;'>
			<?php echo $adminTheme->renderSidebarNavItems(); ?>
		</ul>	
	</div>
</div>
