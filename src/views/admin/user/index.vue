<template>
  <div class="user">
    <basic-container>
      <el-row>
        <Search 
          :tableSearch="tableSearch"
          @handleSearch="handleSearch"
        />
      </el-row>
      <el-row>
        <el-button-group>
          <el-button type="primary"
                      v-if="checkPermission('sys_user_add')"
                      @click="handlerAdd">添加
          </el-button>
        </el-button-group>
      </el-row>
      <v1-table 
        :data="table.data" 
        :loading="table.loading" 
        :option="table.option"
        :pagination="table.page"
        @onHandleSelectionChange="onHandleSelectionChange"
        @handleSearch="handleSearch">
        <template slot-scope="props" slot="lockFlag">
          <el-tag v-if="props.obj.row.lockFlag === 1"
            :type="danger">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </v1-table>
    </basic-container>
  </div>
</template>

<script>
  import Search from '@/components/search/search';
  import v1Table from '@/components/table/v1-table'
  import {addObj, delObj, queryList, getObj, putObj} from "@/api/admin/user";
  export default {
    name: "table_user",
    components: {
      Search,
      v1Table 
    },
    data() {
      return {
        checkedData: [],
        searchForm: {
          username: ''
        },
        tableSearch: [
          {
            label: '用户名',
            value: 'username',
          }
        ],
        table: {
          loading: true,
          option: {
            hasIndex: true,
            hasSelect: true,
            hasOperation: true,
            border: true,
            column: [
              {
                label: '姓名',
                prop: 'name',
                width: '120',
                align: 'center'
              },{
                label: '用户名',
                prop: 'username',
                width: '120',
                align: 'center'
              },{
                label: '手机号',
                prop: 'phone',
                width: '120',
                align: 'center'
              },{
                label: '头像',
                prop: 'avatar',
                width: '120',
                align: 'center',
                width: '80'
              },{
                label: '部门',
                prop: 'deptName',
                width: '100',
                align: 'center'
              },{
                label: '状态',
                prop: 'lockFlag',
                width: '100',
                show: 'template',
                align: 'center'
              },{
                label: '微信openid',
                prop: 'wx_openid',
                align: 'center'
              },{
                label: 'QQ openid',
                prop: 'qq_openid',
                align: 'center'
              },{
                label: '创建日期',
                prop: 'createTime',
                width: '180',
                align: 'center'
              }
            ],
            operation: {             // 操作功能
              label: '操作',                // 操作列的行首文字
              width: '180',                // 操作列的宽度
              align: 'center',
              className: '',               // 操作列的class名
              data: [                      // 操作列数据
                {
                  type: 'success',
                  hasPermit: 'sys_user_edit',
                  label: '编辑',                // 按钮文字
                  Fun: handleEdit,             // 点击按钮后触发的父组件事件
                  size: 'mini',                // 按钮大小
                  id: '1'                     // 按钮循环组件的key值
                }, {
                  type: 'danger',
                  hasPermit: 'sys_user_del',
                  label: '删除',                // 按钮文字
                  Fun: handleDelete,           // 点击按钮后触发的父组件事件
                  size: 'mini',                // 按钮大小
                  id: '2'                     // 按钮循环组件的key值
                }
              ]
            }
          },
          data: [],
          page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 20, // 每页显示多少条
          }
        }
      };
    },
    created() {
      this.getList()
    },
    methods: {
      handleSearch(page) {
        if (page) {
          this.table.page.currentPage = page.pageNum
          this.table.page.pageSize = page.pageSize
        }
        this.getList()
      },
      getList() {
        this.table.loading = true
        let data = {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize,
          searchMap: this.searchForm
        }
        queryList(data).then(response => {
          this.table.data = response.data.data.records
          this.table.page.total = response.data.data.total
          this.checkedData = []
          this.table.loading = false
        }).catch(err => {
          this.checkedData = []
          this.table.loading = false
        })
      },
      handlerAdd() {

      },
      handleEdit() {

      },
      handleDelete() {

      },
      submitForm() {

      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      onHandleSelectionChange(data) {
        this.checkedData = data
      }
    }
  };
</script>
<style lang="scss">
  .user {
    height: 100%;
  }
</style>

