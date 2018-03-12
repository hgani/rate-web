<template lang="pug">
  .text-right.py-3
    span.px-3.text-muted(v-if="pagination.page") Page: {{pagination.page}}
    router-link.btn.btn-primary.mr-3(v-if="pagination.hasPrev" :to="{path: pagination.path, query: pagination.prev}") Prev «
    router-link.btn.btn-primary(v-if="pagination.hasNext" :to="{path: pagination.path, query: pagination.next}") Next » 
</template>

<script>
export default {
  props: ["pagination"]
};
</script>

