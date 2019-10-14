<template>
  <div class="dept">
    <basic-container>
      <el-row>
        <Search 
          :tableSearch="tableSearch"
          @handleSearch="handleSearch"
        />
      </el-row>
      <data-table 
        :data="table.data"
        :operBut="table.operBut"
        :loading="table.loading" 
        :option="table.option"
        :pagination="table.page"
        @onHandleSelectionChange="onHandleSelectionChange"
        @handleSearch="handleSearch">
        <template slot-scope="props" slot="delFlag">
          <el-tag v-if="props.obj.row.delFlag === '1'"
            type="danger">删除</el-tag>
          <el-tag v-else>正常</el-tag>
        </template>
      </data-table>
      <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="dialogDeptVisible"
        width="30%">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="父级部门"
                          prop="parentName">
              <el-input v-model="form.parentName"
                        disabled ></el-input>
            </el-form-item>
            <el-form-item label="部门名称"
                          prop="deptName">
              <el-input v-model="form.deptName"
                        placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="排序"
                          prop="sort">
              <el-input type="number"
                        v-model="form.sort"
                        placeholder="请输入排序"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('form'), dialogDeptVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
          </span>
        </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import Search from '@/components/search/search'
  import DataTable from '@/components/table/data-table'
  import {addObj, delObj, queryPage, updateObj} from '@/api/upms/dept'

  export default {
    name: 'dept_page',
    components: {
      Search,
      DataTable
    },
    data() {
      return {
        title: '',
        dialogDeptVisible: false,
        form: {
          parentId: undefined,
          parentName: undefined,
          deptName: undefined,
          sort: undefined,
          id: undefined
        },
        checkedData: [],
        searchForm: {
          deptName: ''
        },
        tableSearch: [
          {
            label: '部门名称',
            value: 'deptName',
          }
        ],
        table: {
          operBut: [{
            title: '添加',
            hasPermit: 'sys_dept_add',
            method: this.handleAdd
          }],
          loading: true,
          option: {
            hasIndex: true,
            hasSelect: true,
            hasOperation: true,
            border: true,
            rowKey: 'id',
            column: [
              {
                label: '部门名称',
                prop: 'deptName',
                // width: '180',
                align: 'center'
              },{
                label: '排序',
                prop: 'sort',
                // width: '100',
                align: 'center'
              },{
                label: '状态',
                prop: 'delFlag',
                // width: '100',
                show: 'template',
                align: 'center'
              },{
                label: '修改日期',
                prop: 'updateTime',
                // width: '180',
                align: 'center'
              },{
                label: '创建日期',
                prop: 'createTime',
                // width: '180',
                align: 'center'
              }
            ],
            operation: {            
              label: '操作',               
              width: '180',               
              align: 'center',     
              data: [                   
                {
                  type: 'success',
                  hasPermit: 'sys_dept_edit',
                  label: '编辑',               
                  method: this.handleEdit,
                  id: '1'                    
                }, {
                  type: 'danger',
                  hasPermit: 'sys_dept_del',
                  label: '删除',
                  disabled(row, index) {
                    return (row.children && row.children.length > 0) || row.delFlag == '1'
                  },
                  method: this.handleDelete,  
                  id: '2'                     
                }
              ]
            }
          },
          data: [],
          page: {
            total: 0, 
            currentPage: 1, 
            pageSize: 20, 
          }
        },
        rules: {
          deptName: [
            {required: true, message: '请输入部门名称', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.table.loading = true
        let data = {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize,
          searchMap: this.searchForm
        }
        queryPage(data).then(response => {
          this.table.data = response.data.data.records
          this.table.page.total = response.data.data.total
          this.checkedData = []
          this.table.loading = false
        }).catch(err => {
          this.checkedData = []
          this.table.loading = false
        })
      },
      handleSearch(page) {
        if (page) {
          this.searchForm = page
          if(page.pageNum) {
            this.table.page.currentPage = page.pageNum
            this.table.page.pageSize = page.pageSize
          }
        }
        this.getList()
      },
      handleEdit(row, index) {
        this.title = '编辑'
        this.form.id = row.id
        this.form.parentId = row.parentId
        this.form.parentName = row.parentName
        this.form.deptName = row.deptName
        this.form.sort = row.sort
        this.dialogDeptVisible = true
      },
      handleAdd() {
        this.title = '添加'
        if(this.checkedData && this.checkedData.length == 1) {
          this.form.parentId = this.checkedData[0].id
          this.form.parentName = this.checkedData[0].deptName
        } else if(this.checkedData && this.checkedData.length > 1) {
          this.$message({
            message: '不能同时选择多个父级部门',
            type: 'warning'
          })
          return 
        } else {
          this.form.parentId = -1
          this.form.parentName = ''
        }
        this.form.id = ''
        this.form.deptName = ''
        this.form.sort = ''
        this.dialogDeptVisible = true
        
      },
      handleDelete(row, index) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(!this.form.id) {
              addObj(this.form).then(() => {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogDeptVisible = false
              })
            } else {
              updateObj(this.form).then(() => {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogDeptVisible = false
              })
            }
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      onHandleSelectionChange(data) {
        this.checkedData = data
      }
    }
  }
</script>
<style lang="scss">
  .dept {
    height: 100%;
  }
</style>
