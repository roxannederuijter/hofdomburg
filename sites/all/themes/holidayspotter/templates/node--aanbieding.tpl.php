<article id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <?php //print $user_picture; ?>


  <?php if ($title && !$page && $node->type != 'landingpage'): ?>
  <?php print render($title_prefix); ?>
    <h2<?php print $title_attributes; ?>><?php print $title; ?></h2>
  <?php print render($title_suffix); ?>
  <?php endif; ?>

  <?php if ($display_submitted): ?>
    <div class="submitted">
      <?php print $submitted; ?>
    </div>
  <?php endif; ?>

  <div class="content"<?php print $content_attributes; ?>>
    <?php
      // We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      print render($content);
    ?>
  </div>

  <?php print render($content['links']); ?>

  <?php print render($content['comments']); ?>

</article>
