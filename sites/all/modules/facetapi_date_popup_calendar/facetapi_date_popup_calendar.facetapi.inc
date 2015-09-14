<?php

/**
 * @file
 * Facet API hook implementations.
 */

/**
 * Implements hook_facetapi_widgets().
 */
function facetapi_date_popup_calendar_facetapi_widgets() {
  return array(
    'date_popup_calendar' => array(
      'handler' => array(
        'label' => t('Popup Calendar'),
        'class' => 'FacetapiWidgetDatePopupCalendar',
        'query types' => array('date_per_day'),
      ),
    ),
  );
}

/**
 * Implements hook_facetapi_query_types().
 */
function facetapi_date_popup_calendar_facetapi_query_types() {
  return array(
    'search_api_date_per_day' => array(
      'handler' => array(
        'class' => 'SearchApiFacetapiDatePerDay',
        'adapter' => 'search_api',
      ),
    ),
  );
}
