(function ($) {

	if (!wgIsArticle) return;

	// check for support
	
	if (
		!window.getSelection ||
		!Date.prototype.toISOString
	) return;
	

	// UI: a button marked [citation needed] when selection complete

	var $btn = $('<button />').css(
		{
			position: 'absolute',
			fontSize: '8px'
		}
	).bind(
		'click',
		function () {
			var selection = getSelection();
			if (selection.text !== '') {
				$btn.attr('disabled', true).text('Working...');
				citationNeeded(
					selection,
					function () {
						return window.confirm('Add [citation needed] to following selected text?\n\n' + selection.text);
					},
					function () {
						$btn.text('Done! Reloading...');
					}
				);
			}
		}
	);
	
	resetUI();
	
	$(document.body).append($btn);

	$('#bodyContent').bind(
		'mouseup', // FIXME mouseup fires before selection being removed by a single click
		function (ev) {
			var selection = getSelection();
			if (selection.text !== '') {
				$btn.css({
					top: ev.pageY - 20,
					left: ev.pageX
				}).fadeIn(200);
			} else {
				$btn.fadeOut(200);
			}
		}
	);

	function resetUI() {
		$btn.text('[citation needed]').attr('disabled', false);
	}

	// Functions

	function editSection( sectionId, token, summary, content, callback) {
		$.ajax({
			url: wgScriptPath + '/api.php',
			data: {
				'action': 'edit',
				'title': wgPageName,
				'section': sectionId,
				'summary': summary,
				'text': content,
				'format': 'json',
				'token': token
			},
			dataType: 'json',
			type: 'POST',
			success: function( data ) {
				if ( data.edit.result == 'Success' ) {
					callback();
					window.location.reload(); // reload page if edit was successful
				} else {
					alert( 'Error: Unknown result from API.' );
				}
			},
			error: function( xhr ) {
				alert( 'Error: Edit failed.' );
				resetUI();
			}
		});
	}

	// https://secure.wikimedia.org/wikipedia/mediawiki/wiki/Manual:Edit_token#Retrieving_via_Ajax
	function getEditToken(callback) {
		$.getJSON(
			wgScriptPath + '/api.php?',
			{
				action: 'query',
				prop: 'info',
				intoken: 'edit',
				titles: wgPageName,
				indexpageids: '',
				format: 'json'
			},
			function( data ) {
				if ( data.query.pages && data.query.pageids ) {
					var pageid = data.query.pageids[0],
					wgEditToken = data.query.pages[pageid].edittoken;
					callback(wgEditToken);
				}
			}
		)
	}
	
	function getSelection() {
		// https://developer.mozilla.org/en/DOM/window.getSelection
		// TBD: multiple ranges
		var range = window.getSelection();
		return {
			text: range.getRangeAt(0).toString(),
			element: range.anchorNode.parentNode // anchorNode.nodeName == #text
		};
	}
	
	function getSectionID(el) {
		return (
			(
				$(el).parents('#bodyContent > *').prevAll('h2,h3,h4,h5,h6').find('.editsection > a').get(0) ||
				$(el).prevAll('h2,h3,h4,h5,h6').find('.editsection > a').get(0) ||
				{ search: 'section=0' }
			).search.match(/section=(\d+)/) ||
			['', 0]
		)[1];
	}

	function getSectionContent(id, success) {
		$.ajax({
			url: wgScriptPath + '/index.php',
			data: {
				'action': 'raw',
				'title' : wgPageName,
				'section': id,
				'oldid': wgCurRevisionId // Need oldid to exclude cache
			},
			dataType: 'text',
			type: 'GET',
			success: success,
			error: function ( xhr ) {
				alert( 'Error: get raw fail.');
			}
		});
	}

	function citationNeeded(selection, beforeEdit, callback) {
		var sectionId = getSectionID(selection.element);
		getSectionContent(
			sectionId,
			function (text) {
				var replacedText = text.replace(
					new RegExp(selection.text),
					selection.text + '{{Fact|time=' + (new Date()).toISOString().replace(/\.\d+Z$/, 'Z') + '}}'
				);

				if (replacedText.length === text.length) {
					alert('Sorry, but I couldn\'t find the place to insert {{Fact}} in the wikitext.');
					resetUI();
					return;
				}

				if (!beforeEdit()) {
					resetUI();
					return;
				}

				getEditToken(
					function (token) {
						editSection(
							sectionId,
							token,
							'[citation needed]: ' + selection.text,
							replacedText,
							callback
						);
					}
				);
			}
		);
	}

})(jQuery);