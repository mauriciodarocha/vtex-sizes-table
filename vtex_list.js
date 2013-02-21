var _vtex_list = {
  container: "._vtex_list",
  img_container: "._vl_img_container",
  selector_container: "._vl_sl_container",
  table_container: "._vl_table",
  // files_url: '/arquivos/',
  files_url: "",
  data: null,
  combo_brand_msg: "Escolha uma marca",
  combo_gen_msg: "Escolha um gênero",
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

          if(_vtex_list.set.structure())
            _vtex_list.set.combo.brand();
        },
        error: function(data,error) {
          if(error=="parsererror")
            _vtex_list.log("O arquivo JSON não é válido.\nVerifique seu JSON com JSONLINT (http://jsonlint.com/)");
        }
      };
      jQuery.ajax(_config);
    }
  },
  set:
  {
    event:
    {
      brand: function () {
        jQuery(_vtex_list.selector_container+"-1 select:not('._activated')").addClass("_activated").change(function () {
          var _selected = jQuery(this).val();
          _vtex_list.set.combo.gen(_selected);
        });
      },
      gen: function () {
        jQuery(_vtex_list.selector_container+"-2 select:not('._activated')").addClass("_activated").change(function () {
          var _selected = jQuery(this).val();
          //_vtex_list.set.table(_selected);
        });
      }
    },
    structure: function()
    {
      if(_vtex_list.data == null) return false;
      if(jQuery(_vtex_list.selector_container).length>0) return true;

      var _div_img = jQuery("<div>").addClass(_vtex_list.img_container.substr(1));
      var _div_selector1 = jQuery("<div>").addClass(_vtex_list.selector_container.substr(1))
        .addClass(_vtex_list.selector_container.substr(1)+"-1");
      var _div_selector2 = jQuery("<div>").addClass(_vtex_list.selector_container.substr(1))
        .addClass(_vtex_list.selector_container.substr(1)+"-2");
      var _div_table_container = jQuery("<div>").addClass(_vtex_list.table_container.substr(1));

      jQuery(_vtex_list.container).append(_div_img).append(_div_selector1).append(_div_selector2).append(_div_table_container);

      return true;
    },
    combo:
    {
      brand: function () {
        var _option,_combo = jQuery("<select>").addClass("_vl_sl").addClass("_vl_sl-1");

        _option = jQuery("<option>").text(_vtex_list.combo_brand_msg);
        jQuery(_combo).append(_option);

        for(i in _vtex_list.data){
          _option = jQuery("<option>",{"value":i}).text(_vtex_list.data[i].texto);
          jQuery(_combo).append(_option);
        }

        jQuery(_vtex_list.selector_container+"-1").html(_combo);
        _vtex_list.set.event.brand();
      },
      gen: function (_current) {
        var _option,_combo = jQuery("<select>").addClass("_vl_sl").addClass("_vl_sl-2");

        _option = jQuery("<option>").text(_vtex_list.combo_gen_msg);
        jQuery(_combo).append(_option);

        for(i in _vtex_list.data[_current]){
          if(i=="texto"||i=="imagem") continue;
          _option = jQuery("<option>",{"value":i}).text(i);
          jQuery(_combo).append(_option);
        }

        jQuery(_vtex_list.selector_container+"-2").html(_combo);
      }
    }
  },
  log: function(msg)
  {
    if(typeof console=="undefined") return false;

    console.log(msg);
  }

}

jQuery(_vtex_list.init);