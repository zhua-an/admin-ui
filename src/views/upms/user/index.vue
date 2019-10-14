<template>
  <div class="user">
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
        <template slot-scope="props" slot="lockFlag">
          <el-tag v-if="props.obj.row.lockFlag === '9'"
            type="danger">锁定</el-tag>
          <el-tag v-else>正常</el-tag>
        </template>
        <template slot-scope="props" slot="delFlag">
          <el-tag v-if="props.obj.row.delFlag === 1"
            type="danger">删除</el-tag>
          <el-tag v-else>正常</el-tag>
        </template>
      </data-table>
      <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="dialogUserVisible"
        width="30%">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" :disabled="this.form.id != null"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名"
                          prop="name">
              <el-input v-model="form.name"
                        placeholder="请输入用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号"
                          prop="phone">
              <el-input type="number"
                        v-model="form.phone"
                        placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱"
                          prop="email">
              <el-input type="email"
                        v-model="form.email"
                        placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="部门"
                          prop="deptId">
              <treeselect
                :options="deptList"
                placeholder="请选择"
                v-model="form.deptId"
                :normalizer="normalizer"
              >
              </treeselect>
            </el-form-item>
            <el-form-item label="角色"
              prop="roleId">
              <el-select v-model="form.roleId" 
                multiple
                clearable
                style="width: 100%"
                placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('form'), dialogUserVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
          </span>
        </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import Search from '@/components/search/search'
  import DataTable from '@/components/table/data-table'
  import {addObj, delObj, queryPage, getObj, updateObj, lockOrUnlock} from "@/api/upms/user"
  import {getRoleList} from '@/api/upms/role'
  import {getTree} from '@/api/upms/dept'
  import {isEmail, isMobile} from '@/util/validate'
  export default {
    name: "user_page",
    components: {
      Search,
      DataTable,
      Treeselect
    },
    data() {
      var validateMobilePhone = (rule, value, callback) => {
          if (value) {
            if (!isMobile(value)) {
              callback(new Error('请输入有效的手机号码'))
            } else {
              callback()
            }
          }else {
            callback()
          }
      }
      var validateEmail = (rule, value, callback) => {
        if (value) {
          if (!isEmail(value)) {
            callback(new Error('请输入有效的邮箱'))
          } else {
            callback()
          }
        }else {
          callback()
        }
      }
      return {
        title: '',
        dialogUserVisible: false,
        form: {
          id: null,
          name: null,
          username: null,
          phone: null,
          email: null,
          deptId: null,
          roleId: null
        },
        deptList: [],
        roleList: [],
        checkedData: [],
        searchForm: {
          username: ''
        },
        tableSearch: [
          {
            label: '用户名',
            value: 'username',
          },
          {
            label: '手机号',
            value: 'phone',
          }
        ],
        table: {
          operBut: [{
            title: '添加',
            hasPermit: 'sys_user_add',
            method: this.handleAdd
          }],
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
                width: '100',
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
                label: '角色',
                prop: 'roleName',
                width: '180',
                align: 'center'
              },{
                label: '部门',
                prop: 'deptName',
                width: '100',
                align: 'center'
              },{
                label: '锁定状态',
                prop: 'lockFlag',
                width: '100',
                show: 'template',
                align: 'center'
              },{
                label: '删除状态',
                prop: 'delFlag',
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
              width: '240',                // 操作列的宽度
              align: 'center',
              data: [                      // 操作列数据
                {
                  type: 'success',
                  hasPermit: 'sys_user_edit',
                  label: '编辑',                // 按钮文字
                  method: this.handleEdit,        // 点击按钮后触发的父组件事件
                  size: 'mini',                // 按钮大小
                  id: '1'                     // 按钮循环组件的key值
                }, {
                  type: 'danger',
                  hasPermit: 'sys_user_del',
                  label: '删除',                // 按钮文字
                  method: this.handleDelete,      // 点击按钮后触发的父组件事件
                  disabled(row, index) {
                    return row.delFlag === 1
                  },
                  size: 'mini',                // 按钮大小
                  id: '2'                     // 按钮循环组件的key值
                }, {
                  type: 'danger',
                  hasPermit: 'sys_user_lock',
                  label(row, index) {
                    if(row.lockFlag == '9') {
                      return '解锁'
                    }else {
                      return '锁定'
                    }
                  },                // 按钮文字
                  method: this.handleLock,      // 点击按钮后触发的父组件事件
                  size: 'mini',                // 按钮大小
                  id: '3'                     // 按钮循环组件的key值
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
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入用户姓名', trigger: 'blur'}
          ],
          phone: [
            {validator: validateMobilePhone, trigger: 'blur'}
          ],
          email: [
            {validator: validateEmail, trigger: 'blur'}
          ]
        },
        normalizer(node) {
          if (node.children && !node.children.length) {
            delete node.children
          }
          return {
            id: node.id,
            label: node.deptName,
            children: node.children
          }
        }
      }
    },
    created() {
      this.getList()
      getRoleList().then(response => {
        this.roleList = response.data.data
      })
      getTree().then(response => {
        this.deptList = response.data.data
      })
    },
    methods: {
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
      handleAdd() {
        this.title = '添加'
        this.form.id = null
        this.form.name = null
        this.form.username = null
        this.form.phone = null
        this.form.email = null
        this.form.deptId = null
        this.form.roleId = null
        this.dialogUserVisible = true
      },
      handleEdit(row, index) {
        this.title = '编辑'
        this.form.id = row.id
        this.form.name = row.name
        this.form.username = row.username
        this.form.phone = row.phone
        this.form.email = row.email
        this.form.deptId = row.deptId
        this.form.roleId = row.roleId != null ? row.roleId.split(',').map(Number) : null
        this.dialogUserVisible = true
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
      handleLock(row, index) {
        this.$confirm('确定要执行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          lockOrUnlock(row.id).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = Object.assign({}, this.form)
            if(data.roleId && data.roleId.length > 0) {
              data.roleId = JSON.stringify(data.roleId)
            } else {
              data.roleId = null
            }
            
            if(!this.form.id) {
              addObj(data).then(() => {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogUserVisible = false
              })
            } else {
              updateObj(data).then(() => {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogUserVisible = false
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
  };
</script>
<style lang="scss">
  .user {
    height: 100%;
  }
</style>

