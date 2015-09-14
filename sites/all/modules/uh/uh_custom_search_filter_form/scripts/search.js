/**
 * Custom ajax search
 */
(function ($) {
    //var availableDates = [];// is defined in datepicker prefix
    var tmpMaxpersonsValue = '';
    var tmpeNightsValue = '';

    var refreshElements = function(callback, onlyDate){
        if(typeof(onlyDate) == 'undefined'){ onlyDate = false; }
        $("#uh-custom-search-filter-form-form").addClass("loading");
        refreshSearch(function(data){

            tmpMaxpersonsValue = $("#edit-max-persons").val();
            tmpeNightsValue = $("#edit-nights").val();

            $("#edit-max-persons").children("option").not(':first').remove();
            $("#edit-nights").children("option").not(':first').remove();

            $.each(data['maxpersonsOptions'], function(key, value) {
                $('#edit-max-persons')
                    .append($("<option></option>")
                    .attr("value",value['value'])
                    .text(value['label']));
            });

            $.each(data['periodOptions'], function(key, value) {
                $('#edit-nights')
                    .append($("<option></option>")
                    .attr("value",value['value'])
                    .text(value['label']));
            });

            // try to reselect old val's if still possible
            $("#edit-max-persons").val(tmpMaxpersonsValue);
            $("#edit-nights").val(tmpeNightsValue);

            if (typeof(callback) == 'function') {
                callback(data);
            }

            $("#uh-custom-search-filter-form-form").removeClass("loading");
        }, onlyDate);
    }

    var refreshSearch = function(callback, onlyDate){
        if(typeof(onlyDate) == 'undefined'){ onlyDate = false; }
        var postData = $('#uh-custom-search-filter-form-form').serialize();
        if(onlyDate){
            postData = postData + "&onlydate=1";
        }
        $.ajax('/admin/get/availability', {
            data: postData,
            dataType: 'JSON'
            }).done(function(data){
                //availableDates = data['startdateOptions']; //should not reload!
            }).always(function(data){
            if (typeof(callback) == 'function') {
                callback(data);
            }
        });
    }

    var available = function(date){
        if(date < new Date()) {return [false,"",labelNietBeschikbaar];}
        var day   = date.getDate();
        day       = day < 10 ? "0"+day : day;
        var month = parseInt(date.getMonth())+1;
        month     = month < 10 ? "0"+month : month;
        dmy       = date.getFullYear() + "-" + month + "-" + day + " 00:00:00";

        for(var i = 0; i < availableDates.length-1; i++){
            //console.log(availableDates[i]['value'] +':::'+ dmy);
            if (availableDates[i]['value'] == dmy) {
                //console.log(dmy + " ::: " + availableDates[i]['value']);
                return [true,"",labelBeschikbaar];
            }
        }
        return [false,"",labelNietBeschikbaar];
    }

    var getDefaultDate = function(date){
        var day    = date.getDate();
        day        = day < 10 ? "0"+day : day;
        var month  = parseInt(date.getMonth())+1;
        month      = month < 10 ? "0"+month : month;
        dmy        = date.getFullYear() + "-" + month + "-" + day + " 00:00:00";
        return dmy;
    }

    var getFirstPossibledate = function(){
        var myDate = new Date();
        var dmy = getDefaultDate(myDate);
        var myKey = 0;
        //var firstday = new Date();

        $.each(availableDates,function(key, value){
            if(value['value'] > dmy ) {
                myKey = key;
                return false;
            }
        })


        while(availableDates[myKey]['value'] != dmy){

            myDate.setDate(myDate.getDate()+1);
            dmy = getDefaultDate(myDate);

        }
        return myDate;
    }

    var initSearch = function(){
        var tmpDate = $('#edit-field-start-date-1-datepicker-popup-0').val();
        if(typeof(tmpDate) != 'undefined') {
            if(tmpDate == ''){
                tmpDate = getFirstPossibledate();
            } else {
                tmpDate = tmpDate.split("/");
                tmpDate = tmpDate[1] + "/" + tmpDate[0] + "/" + tmpDate[2];

                if (tmpDate == getDefaultDate(new Date())) {
                    tmpDate = getFirstPossibledate();
                }
            }
        } else { tmpDate = getFirstPossibledate(); }
        //$.datepicker.setDefaults(
        //    $.extend(
        //      {'dateFormat':'dd-mm-yy'},
        //      $.datepicker.regional['nl']
        //    )
        //);
        $("#edit-date-datepicker-popup-0").datepicker('destroy');
        $("#edit-date-datepicker-popup-0").datepicker({
            "changeMonth": true,
            "changeYear": true,
            "autoPopUp": "focus",
            "closeAtTop": false,
            //"speed": "immediate",
            //"firstDay": 1,
            "dateFormat": "dd/mm/yy",
            "yearRange": "0:+1",
            //"fromTo": false,
            //"defaultDate": "0y",
            beforeShowDay: available,
            onSelect: function(){refreshElements(function(){}, true);}
        });

        $("#edit-max-persons, #edit-nights").on('change', refreshElements);
        $('#edit-date-datepicker-popup-0').datepicker( "setDate" , tmpDate );
        setTimeout(function(){refreshElements(function(){}, true);}, 500);
    }

    $(document).ready(function(){
        tmpMaxpersonsValue = $("#edit-max-persons").val();
        tmpeNightsValue = $("#edit-nights").val();
        //refreshSearch(initSearch); // if already filled elements serverside
        //refreshElements(initSearch); //if you're lazy ;)
        initSearch(); // Don't need initial ajax-request
        $("#edit-max-persons").val(tmpMaxpersonsValue);
        $("#edit-nights").val(tmpeNightsValue);
    });
})(jQuery);

