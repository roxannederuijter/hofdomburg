(function($) {

  function CheckAllowDates(date) {

    var dates_allowed = Drupal.settings.popupDatesAllowed;
    // Date format in standart JavaScript date formatter Date Format 1.2.3
    date_str = date.format('dd.mm.yyyy');
    if (dates_allowed[date_str]) {
      return [true, 'date_exist_in_index', Drupal.t('This date is selectable')];
    } else {
      return [false, 'date_not_exist_in_index', Drupal.t('This date is NOT selectable')];
    }
  }

  Drupal.behaviors.ccFacetapiPopupCalendar = {
    attach: function(context) {
      $(".date-popup-calendar-form-input").datepicker({
        minDate: "-3Y",
        maxDate: "+3Y",
        dateFormat: Drupal.settings.DateFormatForPopup,
        beforeShowDay: CheckAllowDates
      });
    }
  };
})(jQuery);

