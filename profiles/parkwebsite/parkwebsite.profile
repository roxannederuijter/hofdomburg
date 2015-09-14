<?php
/**
 * @file
 * Enables modules and site configuration for a standard site installation.
 */

function parkwebsite_install_tasks($install_state) {
  $tasks['parkwebsite_enable_features'] = array(
    'display_name' => st('Enable Features'),
    'display' => TRUE,
    'type' => 'normal',
    'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
  );
  return $tasks;
}

/**
 * Implements hook_form_FORM_ID_alter() for install_configure_form().
 *
 * Allows the profile to alter the site configuration form.
 */
function parkwebsite_form_install_configure_form_alter(&$form, $form_state) {
  // Pre-populate the site name with the server name.
  $form['site_information']['site_name']['#default_value'] = $_SERVER['SERVER_NAME'];
  $form['site_information']['site_mail']['#default_value'] = 'richard@seemeonline.nl';
  $form['admin_account']['account']['name']['#default_value'] = 'richard';
  $form['admin_account']['account']['mail']['#default_value'] = 'richard@seemeonline.nl';
  $form['server_settings']['site_default_country']['#default_value'] = 'NL';
  $form['update_notifications']['update_status_module']['#default_value'] = array(0 => 1);

}

function parkwebsite_enable_features() {
  $modules = array();
  if (!module_exists('default_permissions')) {
    $modules[] = 'default_permissions';
  }
  if (!module_exists('default_roles')) {
    $modules[] = 'default_roles';
  }

 // module_enable($modules);
  // revert
  //features_revert_module('default_permissions');
  //features_revert_module('default_roles');
}

