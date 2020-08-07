<template>
<div>
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
      @handleSearch="handleSearch">
      
    </data-table>
    <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="30%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="任务名称"
                      prop="jobName">
          <el-input v-model="form.jobName"
                    placeholder="请输入任务组名"></el-input>
        </el-form-item>
        <el-form-item label="任务组名"
                      prop="jobGroup">
          <el-input v-model="form.jobGroup"
                    placeholder="请输入任务组名"></el-input>
        </el-form-item>
        <el-form-item label="任务class"
                      prop="jobClass">
          <el-input v-model="form.jobClass"
                    placeholder="请输入任务class"></el-input>
        </el-form-item>
        <el-form-item label="corn表达式"
                      prop="cronExpression">
          <el-input v-model="form.cronExpression" v-focus="this.showCronBox = true" v-blur="this.showCronBox = false"
                    placeholder="请输入corn表达式"></el-input>
          <cron v-if="showCronBox" v-model="cron.cronExpression"></cron>
        </el-form-item>
        <el-form-item label="任务传参"
                      prop="invokeParam">
          <el-input v-model="form.invokeParam"
                    placeholder="请输入任务传参"></el-input>
        </el-form-item>
        <el-form-item label="任务描述"
                      prop="jobDescription">
          <el-input v-model="form.jobDescription"
                    placeholder="请输入任务描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form'), dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
	</basic-container>
</div>  
</template>

<script>
import Search from '@/components/search/search'
import DataTable from '@/components/table/data-table'
import Cron from '@/components/cron/cron'
import {getJobPage, addJob, modifyJobTime, getJobState, removeJob, pauseAllJob, resumeAllJob, pauseJob, resumeJob, runAJobNow, startJobs, shutdownJobs} from '@/api/monitor/quartz'
export default {
	name: 'quartz_log_page',
	components: {
		Search,
    DataTable,
    Cron
	},
	data() {
		return {
      title: '',
      showCronBox: false,
      cron: {
        cronExpression: ''
      },
      searchForm: {
        jobName: ''
      },
      tableSearch: [
        {
          label: '任务名称',
          value: 'jobName',
        }
      ],
      form: {},
      rules: {
        jobName: [
          {required: true, message: '请输入任务名称', trigger: 'blur'}
        ],
        jobGroup: [
          {required: true, message: '请输入任务组名', trigger: 'blur'}
        ],
        jobClass: [
          {required: true, message: '请输入任务class', trigger: 'blur'}
        ],
        cronExpression: [
          {required: true, message: '请输入corn表达式', trigger: 'blur'}
        ]
      },
      dialogVisible: false,
      table: {
        data: [],
        operBut: [{
          title: '新建任务',
          hasPermit: 'sys_quartz_add',
          method: this.handleAdd
        },{
          title: '暂停所有任务',
          hasPermit: 'sys_quartz_pauseAll',
          method: this.pauseAllJob
        },{
          title: '恢复所有任务',
          hasPermit: 'sys_quartz_resumeAll',
          method: this.resumeAllJob
        },{
          title: '启动所有定时任务',
          hasPermit: 'sys_quartz_startJobs',
          method: this.startJobs
        },{
          title: '关闭所有定时任务',
          hasPermit: 'sys_quartz_shutdownJobs',
          method: this.shutdownJobs
        }],
        loading: true,
        option: {
          hasIndex: true,
          hasSelect: true,
          hasOperation: true,
          border: true,
          column: [
            {
              label: '任务名称',
              prop: 'jobName',
              width: '100',
              align: 'center'
            },{
              label: '任务组名',
              prop: 'jobGroup',
              width: '120',
              align: 'center'
            },{
              label: '任务class',
              prop: 'jobClass',
              width: '300',
              align: 'center'
            },{
              label: 'corn表达式',
              prop: 'cronExpression',
              width: '120',
              align: 'center'
            },{
              label: '任务状态',
              prop: 'triggerState',
              width: '120',
              align: 'center',
              formatter: (row, column, index) => {
                if(row.triggerState == 'BLOCKED') {
                  return '阻塞';
                }else if(row.triggerState == 'COMPLETE') {
                  return '完成';
                }else if(row.triggerState == 'ERROR') {
                  return '错误';
                }else if(row.triggerState == 'NONE') {
                  return '不存在';
                }else if(row.triggerState == 'NORMAL') {
                  return '正常';
                }else if(row.triggerState == 'PAUSED') {
                  return '暂停';
                }else if(row.triggerState == 'WAITING') {
                  return '等待';
                }else if(row.triggerState == 'ACQUIRED') {
                  return '正常执行';
                }else {
                  return row.triggerState;
                }
              }
            },{
              label: '上一次触发job的时间',
              prop: 'previousFireTime',
              width: '180',
              align: 'center'
            },{
              label: '下一次触发job的时间',
              prop: 'nextFireTime',
              width: '180',
              align: 'center'
            },{
              label: '任务描述',
              prop: 'jobDescription',
              width: '200',
              align: 'center'
            }
          ],
          operation: {             // 操作功能
            label: '操作',                // 操作列的行首文字
            width: '500',                // 操作列的宽度
            align: 'center',
            data: [                      // 操作列数据
              {
                type: 'success',
                label: '日志',                // 按钮文字
                method: this.handleLog,        // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '1'                     // 按钮循环组件的key值
              }, {
                type: 'success',
                hasPermit: 'sys_quartz_edit',
                label: '编辑',                // 按钮文字
                method: this.handleEdit,        // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '2'                     // 按钮循环组件的key值
              }, {
                type: 'danger',
                hasPermit: 'sys_quartz_del',
                label: '删除',                // 按钮文字
                method: this.handleDelete,      // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '3'                     // 按钮循环组件的key值
              }, {
                type: 'primary',
                hasPermit: 'sys_quartz_runAJobNow',
                label: '立即执行',                // 按钮文字
                method: this.runAJobNow,      // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '4'                     // 按钮循环组件的key值
              }, {
                type: 'warning',
                hasPermit: 'sys_quartz_pauseJob',
                label: '暂停',                // 按钮文字
                method: this.pauseJob,      // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '5'                     // 按钮循环组件的key值
              }, {
                type: 'info',
                hasPermit: 'sys_quartz_resumeJob',
                label: '恢复',                // 按钮文字
                method: this.resumeJob,      // 点击按钮后触发的父组件事件
                size: 'mini',                // 按钮大小
                id: '6'                     // 按钮循环组件的key值
              }
            ]
          }
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条
        }
      }
		}
	},
	created() {
    this.getList()
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
        size: this.table.page.pageSize
      }
      data = Object.assign({}, data, this.searchForm)
      getJobPage(data).then(response => {
        this.table.data = response.data.data.records
        this.table.page.total = response.data.data.total
        this.checkedData = []
        this.table.loading = false
      })
    },
    handleAdd() {
      this.title = '新建任务'
      this.form = {}
      this.dialogVisible = true
    },
    pauseAllJob() {
      pauseAllJob().then(res => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resumeAllJob() {
      resumeAllJob().then(res => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    startJobs() {
      startJobs().then(res => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    shutdownJobs() {
      shutdownJobs().then(res => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleLog(row, index) {

    },
    handleEdit(row, index) {
      this.title = '修改任务'
      this.form = row
      this.dialogVisible = true
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeJob({'name': row.jobName, 'groupName':row.jobGroup}).then(() => {
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
    runAJobNow(row, index) {
      runAJobNow({'name': row.jobName, 'groupName':row.jobGroup}).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    pauseJob(row, index) {
      pauseJob({'name': row.jobName, 'groupName':row.jobGroup}).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resumeJob(row, index) {
      resumeJob({'name': row.jobName, 'groupName':row.jobGroup}).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.cronExpression = this.cron.cronExpression
          if(!this.form.id) {
            addJob(this.form).then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
            })
          } else {
            modifyJobTime(this.form).then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
	}
}
</script>

<style lang="scss">

</style>