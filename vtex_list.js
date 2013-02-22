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
  base_url: "/arquivos/",
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
          if(_selected=="")
          {
            _vtex_list.clean.containers();
            return false;
          }
          _vtex_list.set.img(_selected);
          _vtex_list.set.combo.gen(_selected);
        });
      },
      gen: function () {
        jQuery(_vtex_list.selector_container+"-2 select:not('._activated')").addClass("_activated").change(function () {
          var _brand = jQuery(this).attr("brand");
          var _selected = jQuery(this).val();
          if(_selected=="")
          {
            _vtex_list.clean.table();
            return false;
          }
          _vtex_list.set.table(_brand,_selected);
        });
      }
    },
    img: function (selected) {
      var _url = _vtex_list.base_url + _vtex_list.data[selected].imagem;
      var _img = jQuery("<img>",{src:_url});
      jQuery(_vtex_list.img_container).html(_img);
    },
    table: function (brand,selected) {
      var _file = _vtex_list.data[brand][selected]||"";

      if(_file=="") {
        _vtex_list.log("Não foi fornecido nome do arquivo para o carregamento.");
        return false;
      }

      var get_file = function (_file) {
        var _url = _vtex_list.base_url + _file;
        jQuery.ajax({
          url: _url,
          dataType: "text",
          success: function (data) {
            _vtex_list.mount.table(data);
          },
          error: function (jqXHR,error) {
            if(jqXHR.status==404)
            {
              _vtex_list.clean.table();
              _vtex_list.warn("Arquivo \""+_vtex_list.base_url + _file+"\" não encontrado.");
            }
          }
        });
      }
      if(!_vtex_list.check.file(_file))
        get_file(_file);
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

        _option = jQuery("<option>",{"value":""}).text(_vtex_list.combo_brand_msg);
        jQuery(_combo).append(_option);

        for(i in _vtex_list.data){
          _option = jQuery("<option>",{"value":i}).text(_vtex_list.data[i].texto);
          jQuery(_combo).append(_option);
        }

        jQuery(_vtex_list.selector_container+"-1").html(_combo);
        _vtex_list.set.event.brand();
      },
      gen: function (_current) {
        var _option,_combo = jQuery("<select>").attr("brand",_current).addClass("_vl_sl").addClass("_vl_sl-2");

        _option = jQuery("<option>",{"value":""}).text(_vtex_list.combo_gen_msg);
        jQuery(_combo).append(_option);

        for(i in _vtex_list.data[_current]){
          if(i=="texto"||i=="imagem") continue;
          _option = jQuery("<option>",{"value":i}).text(i);
          jQuery(_combo).append(_option);
        }

        jQuery(_vtex_list.selector_container+"-2").html(_combo);
        _vtex_list.set.event.gen();
      }
    }
  },
  mount:
  {
    table: function (data) {
      jQuery(_vtex_list.table_container).text("");

      var _table = jQuery("<table>").addClass("sizes_table");
      var _tr,_td,_lines;
      if(/\r/.test(data)) _lines = data.split("\r"); else _lines = data.split("\n");
      jQuery(_lines).each(function(ndx,item){
        _tr = jQuery("<tr>").addClass("_vltr").addClass("_vltr-"+ndx);
        for(var i=0, _line=item.split(";");i<_line.length;i++)
        {
          _td = jQuery("<td>").addClass("_vltd").addClass("_vltd-"+i).text(_line[i]);
          jQuery(_tr).append(_td);
        }
        jQuery(_table).append(_tr);
      });
      jQuery(_vtex_list.table_container).append(_table);
    }
  },
  clean:
  {
    containers: function ()
    {
      _vtex_list.clean.img();
      _vtex_list.clean.container2();
      _vtex_list.clean.table();
    },
    img: function () {
      jQuery(_vtex_list.img_container).empty();
    },
    container2: function ()
    {
      jQuery(_vtex_list.selector_container+"-2").empty();
    },
    table: function ()
    {
      jQuery(_vtex_list.table_container).empty();
    }
  },
  check:
  {
    file: function (file) {
      // check if file is already on localStorage, if so, place table and return true
      // if false return false to mount table
      return false;
    }
  },
  log: function(msg)
  {
    if(typeof console=="undefined") return false;

    console.log(msg);
  },
  warn: function(msg)
  {
    if(typeof console=="undefined") return false;

    console.warn(msg);
  }

}

jQuery(_vtex_list.init);