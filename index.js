(function() {
	'use strict';

	var fs = require('fs'),
		hth = require('./harToHtml.js');
	
	
	
	fs.readFile(process.argv[2],function(err, har) {
		if(err) throw err;
		
		har = JSON.parse(har);
		
		var encode = function(html) {
			var Ent = require('html-entities').XmlEntities,ent;
			ent = new Ent();
			return ent.encode(html);
		};
		
		var newHar = hth(har, encode);
		
		
		fs.readFile('requestTemplate.html', function(err,template) {
			if(err) throw err;
			
			var html =  '',
				i = 0,
				ilen = newHar.entries.length,
				prop, nHar, _html;
			for(;i<ilen;i++) {
				nHar = newHar.entries[i];
				_html = template.toString();
				for(prop in nHar) {
					_html = _html.replace(new RegExp('{' + prop + '}','g'), nHar[prop]);
				}
				html += _html;
			}
			
			fs.readFile('tableTemplate.html', function(err,tableTemplate) {
				if(err) throw err;
				
				html = tableTemplate.toString().replace('{har}', html);
				
				var tpl, css, js;
				
				
				if(process.argv.indexOf('fullHtml') != -1) {
					html = html.replace('{style}', '').replace('{script}', '');
					tpl = fs.readFileSync('singleViewer.html');
					html = tpl
						.toString()
						.replace('{content}', html)
						.replace('<script src="generator.js"></script>', '');
				}
				else {	
					css = fs.readFileSync('style.css');
					html = html.replace('{style}', '<style>' + css + '</style>');
					
					js = fs.readFileSync('script.js');
					html = html.replace('{script}', '<script>' + js + '</script>');
				}
				
				
				fs.writeFile('testando.html', html, function(err) {
					if(err) throw err;
				});
				
			});
			
			
		});
		
		
	});




})();