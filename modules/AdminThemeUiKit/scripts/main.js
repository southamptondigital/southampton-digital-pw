/**
 * ProcessWire Admin Theme jQuery/Javascript
 *
 * Copyright 2017 by Ryan Cramer
 *
 */

var ProcessWireAdminTheme = {
	
	/**
	 * Initialization to be called before closing </body> tag
	 * 
	 */
	init: function() {
		this.setupInputfields();
		this.setupTooltips();
		this.checkLayout();
	}, 

	/**
	 * Initialize the default ProcessWire admin theme
	 *
	 */
	ready: function() {
		
		this.setupCloneButton();
		ProcessWireAdmin.init();
		this.setupSearch();
		this.setupSideNav();

		var $body = $("body");
		$body.removeClass("pw-init").addClass("pw-ready");

		$(document).on('wiretabclick opened', function(e) {
			$('body').addClass('pw-fake-resize');
			$(window).resize(); // force Uikit to update grid
			setTimeout(function() { $('body').removeClass('pw-fake-resize'); }, 100);
		});
		
		$('a.notice-remove', '#notices').click(function() {
			$('#notices').slideUp('fast', function() { $(this).remove(); });
			return false;
		});
		
		$('a.pw-logo-link').click(this.logoClickEvent);
		
		$('#_ProcessPageEditView').click(function(e) {
			// Uikit tab blocks this link, so this allows it through
			e.stopPropagation();
		});
	
		var resizeTimer = null;
		$(window).resize(function() {
			if(resizeTimer) return;
			resizeTimer = setTimeout(function() {
				ProcessWireAdminTheme.windowResized();
				resizeTimer = null;
			}, 250);
		});
		this.windowResized();
		
		/*
		if($('body').hasClass('pw-layout-main') && typeof window.parent.isPresent != "undefined") {
			// send URL to parent window
			console.log('send: href=' + window.location.href);
			parent.window.postMessage('href=' + window.location.href, '*');
		}
		*/
	},

	/**
	 * If layout is one that requires a frame, double check that there is a frame and correct it if not
	 * 
	 */
	checkLayout: function() {
		if($('body').attr('class').indexOf('pw-layout-sidenav') == -1) return; 
		if($('body').hasClass('pw-layout-sidenav-init')) return;
		if(typeof parent == "undefined" || typeof parent.isPresent == "undefined") {
			var href = window.location.href;
			if(href.indexOf('layout=') > -1) {
				href = href.replace(/([?&]layout)=[-_a-zA-Z0-9]+/, '$1=sidenav-init');
			} else {
				href += (href.indexOf('?') > 0 ? '&' : '?') + 'layout=sidenav-init';
			}
			window.location.href = href;
		}
	},

	/**
	 * Called after window successfully resized
	 * 
	 */
	windowResized: function() {
		
		if($('body').hasClass('pw-fake-resize')) return;
		
		var $masthead = $('#pw-masthead');
		var $mastheadMobile = $('#pw-masthead-mobile');
		var height = $masthead.children('.pw-container').height();
		var maxHeight = parseInt($masthead.data('pw-height'));
		
		if(height > maxHeight) {
			// hide masthead, show mobile masthead
			if(!$masthead.hasClass('pw-masthead-hidden')) {
				$masthead.addClass('pw-masthead-hidden').css({
					position: 'absolute',
					top: '-9999px'
				});
				$mastheadMobile.removeClass('uk-hidden');
			}
		} else {
			// show masthead, hide mobile masthead
			if($masthead.hasClass('pw-masthead-hidden')) {
				$mastheadMobile.addClass('uk-hidden');
				$masthead.removeClass('pw-masthead-hidden').css({
					position: 'relative',
					top: 0
				});
			}
		}
	}, 

	/**
	 * Clone a button at the bottom to the top
	 *
	 */
	setupCloneButton: function() {
		// no head_button in modal view
		if($("body").is(".modal")) return;

		// if there are buttons in the format "a button" without ID attributes, copy them into the masthead
		// or buttons in the format button.head_button_clone with an ID attribute.
		// var $buttons = $("#content a[id=''] button[id=''], #content button.head_button_clone[id!='']");
		// var $buttons = $("#content a:not([id]) button:not([id]), #content button.head_button_clone[id!=]"); 
		var $buttons = $("button.pw-head-button, button.head_button_clone");  // head_button_clone is legacy

		// don't continue if no buttons here or if we're in IE
		if($buttons.length == 0) return; // || $.browser.msie) return;

		var $head = $("#pw-content-head-buttons");
		var $lastToggle = null; 
		var $lastButton = null;
		var toggles = {};

		$buttons.each(function() {
			
			var $t = $(this);
			var $a = $t.parent('a');
			var $button;
			
			// console.log($t.attr('id') + ': ' + $t.attr('class'));
			
			if($a.length > 0) {
				
				$button = $t.parent('a').clone(true);
				$head.prepend($button);

			} else if($t.hasClass('pw-head-button') || $t.hasClass('head_button_clone')) {
				
				$button = $t.clone(true);
				$button.attr('data-from_id', $t.attr('id'))
					.attr('id', $t.attr('id') + '_copy')
					.addClass('pw-head-button'); // if not already present
				
				$button.click(function() {
					$("#" + $(this).attr('data-from_id')).click(); // .parents('form').submit();
					return false;
				});
				
				if($button.hasClass('pw-button-dropdown-toggle')) {
					var id = $button.attr('id').replace('pw-dropdown-toggle-', '');	
					toggles[id] = $button;
				} else if($button.hasClass('pw-button-dropdown-main')) {
					var $wrap = $("<span></span>").addClass('pw-button-dropdown-wrap');
					$wrap.append($button).addClass('uk-float-right');
					$head.prepend($wrap);
				} else {
					$button.addClass('uk-float-right');
					$head.prepend($button);
				}
			}
		});
	
		for(var id in toggles) {
			var $toggle = toggles[id];
			var $button = $('#' + id);
			$button.after($toggle);
		}
	},

	/**
	 * Make the site search use autocomplete
	 *
	 */
	setupSearch: function() {

		$.widget( "custom.adminsearchautocomplete", $.ui.autocomplete, {
			_renderMenu: function(ul, items) {
				var that = this;
				var currentType = "";
				ul.addClass('pw-dropdown-menu-shorter uk-nav uk-nav-default');
				ul.css('z-index', 9999);
				// Loop over each menu item and customize the list item's html.
				$.each(items, function(index, item) {
					// Menu categories don't get linked so that they don't receive
					// keyboard focus.
					if(item.type != currentType) {
						if(currentType.length) {
							$("<li class='uk-nav-divider'></li>").appendTo(ul);
						}
						$("<li>" + item.type + "</li>").addClass("uk-nav-header").appendTo(ul);
						currentType = item.type;
					}
					that._renderItemData(ul, item);
				});
			},
			_renderItem: function(ul, item) {
				if(item.label == item.template) item.template = '';
				return $("<li></li>")
					.append(
						"<a href='" + item.edit_url + "'>" + item.label + " " + 
						"<small class='uk-text-muted'>" + item.template + "</small></a>"
					)
					.appendTo(ul);
			}
		});

		$('.pw-search-form').each(function() {
			
			var $form = $(this);
			var $input = $form.find('.pw-search-input');
			var position = { my: 'right top', at: 'right bottom' };
			
			if($form.closest('.uk-offcanvas-bar').length) {
				position.my = 'left top';
				position.at = 'left bottom';
			}

			$input.adminsearchautocomplete({
				minLength: 2,
				position: position, 
				search: function(event, ui) {
					$form.find(".pw-search-icon").addClass('uk-hidden');
					$form.find(".pw-spinner-icon").removeClass('uk-hidden');
				},
				open: function(event, ui) {
				},
				close: function(event, ui) {
				},
				source: function(request, response) {
					var url = $input.parents('form').attr('data-action') +
						'for?get=template_label,title&include=all&admin_search=' + request.term;
					$.getJSON(url, function(data) {
						var len = data.matches.length;
						if(len < data.total) {
							//$status.text(data.matches.length + '/' + data.total);
						} else {
							//$status.text(len);
						}
						$form.find(".pw-search-icon").removeClass('uk-hidden');
						$form.find(".pw-spinner-icon").addClass('uk-hidden');
						response($.map(data.matches, function(item) {
							return {
								label: item.title,
								value: item.title,
								page_id: item.id,
								template: item.template_label ? item.template_label : '',
								edit_url: item.editUrl,
								type: item.type
							}
						}));
					});
				},
				select: function(event, ui) {
					// follow the link if the Enter/Return key is tapped
					
					$(this).val('');
					event.preventDefault();
					if(typeof parent.isPresent == "undefined") {
						window.location = ui.item.edit_url;
					} else {
						parent.jQuery('#pw-admin-main')[0].contentWindow.document.location.href = ui.item.edit_url;
					}
				}
			}).focus(function() {
				// $(this).siblings('label').find('i').hide(); // hide icon
			}).blur(function() {
				// $status.text('');
				// $(this).siblings('label').find('i').show(); // show icon
			});
		}); 

	},

	/**
	 * Initialize sidebar and offcanvas navigation
	 * 
	 * Enables ajax loading support
	 * 
	 */
	setupSideNav: function() {
		$(".pw-sidebar-nav").on('click', 'a.pw-has-ajax-items', function() {
			var $a = $(this);
			var $ul = $a.closest('li').find('ul');
			var url = $(this).attr('data-json');
			if($ul.hasClass('navJSON')) return false;
			var $spinner = $("<li><i class='fa fa-spin fa-spinner'></i></li>"); 
			$ul.append($spinner);
			$.getJSON(url, function(data) {
				var $a2 = $a.clone();
				var $icon2 = $a2.find('i');
				if(!$icon2.length) {
					$icon2 = $("<i></i>");
					$a2.prepend($icon2);
				}
				$icon2.attr('class', 'fa fa-fw fa-arrow-circle-right pw-nav-icon');
				$a2.removeAttr('data-json').removeAttr('class')
				$a2.find('small').remove(); // i.e. numChildren
				var $li = $("<li></li>").addClass('pw-nav-dup').append($a2);
				$ul.append($li);
				if(data.add) {
					var $li = $(
						"<li class='pw-nav-add'>" +
						"<a href='" + data.url + data.add.url + "'>" +
						"<i class='fa fa-fw fa-" + data.add.icon + " pw-nav-icon'></i>" +
						data.add.label + "</a>" +
						"</li>"
					);
					$ul.append($li);
				}
				// populate the retrieved items
				$.each(data.list, function(n) {
					var icon = '';
					var $label = $("<div>" + this.label + "</div>");
					var label = $label.text();
					if(label.length > 30) {
						// truncate label
						var $small = $label.find('small');
						if($small.length) $small.remove();
						label = $label.text();
						label = label.substring(0, 30);
						var n = label.lastIndexOf(' ');
						if(n > 3) label = label.substring(0, n) + '… ';
						$label.html(label);
						if($small.length) $label.append($small);
						//label = $label.html();
					}
					label = $label.html().replace('&nbsp;', ' ');
					if(this.icon) icon = "<i class='ui-priority-secondary fa fa-fw fa-" + this.icon + " pw-nav-icon'></i>";
					var url = this.url.indexOf('/') === 0 ? this.url : data.url + this.url;
					var $a = $("<a href='" + url + "'>" + icon + label + "</a>");
					var $li = $("<li></li>").append($a);
					if(this.navJSON != "undefined" && this.navJSON) {
						$a.addClass('pw-has-items pw-has-ajax-items').attr('data-json', this.navJSON);
						var $ul2 = $("<ul class='uk-nav-sub uk-nav-parent-icon'></ul>");
						$li.addClass('uk-parent').append($ul2);
						UIkit.nav($ul2, { multiple: true });
					}
					if(typeof this.className != "undefined" && this.className && this.className.length) {
						$li.addClass(this.className);
					}
					if($li.hasClass('pw-nav-add') || $li.hasClass('pw-pagelist-show-all')) {
						$ul.children('.pw-nav-dup').after($li.removeClass('separator').addClass('pw-nav-add'));
					} else {
						$ul.append($li);
					}
				});
				$spinner.remove();
				$ul.addClass('navJSON').addClass('length' + parseInt(data.list.length)).hide();
				if($ul.children().length) $ul.css('opacity', 1.0).fadeIn('fast');
			});
			return false;
		}); 
	},

	/**
	 * Initialize Inputfield forms and Inputfields for Uikit
	 * 
	 */
	setupInputfields: function() {

		function initFormMarkup() {
			// horizontal forms setup
			$("form.uk-form-horizontal").each(function() {
				$(this).find('.InputfieldContent > .Inputfields').each(function() {
					var $content = $(this);
					$content.addClass('uk-form-vertical');
					$content.find('.uk-form-label').removeClass('uk-form-label');
					$content.find('.uk-form-controls').removeClass('uk-form-controls');
				});
				$(this).find('.InputfieldSubmit, .InputfieldButton').each(function() {
					$(this).find('.InputfieldContent').before("<div class='uk-form-label'>&nbsp;</div>");
				});
			});

			// card inputfields setup
			$(".InputfieldNoBorder.uk-card").removeClass('uk-card uk-card-default');

			// offset inputfields setup
			$(".InputfieldIsOffset.InputfieldColumnWidthFirst").each(function() {
				// make all fields in row maintain same offset as first column
				var $t = $(this);
				var $f;
				do {
					$f = $t.next(".InputfieldColumnWidth");
					if(!$f.length || $f.hasClass('InputfieldColumnWidthFirst')) break;
					$f.addClass('InputfieldIsOffset');
					$t = $f;
				} while(true);
			});
	
			// identify first and last rows for each group of inputfields
			$(".Inputfields").each(function() {
				identifyFirstLastRows($(this));
			});

			// update any legacy inputfield declarations
			$(".ui-widget.Inputfield, .ui-widget-header.InputfieldHeader, .ui-widget-content.InputfieldContent")
				.removeClass('ui-widget ui-widget-header ui-widget-content');

			// pagination, if present
			$('.MarkupPagerNav:not(.uk-pagination)').each(function() {
				$(this).addClass('uk-pagination');
			});
		}
		
		function identifyFirstLastRows($inputfields) {
			$(".InputfieldRowFirst", $inputfields).removeClass("InputfieldRowFirst");
			$(".InputfieldRowLast", $inputfields).removeClass("InputfieldRowLast");
			var $in = $inputfields.children(".Inputfield:not(.InputfieldStateHidden):eq(0)");
			if(!$in.length) return; 
			do {
				$in.addClass('InputfieldRowFirst');
				$in = $in.next('.Inputfield:not(.InputfieldStateHidden)');
			} while($in.hasClass('InputfieldColumnWidth') && !$in.hasClass('InputfieldColumnWidthFirst'));
			$in = $inputfields.children('.Inputfield:last-child');
			while($in.length && $in.hasClass('InputfieldStateHidden')) {
				$in = $in.prev('.Inputfield');
			}
			do {
				$in.addClass('InputfieldRowLast');
				if(!$in.hasClass('InputfieldColumnWidth') || $in.hasClass('InputfieldColumnWidthFirst')) break;
				$in = $in.prev('.Inputfield:not(.InputfieldStateHidden)');
			} while($in.hasClass('InputfieldColumnWidth'));
		}

		function ukGridClass(width) {
			var ukGridClass = 'uk-width-1-1';
			if(!width || width >= 100) return ukGridClass;
			for(var cn in ProcessWire.config.ukGridWidths) {
				var pct = ProcessWire.config.ukGridWidths[cn];
				if(width >= pct) {
					ukGridClass = 'uk-width-' + cn + '@m';
					break;
				}
			}
			return ukGridClass;
		}

		function updateInputfieldRow($inputfield) {

			var $inputfields = $inputfield.parent().children('.Inputfield');
			var $lastInputfield = null;
			var width = 0;
			var w = 0;
			var lastW = 0;
			var lastGridClass = '';

			function consoleLog($in, msg) {
				 var id = $in.attr('id');
				 id = id.replace('wrap_Inputfield_', '');
				 console.log(id + ' (width=' + width + ', w=' + w + '): ' + msg);	
			}

			function updateLastInputfield(w) {
				if(!$lastInputfield || !$lastInputfield.length) return;
				var gridClass = '';
				if($lastInputfield.hasClass('InputfieldColumnWidthFirst')) {
					gridClass = 'uk-width-1-1';
				} else if(width > 100) {
					gridClass = '';
				} else if(w >= 100) {
					gridClass = 'uk-width-1-1';
				} else {
					// gridClass = ukGridClass(100 - width);
				}
				if(gridClass.length) {
					if(lastGridClass.length) $lastInputfield.removeClass(lastGridClass);
					$lastInputfield.addClass(gridClass);
				}
			}

			$inputfields.each(function() {

				var $inputfield = $(this);

				if($inputfield.hasClass('InputfieldColumnWidth')) {
					w = parseInt($inputfield.attr('data-colwidth'));
				} else {
					w = 100;
				}

				if($inputfield.hasClass('InputfieldStateHidden')) {
					// hidden, and we'll reserve a spot for it by applying its width to lastInputfield
					width += w;
					updateLastInputfield(w);
					return;
				}

				if(!width || width >= 100) {
					// starting a new row
					width = 0;
				} else if(width + w > 100) {
					// start new row and update width for last column
					updateLastInputfield(lastW);
					width = 0;
				} else {
					// column that isn't first column
					$inputfield.removeClass('InputfieldColumnWidthFirst');
				}

				if(!width) {
					// first column in a row
					$inputfield.addClass('InputfieldColumnWidthFirst');
				}

				width += w;
				lastW = w; 
				$lastInputfield = $inputfield;
				lastGridClass = ukGridClass(w);
				$inputfield.addClass(lastGridClass);
			});

			if(width < 100) {
				consoleLog($lastInputfield, 'outside call because ' + width + '<100');
				updateLastInputfield(w);
			}
		}
		
		var showHideInputfieldTimer = null;

		// event called when an inputfield is hidden or shown
		var showHideInputfield = function(event, inputfield) {
			var $inputfield = $(inputfield);
			if(event.type == 'showInputfield') {
				$inputfield.removeClass('uk-hidden');
			} else {
				$inputfield.show();
				$inputfield.addClass('uk-hidden');
			}
			updateInputfieldRow($inputfield);
			if(showHideInputfieldTimer) return;
			showHideInputfieldTimer = setTimeout(function() {
				identifyFirstLastRows($inputfield.closest('.Inputfields'));
				var $inputfields = $inputfield.find('.Inputfields');
				if($inputfields.length) {
					$inputfields.each(function() {
						identifyFirstLastRows($(this));
					});
				}
				showHideInputfieldTimer = null;	
			}, 100);
		};

		
		$(document).on('reloaded', function() { initFormMarkup() }); // function() intentional
		$(document).on('hideInputfield', showHideInputfield);
		$(document).on('showInputfield', showHideInputfield);

		$('body').addClass('InputfieldColumnWidthsInit');
		initFormMarkup();
	},

	/**
	 * Initialize tooltips, converting jQuery UI tooltips to Uikit tooltips before they get init'd by jQuery
	 * 
	 */
	setupTooltips: function() {
		$('.tooltip, .pw-tooltip').each(function() {
			$(this).removeClass('tooltip pw-tooltip');
			UIkit.tooltip($(this));
		});
	},

	/**
	 * Mouseover event used by _sidenav-side.php and _sidenav-tree.php
	 * 
	 */
	linkTargetMainMouseoverEvent: function() {
		
		var $a = $(this);
		var href = $a.attr('href');
		
		if(href.length < 2) return; // skip '#'
		if($a.attr('target')) return; // already set
		
		/*
		 if(href.indexOf(ProcessWire.config.urls.admin) > -1) {
		 href += (href.indexOf('?') > -1 ? '&' : '?') + 'layout=sidenav-main';
		 $a.attr('href', href);
		 }
		 */
		
		if($a.parent('li').hasClass('PageListActionView')) {
			$a.attr('target', '_top');
		} else {
			$a.attr('target', 'main');
		}
		
	},

	/**
	 * Click event for ProcessWire logo
	 * 
	 */
	logoClickEvent: function() {
		if($('body').hasClass('pw-layout-sidenav-init')) {
			if($('#pw-admin-side').length) {
				// sidebar layout navigation present
				toggleSidebarPane();
			} else {
				// show offcanvas nav
				// $('#pw-admin-main')[0].contentWindow.jQuery('#offcanvas-toggle').click();
				$('#offcanvas-toggle').click();
			}
		} else {
			// show offcanvas nav
			$('#offcanvas-toggle').click();
		}
		return false;
	}
};

$(document).ready(function() {
	ProcessWireAdminTheme.ready();
});
