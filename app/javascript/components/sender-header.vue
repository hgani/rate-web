<template lang='pug'>
  b
    = 'To: '
    router-link(:to="{path: '/transactions', query: {recipient: tx.to}}")
      | {{tx.to && tx.to.toLowerCase()}}
</template>

<script>
export default {
  props: ["tx"]
};
</script>
