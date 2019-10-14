<template>
  <div class="task">
    <basic-container>
      <el-row>
        <Search 
          :tableSearch="tableSearch"
          @handleSearch="handleSearch"
        />
      </el-row>
      <data-table 
        :data="table.data"
        :loading="table.loading" 
        :option="table.option"
        :pagination="table.page"
        @onHandleSelectionChange="onHandleSelectionChange"
        @handleSearch="handleSearch">
        <template slot-scope="props" slot="isSuccess">
          <el-tag v-if="props.obj.row.isSuccess != 1"
            type="danger">失败</el-tag>
          <el-tag v-else>成功</el-tag>
        </template>
      </data-table>
      <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="45%">
          <el-form :model="form" :label-position="right" ref="form" label-width="100px">
            <el-row>
               <el-col span="12">
                <el-form-item label="作业名称"
                          prop="jobName">
                  <el-input v-model="form.jobName"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
               <el-col span="12">
                 <el-form-item label="任务名称"
                          prop="taskId">
                  <el-input v-model="form.taskId"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="12">
                 <el-form-item label="主机名称"
                          prop="hostname">
                  <el-input v-model="form.hostname"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
               <el-col span="12">
                 <el-form-item label="主机IP"
                          prop="ip">
                  <el-input v-model="form.ip"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="12">
                 <el-form-item label="分片项"
                          prop="shardingItem">
                  <el-input v-model="form.shardingItem"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
               <el-col span="12">
                 <el-form-item label="作业执行来源"
                          prop="executionSource">
                  <el-input v-model="form.executionSource"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="12">
                 <el-form-item label="开始时间"
                          prop="startTime">
                  <el-input v-model="form.startTime"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
               <el-col span="12">
                 <el-form-item label="完成时间"
                          prop="completeTime">
                  <el-input v-model="form.completeTime"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="12">
                 <el-form-item label="执行结果"
                          prop="isSuccess">
                  <el-input v-model="form.isSuccess"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="24">
                 <el-form-item label="失败原因"
                          prop="failureCause">
                  <el-input v-model="form.failureCause"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import Search from '@/components/search/search'
  import DataTable from '@/components/table/data-table'
  import {delLog, queryLogPage} from '@/api/monitor/task'

  export default {
    name: 'task_log_page',
    components: {
      Search,
      DataTable
    },
    data() {
      return {
        title: '',
        dialogVisible: false,
        form: {
          jobName: undefined,
          hostname: undefined,
          ip: undefined,
          taskId: undefined,
          shardingItem: undefined,
          executionSource: undefined,
          failureCause: undefined,
          isSuccess: undefined,
          startTime: undefined,
          completeTime: undefined
        },
        checkedData: [],
        searchForm: {
          jobName: ''
        },
        tableSearch: [
          {
            label: '作业名称',
            value: 'jobName',
          }
        ],
        table: {
          loading: true,
          option: {
            hasIndex: true,
            hasSelect: true,
            hasOperation: true,
            border: true,
            rowKey: 'id',
            column: [
              {
                label: '作业名称',
                prop: 'jobName',
                // width: '180',
                align: 'center'
              },{
                label: '主机IP',
                prop: 'ip',
                // width: '300',
                align: 'center'
              },{
                label: '分片项',
                prop: 'shardingItem',
                width: '150',
                align: 'center'
              },{
                label: '执行结果',
                prop: 'isSuccess',
                width: '100',
                show: 'template',
                align: 'center'
              },{
                label: '完成时间',
                prop: 'completeTime',
                width: '200',
                align: 'center'
              }
            ],
            operation: {            
              label: '操作',               
              width: '180',               
              align: 'center',     
              data: [
                {
                  type: 'primary',
                  hasPermit: 'task_log_info',
                  label: '详情',
                  method: this.handleInfo,  
                  id: '2'                     
                }, {
                  type: 'danger',
                  hasPermit: 'task_log_del',
                  label: '删除',
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
          size: this.table.page.pageSize
        }
        data = Object.assign({}, data, this.searchForm)
        queryLogPage(data).then(response => {
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
      handleInfo(row, index) {
        this.title = '详情'
        this.form = row
        this.dialogVisible = true
      },
      handleDelete(row, index) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delLog(row.id).then(() => {
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
      onHandleSelectionChange(data) {
        this.checkedData = data
      }
    }
  }
</script>
<style lang="scss">
  .task {
    height: 100%;
  }
</style>
