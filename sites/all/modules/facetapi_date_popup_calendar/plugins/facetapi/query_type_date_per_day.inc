<?php

/**
 * @file
 * Date per day query type plugin for the Search API adapter.
 */

/**
 * Plugin for "date_per_day" query types.
 */
class SearchApiFacetapiDatePerDay extends SearchApiFacetapiTerm implements FacetapiQueryTypeInterface {

  /**
   * Loads the include file containing the date API functions.
   */
  public function __construct(FacetapiAdapter $adapter, array $facet) {
    module_load_include('date.inc', 'facetapi');
    parent::__construct($adapter, $facet);
  }

  /**
   * Returns the query type associated with the plugin.
   *
   * @return string
   *   The query type.
   */
  static public function getType() {
    return 'date_per_day';
  }

  /**
   * Adds the filter to the query object.
   *
   * @param $query
   *   An object containing the query in the backend's native API.
   */
  public function execute($query) {
    // Return terms for this facet.
    $this->adapter->addFacet($this->facet, $query);
    // Change limit to "unlimited" (-1).
    $options = &$query->getOptions();
    if (!empty($options['search_api_facets'][$this->facet['name']])) {
      $options['search_api_facets'][$this->facet['name']]['limit'] = -1;
    }

    if ($active = $this->adapter->getActiveItems($this->facet)) {
      $item = end($active);
      $field = $this->facet['field'];
      $regex = str_replace(array('^', '$'), '', FACETAPI_REGEX_DATE);
      $filter = preg_replace_callback($regex, array($this, 'replaceDateString'), $item['value']);
      $this->addFacetFilter($query, $field, $filter);
    }
  }

  /**
   * Replacement callback for replacing ISO dates with timestamps.
   */
  public function replaceDateString($matches) {
    return strtotime($matches[0]);
  }

  /**
   * Initializes the facet's build array.
   *
   * @return array
   *   The initialized render array.
   */
  public function build() {
    $facet = $this->adapter->getFacet($this->facet);

    $search_ids = drupal_static('search_api_facetapi_active_facets', array());
    if (empty($search_ids[$facet['name']]) || !search_api_current_search($search_ids[$facet['name']])) {
      return array();
    }
    $search_id = $search_ids[$facet['name']];
    $build = array();
    $search = search_api_current_search($search_id);
    $results = $search[1];
    if (!$results['result count']) {
      return array();
    }
    // Gets total number of documents matched in search.
    $total = $results['result count'];

    // Most of the code below is copied from search_facetapi's implementation of this method.
    // Executes query, iterates over results.
    if (isset($results['search_api_facets']) && isset($results['search_api_facets'][$this->facet['field']])) {
      $values = $results['search_api_facets'][$this->facet['field']];
      foreach ($values as $value) {
        if ($value['count']) {
          $filter = $value['filter'];
          // We only process single values further. The "missing" filter and
          // range filters will be passed on unchanged.
          if ($filter == '!') {
            $build[$filter]['#count'] = $value['count'];
          }
          elseif ($filter[0] == '"') {
            $filter = substr($value['filter'], 1, -1);
            if ($filter) {
              $raw_values[$filter] = $value['count'];
            }
          }
          else {
            $filter = substr($value['filter'], 1, -1);
            $pos = strpos($filter, ' ');
            if ($pos !== FALSE) {
              $lower = facetapi_isodate(substr($filter, 0, $pos), FACETAPI_DATE_DAY);
              $upper = facetapi_isodate(substr($filter, $pos + 1), FACETAPI_DATE_DAY);
              $filter = '[' . $lower . ' TO ' . $upper . ']';
            }
            $build[$filter]['#count'] = $value['count'];
          }
        }
      }
    }

    if (empty($raw_values)) {
      return $build;
    }
    ksort($raw_values);

    // Always use gap DAY.
    $timestamps = array_keys($raw_values);
    $gap = 'DAY';

    // Converts all timestamps to dates in ISO 8601 format.
    $dates = array();
    foreach ($timestamps as $timestamp) {
      $dates[$timestamp] = facetapi_isodate($timestamp, $gap);
    }

    // Treat each date as the range start and next date as the range end.
    $range_end = array();
    $previous = NULL;
    foreach (array_unique($dates) as $date) {
      if (NULL !== $previous) {
        $range_end[$previous] = facetapi_get_next_date_increment($previous, $gap);
      }
      $previous = $date;
    }
    $range_end[$previous] = facetapi_get_next_date_increment($previous, $gap);

    // Groups dates by the range they belong to, builds the $build array
    // with the facet counts and formatted range values.
    foreach ($raw_values as $value => $count) {
      $new_value = '[' . $dates[$value] . ' TO ' . $range_end[$dates[$value]] . ']';
      if (!isset($build[$new_value])) {
        $build[$new_value] = array('#count' => $count);
      }
      else {
        $build[$new_value]['#count'] += $count;
      }
      $build[$new_value]['#timestamp'] = $value;
    }

    return $build;
  }

}
