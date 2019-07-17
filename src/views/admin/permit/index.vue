<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-button-group>
          <el-button type="primary"
                     v-if="sys_permission_add"
                     icon="plus"
                     @click="handlerAdd">添加
          </el-button>
          <el-button type="primary"
                     v-if="sys_permission_edit"
                     icon="edit"
                     @click="handlerEdit">编辑
          </el-button>
          <el-button type="primary"
                     v-if="sys_permission_del"
                     icon="delete"
                     @click="handleDelete">删除
          </el-button>
        </el-button-group>
      </div>

      <el-row>
        <el-col :span="8"
                style='margin-top:15px;'>
          <el-tree class="filter-tree"
                   node-key="id"
                   highlight-current
                   :data="treeData"
                   :default-expanded-keys="aExpandedKeys"
                   :filter-node-method="filterNode"
                   :props="defaultProps"
                   @node-click="getNodeData"
                   @node-expand="nodeExpand"
                   @node-collapse="nodeCollapse"
                   ref="tree">
          </el-tree>
        </el-col>
        <el-col :span="16"
                style='margin-top:15px;'>
          <el-card class="box-card">
            <el-form :label-position="labelPosition"
                     label-width="80px"
                     :model="form"
                     :rules="rules"
                     ref="form">
              <el-form-item label="父级节点"
                            prop="parentId">
                <el-input v-model="form.parentId"
                          :disabled="true"
                          placeholder="请输入父级节点"></el-input>
              </el-form-item>
              <el-form-item v-if="formStatus != 'create'"
                            label="节点ID"
                            prop="id">
                <el-input v-model="form.id"
                          :disabled="true"
                          placeholder="请输入节点ID"></el-input>
              </el-form-item>
              <el-form-item :key="'name'"
                            label="标题"
                            prop="name">
                <el-input v-model="form.name"
                          :disabled="formEdit"
                          placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item :key="'sort'"
                            label="排序"
                            prop="sort">
                <el-input type="number"
                          v-model="form.sort"
                          :disabled="formEdit"
                          placeholder="请输入排序"></el-input>
              </el-form-item>
              <el-form-item :key="'type'"
                            label="类型"
                            prop="type">
                <el-select class="filter-item"
                           v-model="form.type"
                           :disabled="formEdit"
                           placeholder="请输入资源请求类型">
                  <el-option v-for="item in  typeOptions"
                             :key="item"
                             :label="item | typeFilter"
                             :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.type === '1'"
                            :key="'permission'"
                            label="权限标识"
                            prop="permission">
                <el-input v-model="form.permission"
                          :disabled="formEdit"
                          placeholder="请输入权限标识"></el-input>
              </el-form-item>
              <el-form-item v-if="form.type === '0'"
                            :key="'icon'"
                            label="图标"
                            prop="icon">
                <el-input v-model="form.icon"
                          :disabled="formEdit"
                          placeholder="请输入图标"></el-input>
              </el-form-item>
              <el-form-item v-if="form.type === '0'"
                            :key="'component'"
                            label="前端组件"
                            prop="component">
                <el-input v-model="form.component"
                          :disabled="formEdit"
                          placeholder="请输入描述"></el-input>
              </el-form-item>
              <el-form-item v-if="form.type === '0'"
                            :key="'path'"
                            label="前端地址"
                            prop="path">
                <el-input v-model="form.path"
                          :disabled="formEdit"
                          placeholder="iframe嵌套地址"></el-input>
              </el-form-item>
              <el-form-item v-if="form.type === '0'"
                            :key="'keepAlive'"
                            label="路由缓冲"
                            prop="keepAlive">
                <el-switch v-model="form.keepAlive"
                           :disabled="formEdit"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           :active-value='"1"'
                           :inactive-value='"0"'>
                </el-switch>
              </el-form-item>
              <el-form-item v-if="formStatus == 'update'">
                <el-button type="primary"
                           @click="update">更新
                </el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
              <el-form-item v-if="formStatus == 'create'">
                <el-button type="primary"
                           @click="create">保存
                </el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
  import {addObj, delObj, fetchMenuTree, getObj, putObj} from '@/api/admin/permit'
  import {mapGetters} from 'vuex'

  export default {
    name: 'permit',
    data() {
      return {
        list: null,
        total: null,
        formEdit: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: ['0', '1'],
        methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        listQuery: {
          name: undefined
        },
        treeData: [],
        oExpandedKey: {
          // key (from tree id) : expandedOrNot boolean
        },
        oTreeNodeChildren: {
          // id1 : [children] (from tree node id1)
          // id2 : [children] (from tree node id2)
        },
        aExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        labelPosition: 'right',
        form: {
          permission: undefined,
          name: undefined,
          id: undefined,
          parentId: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          path: undefined,
          keepAlive: undefined
        },
        currentId: -1,
        sys_permission_add: false,
        sys_permission_edit: false,
        sys_permission_del: false,
        rules: {
          name: [
            { required: true, message: "The name cannot be empty", trigger: "blur" }
          ],
          type: [
            { required: true, message: "Please select type", trigger: "change" }
          ],
          sort: [
            { required: true, message: 'The sort cannot be empty', trigger: 'blur' }
          ],
          permission: [
            { required: true, message: "The permission cannot be empty", trigger: "blur" }
          ],
          component: [
            { required: true, message: "The component cannot be empty", trigger: "blur" }
          ],
          path: [
            { required: true, message: "The path cannot be empty", trigger: "blur" }
          ]
        }
      }
    },
    filters: {
      typeFilter(type) {
        const typeMap = {
          0: '菜单',
          1: '按钮'
        }
        return typeMap[type]
      }
    },
    created() {
      this.getList()
      this.sys_permission_add = this.permissions['sys_permission_add']
      this.sys_permission_edit = this.permissions['sys_permission_edit']
      this.sys_permission_del = this.permissions['sys_permission_del']
    },
    computed: {
      ...mapGetters([
        'elements',
        'permissions'
      ])
    },
    methods: {
      getList() {
        fetchMenuTree(this.listQuery).then(response => {
          this.treeData = response.data.data
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      nodeExpand(data) {
        let aChildren = data.children
        if (aChildren.length > 0) {
          this.oExpandedKey[data.id] = true
          this.oTreeNodeChildren[data.id] = aChildren
        }
        this.setExpandedKeys()
      },
      nodeCollapse(data) {
        this.oExpandedKey[data.id] = false
        // 如果有子节点
        this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
          this.oExpandedKey[oNode.id] = false
        });
        this.setExpandedKeys()
      },
      setExpandedKeys() {
        let oTemp = this.oExpandedKey
        this.aExpandedKeys = []
        for (let sKey in oTemp) {
          if (oTemp[sKey]) {
            this.aExpandedKeys.push(parseInt(sKey));
          }
        }
      },
      treeRecursion(aChildren, fnCallback) {
        if (aChildren) {
          for (let i = 0; i < aChildren.length; ++i) {
            let oNode = aChildren[i]
            fnCallback && fnCallback(oNode)
            this.treeRecursion(oNode.children, fnCallback)
          }
        }
      },
      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update'
        }
        this.form.parentId = data.parentId
        this.form.id = data.id
        this.form.name = data.name
        this.form.sort = data.sort
        this.form.permission = data.permission
        this.form.icon = data.icon
        this.form.component = data.component
        this.form.type = data.type
        this.form.path = data.path
        this.form.keepAlive = data.keepAlive

        this.currentId = data.id
        this.showElement = true
      },
      handlerEdit() {
        if (this.form.id) {
          this.formEdit = false
          this.formStatus = 'update'
        }
      },
      handlerAdd() {
        this.resetForm()
        this.formEdit = false
        this.formStatus = 'create'
      },
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(() => {
            this.getList()
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      update() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            putObj(this.form).then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      create() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      onCancel() {
        this.formEdit = true
        this.formStatus = ''
        if(this.currentId != -1) {
          this.$refs.tree.setCurrentKey(null)
          this.currentId = -1
        }
        this.resetForm()
      },
      resetForm() {
        this.form = {
          permission: undefined,
          name: undefined,
          id: undefined,
          parentId: this.currentId,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          path: undefined,
          keepAlive: undefined
        }
      }
    }
  }
</script>

