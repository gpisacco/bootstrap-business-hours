 
 /* ========================================================================
 * Copyright 2011-2014 Gaston Pisacco
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * ======================================================================== 
 * Translations extracted from momentjs
 */
 


 (function (factory) {
     if (typeof define === 'function' && define.amd) {
         define(['jquery'], factory);
     }
     else {
         factory(jQuery);
     }
 }(function ($,moment) {
  'use strict';

  // BussinessHours CLASS DEFINITION
  // ======================

  var languages={};
  languages.no={
      weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
      weekdaysShort : "sø._ma._ti._on._to._fr._lø.".split("_"),
      weekdaysMin : "sø_ma_ti_on_to_fr_lø".split("_"),
  }
  languages.en=languages.gb=languages.us={
      weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
      weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
  }
  
  languages.fi={
      weekdays : "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
      weekdaysShort : "su_ma_ti_ke_to_pe_la".split("_"),
      weekdaysMin : "su_ma_ti_ke_to_pe_la".split("_"),
  }
  
  languages.es={
      weekdays : "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
      weekdaysShort : "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
      weekdaysMin : "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
  }

  var BussinessHours = function (element, options) {
    this.options   = options;
    this.$element  = $(element);
	var data={};
	if(this.options.data!=undefined){
		 data=this.options.data;
	}
	console.log(options);
	
	
	var locale=languages[options.lang.toLowerCase()];
	var newTd='';
	var $opt='<option class="'+options.optionClass+'" value="" >--:--</option>';
	var h=0,m=0,ms='00';
	
	for(var j=0;j<48;j++){
		$opt+=('<option class="'+options.optionClass+'" value="'+m+'">'+h+':'+ms+'</option>');
		if(j%2==0){
			m=h*100+30;
			ms='30';
		}else{		
			h++;
			m=h*100;
			ms='00'
		}
	}
	$opt+='<option class="'+options.optionClass+'" value="2400" >23:59</option>';
	
	var checked='';
	for (var i=0;i<7;i++) {
		if (data[i]!=undefined){
			checked='checked="true"';
		}
		
		newTd+=('<div class="row no-margin day">');
			newTd+=('<div class="checkbox col-xs-2"><label><input class="day_cb '+options.checkboxClass+'" type="checkbox" value="'+i+'" id="'+i+'_checkbox" '+checked+'/>'+locale.weekdays[i]+'</label></div>');
			newTd+=('<div class="col-xs-2"><select name="schedule[\'day_'+i+'\'].start" id="'+i+'start" class="day_o_select '+options.selectClass+' form-control input-sm" >');
			newTd+=$opt;
			newTd+=('</select></div>');
			newTd+=('<div class="col-xs-2"><select name="schedule[\'day_'+i+'\'].end"   id="'+i+'end" class="day_c_select '+options.selectClass+' form-control form-grop input-sm" >')
			newTd+=$opt;
			newTd+=('</select></div>');
		newTd+=('</div>');
		checked='';
	}
	this.$element.append(newTd);
	
	for (var i=0;i<7;i++) {
		if (data[i]!=undefined){
			this.$element.find('#'+i+'start').find('option[value="'+data[i][0].from+'"]').attr('selected','true');
			this.$element.find('#'+i+'end').find('option[value="'+data[i][0].to+'"]').attr('selected','true');
		}
	}
	
	//Block hours higher lower than start one
	this.$element.find('.day_o_select').change($.proxy(function(e){
		var elem=e.currentTarget.id.replace('start','');
		var val=parseInt($(e.currentTarget).find('option:selected').val());
		var options=this.$element.find('#'+elem+'end option');
		$(options).attr('disabled',false);
		
		var selected=this.$element.find('#'+elem+'end option:selected').val();
		if(selected!=undefined && selected!=''){
			this.$element.find('#'+elem+'_checkbox').attr('checked','true');
		}
		
		for(var i=0;i<options.size();i++){
			if($(options[i]).val()!='' && parseInt($(options[i]).val())<=val){
				$(options[i]).attr('disabled',true);
			}
		}
	},this));
	
	
	this.$element.find('.day_c_select').change($.proxy(function(e){
		var elem=e.currentTarget.id.replace('end','')
		var val=parseInt($(e.currentTarget).find('option:selected').val());
		var options=this.$element.find('#'+elem+'start option');
		$(options).attr('disabled',false);
		
		var selected=this.$element.find('#'+elem+'start option:selected').val();
		if(selected!=undefined && selected!=''){
			this.$element.find('#'+elem+'_checkbox').attr('checked','true');
		}
		
		
		for(var i=0;i<options.size();i++){
			if($(options[i]).val()!='' && parseInt($(options[i]).val())>=val){
				$(options[i]).attr('disabled',true);
			}
		}
	},this));
	
  }

  BussinessHours.DEFAULTS = {
    lang: 'en',
	selectClass:'',
	optionClass:'',
	checkboxClass:'',
	data:undefined
	
  }

  BussinessHours.prototype.value = function (a) {
    var days=this.$element.find('.day .day_cb:checked');
	var resp='',day=undefined;
	for (var i=0;i<$(days).size();i++) {
		var d=parseInt($(days[i]).val());
		var offset=(new Date().getTimezoneOffset()/60)*100;
		var start=parseInt($('#'+d+'start').val())+offset;
		var end=parseInt($('#'+d+'end').val())+offset;
		if(!isNaN(start)  && !isNaN(end)){
			if (day==undefined) day={};
			//Due to utc shift, need to change values
			if(offset>0 && end>2400) {
				var nd= d+1 > 6 ? 0 : d+1;
				if(day[nd]==undefined) day[nd]=[];
				if(end<0){
					day[nd].push({from:start-2400,to:end-2400});
				}else{
					if(day[d]==undefined) day[d]=[];
					day[d].push({from:start,to:2400});
					day[nd].push({from:0,to:end-2400});
				}
				continue;
			}
			 else if(offset<0 && start < 0){
 				var nd= d-1 < 0  ? 6 : d-1;
 				if(day[nd]==undefined) day[nd]=[];
 				if(end<0){
 					day[nd].push({from:2400+start,to:2400+end});
 				} else
 				{
 					if(day[d]==undefined) day[d]=[];
 					day[nd].push({from:2400+start,to:2400});
 					day[d].push({from:0,to:end});
 				}
 				continue;
			}
				
			
			day[d]=[{from:start,to:end}];
		}
	}
	
	return day;
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.bussinesshours;

  $.fn.bussinesshours = function (option, _relatedTarget) {
	  console.log(option);
      var $this   = $(this);
      var data    = $this.data('bh.bussinesshours');
      var options = $.extend({}, BussinessHours.DEFAULTS, typeof option == 'object' && option);
      if(!data) return $this.data('bh.bussinesshours', (data = new BussinessHours(this, options)))
	  if (typeof option == 'string') return data[option]();

    
  }

  $.fn.bussinesshours.Constructor = BussinessHours;


  
  // BussinessHours NO CONFLICT
  // =================

  $.fn.bussinesshours.noConflict = function () {
    $.fn.bussinesshours = old;
    return this;
  }


}));