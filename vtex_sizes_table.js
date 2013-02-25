;(function( $, undefined ){
  jQuery.fn.vtex_sizes_table = function(_options){

    var _vtex_sizes_table_options = jQuery.extend({
      container: null,
      img_container: "._vl_img_container",
      selector_container: "._vl_sl_container",
      table_container: "._vl_table",
      files_url: '/arquivos/',
      label_brand: "Marca:",
      label_gen: "Gênero:",
      combo_brand_msg: "Escolha uma marca",
      combo_gen_msg: "Escolha um gênero",
      data: null
    }, _options);

    var _vtex_sizes_table = {
      init: function(e) {
        if(_vtex_sizes_table.check.container(e))
          _vtex_sizes_table.load.config();
      },
      load:
      {
        config: function()
        {
          var _config = {
            url: _vtex_sizes_table_options.files_url + 'table-sizes-config.js',
            dataType: "json",
            success: function(data)
            {
              if(typeof data!="object") {
                _vtex_sizes_table.log("Verifique arquivo de configuração.\nArquivo não é um JSON válido.");
                return false;
              }
              _vtex_sizes_table_options.data = data;

              if(_vtex_sizes_table.set.structure())
                _vtex_sizes_table.set.combo.brand();
            },
            error: function(data,error) {
              if(error=="parsererror")
                _vtex_sizes_table.log("O arquivo JSON não é válido.\nVerifique seu JSON com JSONLINT (http://jsonlint.com/)");
            }
          };

          if(!_vtex_sizes_table_options.data)
            jQuery.ajax(_config);
        }
      },
      set:
      {
        event:
        {
          brand: function () {
            jQuery(_vtex_sizes_table_options.selector_container+"-1 select:not('._activated')").addClass("_activated").change(function(){
              var _selected = jQuery(this).val();
              if(_selected=="")
              {
                _vtex_sizes_table.clean.containers();
                return false;
              }
              _vtex_sizes_table.set.img(_selected);
              _vtex_sizes_table.set.combo.gen(_selected);
            });
          },
          gen: function () {
            jQuery(_vtex_sizes_table_options.selector_container+"-2 select:not('._activated')").addClass("_activated").change(function(){
              var _brand = jQuery(this).attr("brand");
              var _selected = jQuery(this).val();
              if(_selected=="")
              {
                _vtex_sizes_table.clean.table();
                return false;
              }
              _vtex_sizes_table.set.table(_brand,_selected);
            });
          }
        },
        img: function (selected) {
          var _url = _vtex_sizes_table_options.files_url + _vtex_sizes_table_options.data[selected].imagem;
          var _img = jQuery("<img>",{src:_url});
          jQuery(_vtex_sizes_table_options.img_container).html(_img);
        },
        table: function (brand,selected) {
          var _file = _vtex_sizes_table_options.data[brand][selected]||"";

          if(_file=="") {
            _vtex_sizes_table.log("Não foi fornecido nome do arquivo para o carregamento.");
            return false;
          }

          var get_file = function (_file) {
            var _url = _vtex_sizes_table_options.files_url + _file;
            jQuery.ajax({
              url: _url,
              dataType: "text",
              success: function (data) {
                _vtex_sizes_table.mount.table(data);
              },
              error: function (jqXHR,error) {
                if(jqXHR.status==404)
                {
                  _vtex_sizes_table.clean.table();
                  _vtex_sizes_table.warn("Arquivo \""+_vtex_sizes_table_options.files_url + _file+"\" não encontrado.");
                }
              }
            });
          }
          if(!_vtex_sizes_table.check.file(_file))
            get_file(_file);
        },
        structure: function()
        {
          if(_vtex_sizes_table_options.data == null) return false;
          if(jQuery(_vtex_sizes_table_options.selector_container).length>0) return true;

          var _div_img = jQuery("<div>").addClass(_vtex_sizes_table_options.img_container.substr(1));
          var _div_selector1 = jQuery("<div>").addClass(_vtex_sizes_table_options.selector_container.substr(1))
            .addClass(_vtex_sizes_table_options.selector_container.substr(1)+"-1");
          var _div_selector2 = jQuery("<div>").addClass(_vtex_sizes_table_options.selector_container.substr(1))
            .addClass(_vtex_sizes_table_options.selector_container.substr(1)+"-2");
          var _div_table_container = jQuery("<div>").addClass(_vtex_sizes_table_options.table_container.substr(1));

          jQuery(_vtex_sizes_table_options.container).append(_div_img).append(_div_selector1).append(_div_selector2).append(_div_table_container);

          return true;
        },
        combo:
        {
          brand: function () {
            var _option,
                _label = jQuery("<label>").addClass("_vl_lbl").addClass("_vl_lbl-1").text(_vtex_sizes_table_options.label_brand),
                _combo = jQuery("<select>").addClass("_vl_sl").addClass("_vl_sl-1");

            _option = jQuery("<option>",{"value":""}).text(_vtex_sizes_table_options.combo_brand_msg);
            jQuery(_combo).append(_option);

            for(i in _vtex_sizes_table_options.data){
              _option = jQuery("<option>",{"value":i}).text(_vtex_sizes_table_options.data[i].texto);
              jQuery(_combo).append(_option);
            }

            jQuery(_vtex_sizes_table_options.selector_container+"-1").html(_label).append(_combo);
            _vtex_sizes_table.set.event.brand();
          },
          gen: function (_current) {
            var _option,
                _label = jQuery("<label>").addClass("_vl_lbl").addClass("_vl_lbl-2").text(_vtex_sizes_table_options.label_gen),
                _combo = jQuery("<select>").attr("brand",_current).addClass("_vl_sl").addClass("_vl_sl-2");

            _option = jQuery("<option>",{"value":""}).text(_vtex_sizes_table_options.combo_gen_msg);
            jQuery(_combo).append(_option);

            for(i in _vtex_sizes_table_options.data[_current]){
              if(i=="texto"||i=="imagem") continue;
              _option = jQuery("<option>",{"value":i}).text(i);
              jQuery(_combo).append(_option);
            }

            jQuery(_vtex_sizes_table_options.selector_container+"-2").html(_label).append(_combo);
            _vtex_sizes_table.set.event.gen();
          }
        }
      },
      mount:
      {
        table: function (data) {
          jQuery(_vtex_sizes_table_options.table_container).text("");

          var _table = jQuery("<table>").addClass("sizes_table");
          var _tr,_td,_lines,_row_class;
          if(/\r/.test(data)) _lines = data.split("\r"); else _lines = data.split("\n");
          jQuery(_lines).each(function(ndx,item){
            _row_class = ndx % 2 == 0 ? "odd" : "even";
            _tr = jQuery("<tr>").addClass("_vltr").addClass("_vltr-"+ndx).addClass("_vltr-"+_row_class);
            for(var i=0, _line=item.split(";");i<_line.length;i++)
            {
              _column_class = i % 2 == 0 ? "odd" : "even";
              _td = jQuery("<td>").addClass("_vltd").addClass("_vltd-"+i).addClass("_vltd-"+_column_class).text(_line[i]);
              jQuery(_tr).append(_td);
            }
            jQuery(_table).append(_tr);
          });
          jQuery(_vtex_sizes_table_options.table_container).append(_table);
        }
      },
      clean:
      {
        containers: function ()
        {
          _vtex_sizes_table.clean.img();
          _vtex_sizes_table.clean.container2();
          _vtex_sizes_table.clean.table();
        },
        img: function () {
          jQuery(_vtex_sizes_table_options.img_container).empty();
        },
        container2: function ()
        {
          jQuery(_vtex_sizes_table_options.selector_container+"-2").empty();
        },
        table: function ()
        {
          jQuery(_vtex_sizes_table_options.table_container).empty();
        }
      },
      check:
      {
        file: function (file) {
          // check if file is already on localStorage, if so, place table and return true
          // if false return false to mount table
          return false;
        },
        container: function(e)
        {
          var result = false;
          if(jQuery(e).length<=0) // This checks if the container is set. Otherwise, nothing will happen.
          {
            _vtex_sizes_table.log("A container is required the list.");
            result = false;
            return result;
          } 

          _vtex_sizes_table_options.container = jQuery(e);
          result = true;

          return result;
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

    return _vtex_sizes_table.init(this);
  }

})( jQuery );