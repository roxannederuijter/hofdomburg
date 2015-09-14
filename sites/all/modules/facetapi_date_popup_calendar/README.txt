Example how to change date format.

Use with hook_facetapi_facet_info_alter()
1. Add value callback
if (isset($facet_info['FIELD_NAME'])) {
  $facet_info['FIELD_NAME']['map options']['format callback'] = '_format_callback_function';
}
 
2. Create _format_callback_function
function _format_callback_function($timestamp, $gap = FACETAPI_DATE_DAY) {
  switch ($gap) {
    case FACETAPI_DATE_DAY:
      return format_date($timestamp, 'custom', 'd.m.Y', 'UTC');
    default:
      return format_date($timestamp, 'custom', 'd.m.Y', 'UTC');
  }
}
