<template>
    <div>
        <Sticky class-name="filter-container">
            <div class="flex flex-row flex-align-center height100pc">
                <el-button
                    v-waves
                    size="small"
                    class="filter-item"
                    type="success"
                    icon="el-icon-edit"
                    @click.native="handleCreate"
                >添加</el-button>
            </div>
        </Sticky>

        <div class="app-container">
            <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="拼命加载中"
                border
                fit
                highlight-current-row
                :height="tableHeight + 'px'"
            >
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        <i class="el-icon-time"/>
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="账户名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.username }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="邮箱">
                    <template slot-scope="scope">
                        <span>{{ scope.row.email }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="手机">
                    <template slot-scope="scope">
                        <span>{{ scope.row.mobile }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-radio-group
                            v-model="scope.row.status"
                            @change="handleStatusChange(scope.row)"
                        >
                            <el-radio :label="1">激活</el-radio>
                            <el-radio :label="0">禁用</el-radio>
                        </el-radio-group>
                        <!--<el-tag :type="scope.row.status | statusFilter">-->
                            <!--{{ scope.row.status | statusPlainFilter }}-->
                        <!--</el-tag>-->
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="success"
                            @click.native="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click.native="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="handleFilter"
            />
        </div>

        <admin-form-dialog
            ref="adminFormDialog"
            :visible.sync="dialogVisible"
            :dialogStatus="dialogStatus"
            :model.sync="adminForm"
            @refresh="handleRefresh"
        />

        <el-tooltip placement="top" content="回到顶部">
            <back-to-top
                :visibility-height="300"
                :back-position="0"
            />
        </el-tooltip>
    </div>
</template>

<script>
    import waves from '@/directive/waves'
    import Sticky from '@/components/Sticky'
    import BackToTop from '@/components/BackToTop'
    import Pagination from '@/components/Pagination'
    import AdminFormDialog from './components/AdminFormDialog'
    import { fetchAdminList
        // deleteAdmin,
        // updateAdmin,
        // resetPassWord
    } from '@/api/authority'
    import Lodash from 'lodash'

    export default {
        name: 'Admin',
        directives: { waves },
        filters: {
            statusFilter(status) {
                return status === 1 ? 'success' : 'danger'
            },
            statusPlainFilter(status) {
                return status === 1 ? '激活' : '禁用'
            }
        },
        components: { Sticky, BackToTop, Pagination, AdminFormDialog },
        created() {
            this.fetchData(this.listQuery)
        },
        data() {
            return {
                listLoading: true,
                list: null,
                total: 0, // 数据总条目数
                listQuery: {
                    page: 1,
                    limit: 10
                },
                dialogVisible: false,
                dialogStatus: '',
                adminForm: {},
                tableHeight: document.body.clientHeight - 250
            }
        },
        methods: {
            fetchData(listQuery) {
                fetchAdminList(listQuery).then(data => {
                    console.log(data)
                    const { total, list } = data
                    this.list = list
                    this.total = total
                    this.listLoading = false
                })
            },
            // 搜索查询
            handleFilter(payload) {
                this.fetchData(payload)
            },
            // 刷新
            handleRefresh() {
                this.fetchData(this.listQuery)
            },
            handleCreate() {
                this.$refs['adminFormDialog'].resetModel()
                this.dialogStatus = 'create'
                this.dialogVisible = true
                this.$nextTick(() => {
                    this.$refs['adminFormDialog'].resetValidate()
                })
            },

            handleEdit(index, row) {
                if(!row.roleIdList) {
                    row.roleIdList = new Array()
                }
                delete row.createTime
                this.adminForm = Object.assign({}, row)
                this.dialogStatus = 'update'
                this.dialogVisible = true
                this.$nextTick(() => {
                    this.$refs['adminFormDialog'].resetValidate()
                })
            },

            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // deleteAdmin(row.userId).then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.handleRefresh()
                    // })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            // handleStatusChange(row) {
            //     updateAdmin(row).then(response => {
            //         this.$message({
            //             type: 'success',
            //             message: response.msg,
            //             duration: 5 * 1000
            //         })
            //         this.handleRefresh()
            //     })
            // },


        },
        mounted: function () {
            const that = this
            // _.debounce 是一个通过 lodash 限制操作频率的函数。
            window.onresize = _.debounce(() => {
                that.tableHeight = document.body.clientHeight - 250
            }, 400)
        }
    }
</script>

<style scoped>
</style>
