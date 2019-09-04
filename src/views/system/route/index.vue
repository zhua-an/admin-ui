<template>
  <div class="execution">
    <basic-container>
      <div class="top">
        <el-button v-if="checkPermission('sys_route_edit')" type="primary" @click="edit()">更新</el-button>
      </div>
      <vue-json-editor v-model="json" :expand-depth=2 :show-btns="false"></vue-json-editor>
    </basic-container>
  </div>
</template>
<script>
  import vueJsonEditor from 'vue-json-editor'
  import {queryList, updateObj} from '@/api/system/route'

  export default {
    data() {
      return {
        json: null
      }
    },

    // 注入vueJsonEditor组件
    components: {
      vueJsonEditor
    },

    created() {
      this.getList()
    },

    methods: {
      getList() {
        queryList().then(response => {
          let result = response.data.data;
          for (var i = 0; i < result.length; i++) {
            let route = result[i]
            if (route.predicates) {
              let predicates = route.predicates
              route.predicates = JSON.parse(predicates)
            }
            if (route.filters) {
              let filters = route.filters
              route.filters = JSON.parse(filters)
            }
          }
          this.json = result
        })
      },

      edit() {
        updateObj(this.json).then(() => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    }
  }
</script>
<style scoped>
.top{
  padding: 10px 0;
}
</style>