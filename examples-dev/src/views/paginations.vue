<template>

<div>
    
    <div>
        <hdp-pagination :pagesize="6" :total="10" :cur="1" :link="createLink"></hdp-pagination>
    </div>

    <div>
        <hdp-pagination :pagesize="6" :total="200" :cur="1"></hdp-pagination>
    </div>

</div>

</template>

<script>

module.exports = {

  methods: {
    createLink: function(p) {
      return '/pagination?page=' + p;
    }
  }
};

</script>
