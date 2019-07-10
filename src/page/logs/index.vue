<template>
  <div>
    <div class="menuLeft">
      <el-button type="primary"
                 size="small"
                 icon="el-icon-upload"
                 @click="send">上传服务器</el-button>
      <el-button type="danger"
                size="small"
                icon="el-icon-delete"
                @click="clear">清空本地日志</el-button>
    </div>
    <el-table :data="logsList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <pre class="code">
            {{props.row.stack}}
          </pre>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,key) in column" v-bind:key="key" :label="item.label" :prop="item.prop"
        :show-overflow-tooltip="item.overHidden ? item.overHidden : false" :width="item.width" :align="item.align" 
        header-align="center">
        <template slot-scope="scope">
          {{ formatter(scope.row, item) }} 
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import option from '@/const/logs/index'
export default {
  name: "errLogs",
  data () {
    return {
      column: [],
      option: option
    };
  },
  created () {
    if(this.option.column != null && this.option.column.length > 0) {
      this.option.column.forEach(ele => {
        if(ele.hide != true) {
          this.column.push(ele)
        }
      })
    }
  },
  mounted () { },
  computed: {
    ...mapGetters(["logsList"])
  },
  props: [],
  methods: {
    send () {
      this.$confirm('确定上传本地日志到服务器?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('SendLogs').then(() => {
          this.$parent.$parent.box = false;
          this.$message({
            type: 'success',
            message: '发送成功!'
          });
        });

      }).catch(() => {

      });
    },
    clear () {
      this.$confirm('确定清空本地日志记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('CLEAR_LOGS');
        this.$parent.$parent.box = false;
        this.$message({
          type: 'success',
          message: '清空成功!'
        });
      }).catch(() => {

      });
    },
    formatter ( row, item ) {
      let text = ''
      try {
        text = row[item.prop]
        if(item.solt && item.dicData && item.dicData.length > 0) {
          item.dicData.forEach(ele => {
            if(ele.value == text) {
              text = ele.label
              return
            }
          })
        }
      } catch(err) {
        console.log("Cought Error: ", err)
      }
      return text
    }
  }
};
</script>

<style lang="scss" scoped>
.menuLeft {
  padding-bottom: 10px; 
}
.code {
  font-size: 12px;
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0px;
}
</style>
