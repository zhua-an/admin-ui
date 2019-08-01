<template>
  <div class="user">
    <basic-container>
      <el-row>
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-button-group>
          <el-button type="primary"
                      v-if="checkPermission('sys_user_add')"
                      icon="plus"
                      @click="handlerAdd">添加
          </el-button>
        </el-button-group>
      </el-row>
      <v1-table :table="table"></v1-table>
    </basic-container>
  </div>
</template>

<script>
  import v1Table from '@/components/table/v1-table';
  export default {
    name: "table_user",
    data() {
      return {
        checkedData: [],
        form: {
          username: ''
        },
        table: {
          hasIndex: true,
          hasSelect: true,
          hasOperation: true,
          border: true,
          hasPage: true,
          column: [
            {
              label: '姓名',
              prop: 'name',
              align: 'center'
            },{
              label: '用户名',
              prop: 'username',
              align: 'center'
            },{
              label: '手机号',
              prop: 'phone',
              align: 'center'
            },{
              label: '头像',
              prop: 'avatar',
              align: 'center',
              width: '80'
            },{
              label: '部门',
              prop: 'deptName',
              align: 'center'
            },{
              label: '状态',
              prop: 'lockFlag',
              align: 'center'
            },{
              label: '微信openid',
              prop: 'wx_openid',
              align: 'center',
              width: '200'
            },{
              label: 'QQ openid',
              prop: 'qq_openid',
              align: 'center',
              width: '200'
            },{
              label: '创建日期',
              prop: 'createDate',
              align: 'center'
            }
          ],
          data: [],
          operation: {             // 操作功能
            label: '操作',                // 操作列的行首文字
            width: '80',                // 操作列的宽度
            align: 'center',
            className: '',               // 操作列的class名
            data: [                      // 操作列数据
              {
                label: '删除',                // 按钮文字
                Fun: 'handleDelete',         // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '1'                     // 按钮循环组件的key值
              }
            ]
          },
          page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 20, // 每页显示多少条
          }
        }
      };
    },
    components: { 
      v1Table 
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        
      },
      getList(page, params) {
        this.listLoading = true;
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.list = response.data.data.records;
          this.page.total = response.data.data.total
          this.listLoading = false;
        });
      },
      handlerAdd() {

      },
      submitForm() {

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
<style lang="scss">
  .user {
    height: 100%;
  }
</style>

