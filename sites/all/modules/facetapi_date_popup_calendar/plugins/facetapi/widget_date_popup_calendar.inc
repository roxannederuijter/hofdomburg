<?php

function facetapi_date_popup_calendar_form($form, &$form_state, $settings, $options, $count, $default_option_label, $pretty_paths_alias) {

    $current_active_date = '';
    $popup_dates_allowed = array();
    $popup_dates_allowed_with_path = array();
    if (!empty($default_option_label)) {
        $current_active_date = $default_option_label;
    }
//mail('koen@seemeonline.nl', 'options', print_r($options, true));
    foreach ($options as $key => $option) {
        //js settings for agenda calendar
//    $formated_date = date('d.m.Y', strtotime($option['#markup']));
        $formated_date = date('d.m.Y', $option['#timestamp']);
        $popup_dates_allowed[$formated_date] = 1;

        if ($option['#active']) {
//	  $current_active_date = date($settings->settings['date_format_for_values'], strtotime($option['#markup']));
            $current_active_date = date($settings->settings['date_format_for_values'], $option['#timestamp']);
        }
    }
    $name = 'cc-popup-calendar-form-' . $count;

    ctools_add_js('auto-submit');
    drupal_add_library('system', 'ui.datepicker');
    drupal_add_js(array('DateFormatForPopup' => $settings->settings['date_format_for_popup'], 'popupDatesAllowed' => $popup_dates_allowed, 'popupDatesAllowedWithPath' => $popup_dates_allowed_with_path, 'currentActiveDate' => $current_active_date), 'setting');
    drupal_add_js(drupal_get_path('module', 'facetapi_date_popup_calendar') . '/js/date.format.js');
    drupal_add_js(drupal_get_path('module', 'facetapi_date_popup_calendar') . '/js/facetapi_date_popup_calendar.js');

    $name = 'date-popup-calendar-form-' . $count;
    $form['facets'] = array(
        '#type' => 'textfield',
        '#default_value' => $current_active_date,
        '#size' => 'auto',
        '#id' => $name,
        '#attributes' => array('class' => array('date-popup-calendar-form-input', 'ctools-auto-submit'), 'autocomplete' => array('off'), 'readonly' => array('true')),
    );
    $form['submit'] = array(
        '#type' => 'submit',
        '#attributes' => array('class' => array('date-popup-calendar-form-submit', 'ctools-auto-submit-click'), 'style' => array('display:none;')),
        '#value' => t('Submit'),
    );
    return $form;
}

/**
 * Submit function for cc_facetapi_popup_calendar_form().
 */
function facetapi_date_popup_calendar_form_submit($form, &$form_state) {
    $settings = $form_state['build_info']['args'][0];
    $options = $form_state['build_info']['args'][1];
    $pretty_paths_alias = $form_state['build_info']['args'][4];
    $facet_date = strtotime(trim($form_state['values']['facets']));
    foreach ($options as $key => $option) {
//        mail('koen@seemeonline.nl', 'option', print_r($option, true));
//    $option_date = strtotime($option['#markup']);
        $option_date = $option['#timestamp'];
        if (date('d.m.Y', $option_date) == date('d.m.Y', $facet_date)) {
            $path = $option['#path'];
            if (module_exists('facetapi_pretty_paths')) {
                //clear all part of path but use last
                $path_array = explode('/', $path);
                $path_date_keys = array_keys($path_array, $pretty_paths_alias);
                if (count($path_date_keys) > 1) {
                    unset($path_array[$path_date_keys[0]]);
                    unset($path_array[$path_date_keys[0] + 1]);
                }
                $path = implode('/', $path_array);
                $option['#path'] = $path;
            }
            else {
                //clear all query but use last
                if (!empty($option['#query'])) {
//                    mail('koen@seemeonline.nl', 'option queyr', print_r($option['#query'], true));
//                    $count = count($option['#query']);
                    $query = end($option['#query']['f']);
//                    mail('koen@seemeonline.nl', 'facet', print_r(urlencode($settings->facet), true));
                    foreach($option['#query']['f'] as $key => $value) {
//                        mail('koen@seemeonline.nl', 'value', print_r($value, true));
                        if(strpos($value, urlencode($settings->facet)) !== false) {
                            unset($option['#query']['f'][$key]);
//                        mail('koen@seemeonline.nl', 'key ', print_r($key, true));
//
                            continue;
                        }
                    }
                    array_push($option['#query']['f'], $query);
//                    [$key] = $query;
//                    mail('koen@seemeonline.nl', 'option queyr na', print_r($option['#query'], true));

                  //  mail('koen@seemeonline.nl', 'query voor', print_r($query, true));

//                    $option['#query']['f'] = array_values($option['#query']['f']);

                }
            }
            drupal_goto($option['#path'], array('query' => $option['#query']));
        }
    }
}

/**
 * Widget that renders facets as Popup Calendar.
 *
 */
class FacetapiWidgetDatePopupCalendar extends FacetapiWidget {

    /**
     * Overrides FacetapiWidget::__construct().
     */
    public function __construct($id, array $realm, FacetapiFacet $facet, stdClass $settings) {
        parent::__construct($id, $realm, $facet, $settings);
        $this->key = $facet['name'];
    }

    /**
     * Get all childrenss.
     */
    public function get_all_childrens($element) {
        $options = array();
        foreach ($element as $key => $option) {
            if (isset($option['#item_children'])) {
                $options = $options + $this->get_all_childrens($option['#item_children']);
                $option['#item_children'] = array();
                $options[] = $option;
            }
        }
        return $options;
    }

    /**
     * Implements FacetapiWidget::execute().
     */
    public function execute() {
        static $count = 0;
        $count++;
        $settings = $this->settings;

        $default_option_label = '';
        if (!empty($settings->settings['default_option_label'])) {
            $default_option_label = $settings->settings['default_option_label'];
        }

        $element = &$this->build[$this->facet['field alias']];
        $options = $this->get_all_childrens($element);

        $pretty_paths_alias = '';
        if (module_exists('facetapi_pretty_paths')) {
            // Get global facet settings.
            $adapter = $this->facet->getAdapter();
            $global_facet_settings = $adapter->getFacetSettingsGlobal($this->build['#facet']);
            // Get pretty paths alias акщь global facet settings.
            $pretty_paths_alias = !empty($global_facet_settings->settings['pretty_paths_alias']) ? $global_facet_settings->settings['pretty_paths_alias'] : $this->build['#facet']['field alias'];
        }

        if (!isset($form_state)) {
            $form_state = array();
        }
        $element = drupal_get_form('facetapi_date_popup_calendar_form', $settings, $options, $count, $default_option_label, $pretty_paths_alias);
    }

    /**
     * Overrides FacetapiWidget::settingsForm().
     */
    function settingsForm(&$form, &$form_state) {
        // Date format in standart PHP
        $form['widget']['widget_settings']['date_popup_calendar'][$this->id]['date_format_for_values'] = array(
            '#title' => 'Date format for display',
            '#type' => 'textfield',
            '#default_value' => $this->settings->settings['date_format_for_values'],
            '#description' => t("A user-defined date format. See the !PHP_manual for available options. Should be the same as Date format for popup.", array('!PHP_manual' => l('PHP manual', 'http://php.net/manual/function.date.php', array('attributes' => array('target' => '_blank'))))),
            '#states' => array(
                'visible' => array(
                    'select[name="widget"]' => array('value' => 'date_popup_calendar'),
                ),
            ),
        );
        // Date format in standart http://api.jqueryui.com/datepicker/ Datepicker Widget
        $form['widget']['widget_settings']['date_popup_calendar'][$this->id]['date_format_for_popup'] = array(
            '#title' => 'Date format for popup',
            '#type' => 'textfield',
            '#default_value' => $this->settings->settings['date_format_for_popup'],
            '#description' => t("A user-defined date format. See the !Datepicker_date_format for available options. Should be the same as Date format for display.", array('!Datepicker_date_format' => l('Datepicker date format', 'http://api.jqueryui.com/datepicker/', array('attributes' => array('target' => '_blank'))))),
            '#states' => array(
                'visible' => array(
                    'select[name="widget"]' => array('value' => 'date_popup_calendar'),
                ),
            ),
        );
        $form['widget']['widget_settings']['date_popup_calendar'][$this->id]['default_option_label'] = array(
            '#title' => t('Default Option Label'),
            '#type' => 'textfield',
            '#default_value' => isset($this->settings->settings['default_option_label']) ? $this->settings->settings['default_option_label'] : '',
            '#states' => array(
                'visible' => array(
                    'select[name="widget"]' => array('value' => 'date_popup_calendar'),
                ),
            ),
        );
    }

    /**
     * Overrides FacetapiWidget::getDefaultSettings().
     */
    function getDefaultSettings() {
        return array(
            'date_format_for_values' => 'd.m.Y',
            'date_format_for_popup' => 'dd.mm.yy',
            'default_option_label' => '',
            'soft_limit' => 0,
            'nofollow' => 0,
            'show_expanded' => 0,
        );
    }

}
