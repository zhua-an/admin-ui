<template>
  <div>
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
                      v-if="checkPermission('sys_role_add')"
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
        <template slot-scope="props" slot="delFlag">
          <el-tag v-if="props.obj.row.delFlag === '1'"
            type="danger">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </v1-table>
    </basic-container>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="dialogRoleVisible"
      width="30%">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="roleForm.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="textarea" v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('roleForm'), dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限"
               :visible.sync="dialogPermissionVisible">
      <el-tree class="filter-tree"
               :data="treeData"
               :default-checked-keys="checkedKeys"
               :check-strictly="false"
               node-key="id"
               highlight-current
               :props="defaultProps"
               show-checkbox
               ref="roleTree"
               :filter-node-method="filterNode"
               default-expand-all>
      </el-tree>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogPermissionVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updatePermession()">更 新
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Search from '@/components/search/search';
  import V1Table from '@/components/table/v1-table'
  import {addObj, delObj, queryList, fetchRoleTree, getObj, updateRolePermit, updateObj} from '@/api/admin/role'
  import {mapGetters} from 'vuex'

  export default {
    name: 'table_role',
    components: {
      Search,
      V1Table 
    },
    data() {
      return {
        title: '',
        dialogRoleVisible: false,
        dialogPermissionVisible: false,
        roleForm: {
          id: '',
          roleName: '',
          roleCode: '',
          roleDesc: ''
        },
        roleId: '',
        treeData: [],
        checkedKeys: [],
        defaultProps: {
          label: "name",
          value: 'id'
        },
        checkedData: [],
        searchForm: {
          roleName: ''
        },
        tableSearch: [
          {
            label: '角色名称',
            value: 'roleName',
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
                label: '角色名',
                prop: 'roleName',
                width: '150',
                align: 'center'
              },{
                label: '角色代码',
                prop: 'roleCode',
                width: '150',
                align: 'center'
              },{
                label: '状态',
                prop: 'delFlag',
                width: '100',
                show: 'template',
                align: 'center'
              },{
                label: '角色描述',
                prop: 'roleDesc',
                align: 'center'
              },{
                label: '创建日期',
                prop: 'createTime',
                width: '180',
                align: 'center'
              },{
                label: '更新日期',
                prop: 'updateTime',
                width: '180',
                align: 'center'
              }
            ],
            operation: {             // 操作功能
              label: '操作',                // 操作列的行首文字
              width: '250',                // 操作列的宽度
              align: 'center',
              className: '',               // 操作列的class名
              data: [                      // 操作列数据
                {
                  type: 'primary',
                  hasPermit: 'sys_role_edit',
                  label: '编辑',                // 按钮文字
                  Fun: (row, index) => {        // 点击按钮后触发的父组件事件
                    this.handleEdit(row, index)
                  },         
                  size: 'mini',                // 按钮大小
                  id: '1'                     // 按钮循环组件的key值
                }, {
                  type: 'danger',
                  hasPermit: 'sys_role_del',
                  label: '删除',                // 按钮文字
                  Fun: this.handleDelete,           // 点击按钮后触发的父组件事件
                  size: 'mini',                // 按钮大小
                  id: '2'                     // 按钮循环组件的key值
                }, {
                  type: 'success',
                  hasPermit: 'sys_role_auth',
                  label: '授权',                // 按钮文字
                  Fun: this.handlePermit,           // 点击按钮后触发的父组件事件
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
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleCode: [
            { required: true, message: '请输入角色代码', trigger: 'blur' }
          ]
        }
      }
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
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handlerAdd() {
        this.title = '添加'
        this.roleForm.id = ''
        this.dialogRoleVisible = true
      },
      handleEdit(row, index) {
        this.title = '编辑'
        this.roleForm.id = row.id
        this.roleForm.roleName = row.roleName
        this.roleForm.roleCode = row.roleCode
        this.roleForm.roleDesc = row.roleDesc
        this.dialogRoleVisible = true
      },
      handleDelete(row, index) {
        var _this = this
        this.$confirm('是否确认删除名称为"' + row.roleName + '"'+ '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.id)
        }).then((data) => {
          this.getList()
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        }).catch(function () {
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(!this.roleForm.id) {
              addObj(this.form).then(() => {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                resetForm(formName)
              }).catch(() => {

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
                resetForm(formName)
              }).catch(() => {

              })
            }
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handlePermit(row, index) {
        this.roleId = row.id
        fetchRoleTree(row.id)
          .then(response => {
            this.treeData = response.data.data.treeList
            this.checkedKeys = response.data.data.checkedKeys
            // 解析出所有的叶子节点
            this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
            this.dialogPermissionVisible = true
          })
      },
      updatePermession() {
        let permissionIds = this.$refs.roleTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.roleTree.getHalfCheckedKeys().join(','))
        updateRolePermit(this.roleId, permissionIds).then(() => {
          this.dialogPermissionVisible = false
          this.roleId = ''
          this.checkedKeys = ''
          this.getList()
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      onHandleSelectionChange(data) {
        this.checkedData = data
      },
      /**
       * 解析出所有的叶子节点id
       * @param json 待解析的json串
       * @param idArr 原始节点数组
       * @param temp 临时存放节点id的数组
       * @return 太监节点id数组
       */
      resolveAllEunuchNodeId(json, idArr, temp) {
        for (let i = 0; i < json.length; i++) {
          const item = json[i]
          // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
          if (item.children && item.children.length !== 0) {
            this.resolveAllEunuchNodeId(item.children, idArr, temp)
          } else {
            temp.push(idArr.filter(id => id === item.id))
          }
        }
        return temp
      }
    }
  }
</script>
