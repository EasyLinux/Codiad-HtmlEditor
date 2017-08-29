/*
 * Copyright (c) 2017 Serge NOEL <serge.noel@net6a.com> , distributed
 * as-is and without warranty under the MIT License.
 * See http://opensource.org/licenses/MIT for more information.
 * This information must remain intact.
 */

(function(global, $){
    
    var codiad = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/',
        self;

		var CKEditorGetURL = function( resource )
			{
				var CKEditorBase = '/'+path.split('/').slice(3, -1).join('/')+'/ckeditor/';
				
				return CKEditorBase;
			};
	

/*console.log('Dans init.js de HtmlEditor');
console.log('Chemin :' + curpath);
console.log('Appel de CKEDITOR_GETURL: '+CKEDITOR_GETURL());*/


    $(function() {
        codiad.tinyMCE.init();
    });

    codiad.tinyMCE = {
        
        path    : curpath,
        callback: this.showResult,
        default : "",
        defObj  : {},
        file    : "",
        
        init: function() {
            var _this   = this;
            self        = this;
            //Context callbacks
            amplify.subscribe("context-menu.onShow", function(obj){
                var ext = _this.getExtension(obj.path);
                //console.log('Root: ' + $('#file-manager a[data-type="root"]').attr('data-path')); 
                //console.log('File: ' + $('#context-menu').attr('data-path'));
                if (ext == "html" || ext == "twig") {
                    $('#context-menu').append('<hr class="file-only tinyMCE">');
                    $('#context-menu').append('<a class="file-only tinyMCE" onclick="codiad.tinyMCE.Edit($(\'#context-menu\').attr(\'data-path\'), true);"><span class="icon-eye"></span>CKEditor</a>');
                    
                }
            });
            amplify.subscribe("context-menu.onHide", function(){
                $('.tinyMCE').remove();
            });

            // Load CKeditor
            window.CKEDITOR_BASEPATH = path.split('/').slice(0, -1).join('/')+'/ckeditor/';
            //$.getScript(this.path+'ckeditor/ckeditor.js');
            $.getScript("https://cdn.ckeditor.com/4.7.2/standard/ckeditor.js");
            // <script src="https://cdn.ckeditor.com/4.7.2/standard/ckeditor.js"></script>

        },
        
        /**
         *
         *  Edit html file
         *
         * @parameter path           {String}  File path
         * @parameter isAbsolutePath {bool}    Has project an absolute path
        */
        Edit: function(path, isAbsolutePath) {
        	  console.log('ckeditor: ' + this.file+'/ckeditor');
            var ext = this.getExtension(path);
            if (ext == "html" || ext == "twig") {
                this.file = path;
                console.log("Fichier : "+ this.file);
                
                codiad.modal.load(800, this.path+"dialog.php?file=" + encodeURI(this.file));
                /*$('#modal-content').dialog(
      							{
        						bgiframe: true,
        						autoOpen: false,
        						height: 700,
        						modal: false});*/
        				//$('#modal-content').load(this.path+"dialog.php?file=" + encodeURI(this.file)).dialog('open');
        				
                
                //CKEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/', 'my_plugin.js' );

                // Wait for EditHtml (to load)
                var checkExist = setInterval(function() {
  									if ($('#EditHtml').length) {
  										clearInterval(checkExist);
      								//console.log("document chargé");
      								//console.log('Test function: ' + CKEditorGetURL());
      								//CKEDITOR.basePath = CKEditorGetURL();
      								//console.log('plugins: ' + CKEditorGetURL() + 'plugins/');
      								//document.getElementById('EditHtml').value = "test";
      								CKEDITOR.replace('EditHtml',{
    												language: 'fr'
    												//uiColor: '#202020'
    												//extraPlugins: 'save'
													});
  										} 
										}, 100); // check every 100ms
                
                
                
								
            }
        },

        getExtension: function(path) {
            return path.substring(path.lastIndexOf(".")+1);
        },
        
    };
})(this, jQuery);