<?php

/**
 * @file
 * On behalf implementation of Feeds mapping API for file.module and
 * image.module.
 */

/**
 * Implements hook_feeds_processor_targets_alter().
 *
 * @see FeedsNodeProcessor::getMappingTargets()
 */
function file_feeds_processor_targets_alter(&$targets, $entity_type, $bundle_name) {
  foreach (field_info_instances($entity_type, $bundle_name) as $name => $instance) {
    $info = field_info_field($name);

    if (in_array($info['type'], array('file', 'image'))) {
      $targets[$name . ':uri'] = array(
        'name' => t('@label: URI', array('@label' => $instance['label'])),
        'callback' => 'file_feeds_set_target',
        'description' => t('The URI of the @label field.', array('@label' => $instance['label'])),
        'real_target' => $name,
      );

      if ($info['type'] == 'image') {
        $targets[$name . ':alt'] = array(
          'name' => t('@label: Alt', array('@label' => $instance['label'])),
          'callback' => 'file_feeds_set_target',
          'description' => t('The alt tag of the @label field.', array('@label' => $instance['label'])),
          'real_target' => $name,
        );
        $targets[$name . ':title'] = array(
          'name' => t('@label: Title', array('@label' => $instance['label'])),
          'callback' => 'file_feeds_set_target',
          'description' => t('The title of the @label field.', array('@label' => $instance['label'])),
          'real_target' => $name,
        );
      }
      elseif ($info['type'] === 'file') {
        $targets[$name . ':description'] = array(
          'name' => t('@label: Description', array('@label' => $instance['label'])),
          'callback' => 'file_feeds_set_target',
          'description' => t('The description of the @label field.', array('@label' => $instance['label'])),
          'real_target' => $name,
        );
      }
    }
  }
}

/**
 * Callback for mapping. Here is where the actual mapping happens.
 *
 * When the callback is invoked, $target contains the name of the field the
 * user has decided to map to and $value contains the value of the feed item
 * element the user has picked as a source.
 */
function file_feeds_set_target($source, $entity, $target, array $values) {
  // Add default of uri for backwards compatibility.
  list($field_name, $sub_field) = explode(':', $target . ':uri');
  $info = field_info_field($field_name);

  if ($sub_field == 'uri') {

    foreach ($values as $k => $v) {
      if (!($v instanceof FeedsEnclosure)) {
        if (is_string($v)) {
          $values[$k] = new FeedsEnclosure($v, file_get_mimetype($v));
        }
        else {
          // Set the value for FALSE rather than remove it to keep our deltas
          // correct.
          $values[$k] = FALSE;
        }
      }
    }

    $entity_type = $source->importer->processor->entityType();
    $bundle = $source->importer->processor->bundle();

    $instance_info = field_info_instance($entity_type, $field_name, $bundle);

    // Determine file destination.
    // @todo This needs review and debugging.
    $data = array();
    if (!empty($entity->uid)) {
      $data[$entity_type] = $entity;
    }

    $destination = file_field_widget_uri($info, $instance_info, $data);
  }

  // Populate entity.
  $field = isset($entity->$field_name) ? $entity->$field_name : array(LANGUAGE_NONE => array());
  $delta = 0;
  foreach ($values as $v) {
    if ($info['cardinality'] == $delta) {
      break;
    }

    if (!isset($field[LANGUAGE_NONE][$delta])) {
      $field[LANGUAGE_NONE][$delta] = array();
    }

    switch ($sub_field) {
      case 'alt':
      case 'title':
      case 'description':
        $field[LANGUAGE_NONE][$delta][$sub_field] = $v;
        break;

      case 'uri':
        if ($v) {
          try {
            $file = $v->getFile($destination);
            $field[LANGUAGE_NONE][$delta] += (array) $file;
            // @todo: Figure out how to properly populate this field.
            $field[LANGUAGE_NONE][$delta]['display'] = 1;
          }
          catch (Exception $e) {
            watchdog_exception('Feeds', $e, nl2br(check_plain($e)));
          }
        }
        break;
    }

    $delta++;
  }

  $entity->$field_name = $field;
}
