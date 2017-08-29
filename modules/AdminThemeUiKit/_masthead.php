<?php namespace ProcessWire;

if(!defined("PROCESSWIRE")) die();

/** @var AdminThemeUikit $adminTheme */
/** @var User $user */
/** @var array $extras */
/** @var Paths $urls */
/** @var Config $config */
/** @var Notices $notices */

?>
<header id='pw-masthead-mobile' class='pw-masthead uk-hidden uk-background-muted'>
	<div class='pw-container uk-container uk-container-expand'>
		<div class='uk-padding-small uk-text-center'>
			<a href='#' class='pw-logo-link'>
				<img class='pw-logo' src='<?php echo $adminTheme->getLogoURL(); ?>' alt='ProcessWire' />
			</a>
		</div>	
	</div>	
</header>
<header id='pw-masthead' class='pw-masthead uk-background-muted' data-pw-height='80'>
	<div class='pw-container uk-container uk-container-expand'>
		<nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
			<div class="uk-navbar-left">
				<a class="pw-logo-link uk-logo uk-margin-right" href='#'>
					<img class='pw-logo' src='<?php echo $adminTheme->getLogoURL(); ?>' alt='ProcessWire'>
				</a>
				<?php if($adminTheme->isLoggedIn): ?>
				<ul class='uk-navbar-nav pw-primary-nav'>
					<?php echo $adminTheme->renderPrimaryNavItems(); ?>
				</ul>	
				<?php endif; ?>
			</div>
			<?php if($adminTheme->isLoggedIn): ?>
			<div class="uk-navbar-right">
				<ul class='uk-navbar-nav uk-margin-right pw-user-nav'>
					<li>
						<a id="tools-toggle" class="pw-dropdown-toggle" href="<?php echo $urls->admin; ?>profile/">
							<?php echo $adminTheme->renderNavIcon('user') . $user->name; ?>
						</a>
						<ul class="pw-dropdown-menu" data-my="left top" data-at="left bottom" style="display: none;">
							<?php if($config->debug && strpos($adminTheme->layout, 'sidenav') === false): ?>
							<li>	
								<a href='#' onclick="$('#debug_toggle').click(); return false;">
									<?php echo $adminTheme->renderNavIcon('bug') . __('Debug'); ?>
								</a>
							</li>
							<?php endif; ?>
							<!--
							<li>	
								<a target='_top' href='<?php echo $urls->admin; ?>?admin_layout=sidenav'>
									<?php echo $adminTheme->renderNavIcon('indent') . __('Enable sidebars'); ?>
								</a>
							</li>
							-->
							<?php echo $adminTheme->renderUserNavItems(); ?>
						</ul>
					</li>
				</ul>	
			
				<?php include(__DIR__ . '/_search-form.php'); ?>
				
			</div>
			<?php endif; // loggedin ?>
		</nav>
	</div>
	<?php echo $adminTheme->renderExtraMarkup('masthead'); ?>
</header>
<?php if(strpos($adminTheme->layout, 'sidenav-tree') === false) echo $adminTheme->renderNotices($notices); ?>

