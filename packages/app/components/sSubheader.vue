<template>
  <section class="s_subheader">
    <slot></slot>
  </section>
</template>
<style lang="scss">
$s_subheader--height: calc($s_spacer * 10) !default;
$s_subheader--padding: calc($s_spacer * 4) !default;

.s_subheader {
  @include s_typography('caption');
  display: flex;
  align-items: center;
  height: $s_subheader--height;
  padding: 0 $s_subheader--padding;
  font-weight: 700;
}
</style>
