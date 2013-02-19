var _vtex_list = {
  container: "._vtex_list",
  img_container: "._vl_img_container",
  selector_container: "._vl_selector",
  // files_url: '/arquivos/',
  files_url: "",
  data: null,
  init: function () {
    _vtex_list.load.config();
  },
  load:
  {
    config: function()
    {
      var _config = {
        url: _vtex_list.files_url + 'table-sizes-config.js',
        dataType: "json",
        success: function(data)
        {
          if(typeof data!="object") {
            _vtex_list.log("Verifique arquivo de configuração.\nArquivo não é um JSON válido.");
            return false;
          }
          _vtex_list.data = data;
          _vtex_list.set.selectors();
        }
      };
      jQuery.ajax(_config);
    }
  },
  set:
  {
    selectors: function()
    {
      if(_vtex_list.data == null) return false;

      var _div_img = jQuery("<div>").addClass(_vtex_list.img_container.substr(1));
      var _div_selector1 = jQuery("<div>").addClass(_vtex_list.selector_container.substr(1)).addClass(_vtex_list.selector_container.substr(1)+"-1");
      var _div_selector2 = jQuery("<div>").addClass(_vtex_list.selector_container.substr(1)).addClass(_vtex_list.selector_container.substr(1)+"-2");

      jQuery(_vtex_list.container).append(_div_img).append(_div_selector1).append(_div_selector2);

      // var _img = jQuery("<img>").addClass("_vtex_list_img");

    }
  },
  log: function(msg)
  {
    if(typeof console!="object") return false;

    console.log(msg);
  }

}

jQuery(_vtex_list.init);