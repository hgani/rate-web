<template lang='pug'>
  b
    = 'From: '
    router-link(:to="{path: '/transactions', query: {recipient: tx.from}}")
      | {{tx.from && tx.from.toLowerCase()}}
</template>

<script>
export default {
  props: ["tx"]
};
</script>
