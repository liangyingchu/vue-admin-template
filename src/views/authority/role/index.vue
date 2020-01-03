<template>
    <div>
        <Sticky class-name="filter-container">
            <div class="flex flex-row flex-align-center height100pc">
                <el-input
                    size="small"
                    v-model="listQuery.roleName"
                    placeholder="角色名称"
                    style="width: 200px;margin-right: 10px"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                />
                <el-select
                    size="small"
                    v-model="listQuery.status"
                    placeholder="状态"
                    clearable
                    style="width: 90px;margin-right: 10px"
                    class="filter-item"
                >
                    <el-option label="激活" value="1" />
                    <el-option label="禁用" value="0" />
                </el-select>
                <el-button
                    v-waves
                    size="small"
                    class="filter-item"
                    type="success"
                    icon="el-icon-search"
                    @click.native="handleFilter"
                >搜索</el-button>
                <el-button
                    v-waves
                    size="small"
                    class="filter-item"
                    style="margin-left: 10px;"
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
                <el-table-column align="center" label="ID" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.roleId }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        <i class="el-icon-time"/>
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="角色名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.roleName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="描述">
                    <template slot-scope="scope">
                        <span>{{ scope.row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="区域">
                    <template slot-scope="scope">
                        <el-tag
                            v-for="item in scope.row.regions"
                            :key="item.id"
                            class="region-tag"
                        >{{ item.regionName }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click.native="handleDispatch(scope.$index, scope.row)"
                        >路由</el-button>
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

        <!--角色编辑对话框-->
        <role-form-dialog
            ref="roleFormDialog"
            :visible.sync="dialogFormVisible"
            :dialogStatus="dialogStatus"
            :model.sync="roleForm"
            @refresh="handleRefresh"
        />

        <!--权限分配对话框-->
        <dispatch-permission-dialog
            :roleId="selectedRoleId"
            :visible.sync="dialogTreeVisible"
            :menuIdList="selectedMenuIdList"
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
    import waves from '@/directive/waves' // Waves directive
    import Sticky from '@/components/Sticky'
    import BackToTop from '@/components/BackToTop'
    import Pagination from '@/components/Pagination'
    import RoleFormDialog from './components/RoleFormDialog'
    import DispatchPermissionDialog from './components/DispatchPermissionDialog'
    import { fetchRoleList } from '@/api/authority'
    import Lodash from 'lodash'

    export default {
        name: 'Role',
        directives: { waves },
        // filters: {
        //     statusFilter(status) {
        //         const statusMap = {
        //             0: 'danger',
        //             1: 'success',
        //             2: 'gray'
        //         }
        //         return statusMap[status]
        //     },
        //     statusPlainFilter(status) {
        //         const statusMap = {
        //             0: '禁用',
        //             1: '激活',
        //             2: '待定'
        //         }
        //         return statusMap[status]
        //     }
        // },
        components: {Sticky, BackToTop, Pagination, RoleFormDialog, DispatchPermissionDialog },
        data() {
            return {
                list: null,
                total: 0, // 数据总条目数
                listLoading: true,
                listQuery: {
                    page: 1, // 当前页码
                    limit: 10, // 每页显示条目数
                    roleName: undefined,
                    status: undefined
                },
                dialogFormVisible: false,
                dialogTreeVisible: false,
                dialogStatus: '',
                selectedRoleId: 0,
                selectedMenuIdList: [],
                roleForm: {},
                tableHeight: document.body.clientHeight - 250
            }
        },
        created() {
            this.fetchData(this.listQuery)
        },
        methods: {
            fetchData(listQuery) {
                fetchRoleList(listQuery).then(data => {
                    this.list = data.list
                    this.total = data.total
                    this.listLoading = false
                })
            },
            handleRefresh() {
                this.fetchData(this.listQuery)
            },
            // 搜索查询
            handleFilter(payload) {
                this.fetchData(payload)
            },
            // 分配权限
            handleDispatch(index, row) {
                this.selectedRoleId = row.roleId
                this.selectedMenuIdList = row.menuIdList
                this.dialogTreeVisible = true
            },

            // 删除角色
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // deleteRole(row.roleId).then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData(this.listQuery)
                    // })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            // 创建角色
            handleCreate() {
                this.$refs['roleFormDialog'].resetModel()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['roleFormDialog'].resetValidate()
                })
            },

            // 编辑角色
            handleEdit(index, row) {
                let data = Object.assign({}, row)
                this.roleForm = Object.assign({ status: 1 }, data)
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['roleFormDialog'].resetValidate()
                })
            }
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
    .region-tag {
        margin-left: 5px;
        margin-right: 5px;
    }
</style>
