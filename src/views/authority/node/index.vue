<template>
    <div>
        <Sticky class-name="filter-container">
            <el-input
                size="small"
                v-model="listQuery.name"
                placeholder="节点名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
            />
            <el-button
                v-waves
                size="small"
                class="filter-item"
                style="margin-left: 10px;"
                type="success"
                icon="el-icon-edit"
                @click.native="handleCreate"
            >添加</el-button>
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
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="table-expand">
                            <el-form-item label="父节点ID">
                                <span>{{ scope.row.parentId }}</span>
                            </el-form-item>
                            <el-form-item label="父节点名称">
                                <span>{{ scope.row.parentName }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="节点名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="菜单路径">
                    <template slot-scope="scope">
                        <span>{{ scope.row.url }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="节点类别">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type | typeFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.open | statusFilter">
                            {{ scope.row.open | statusPlainFilter }}
                        </el-tag>
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
        </div>

        <node-form-dialog
            ref="nodeFormDialog"
            :visible.sync="dialogVisible"
            :dialogStatus="dialogStatus"
            :model.sync="nodeForm"
            :options="parentOptions"
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
    import NodeFormDialog from './components/NodeFormDialog'
    import { fetchNodeList } from '@/api/authority'
    import { recursiveArrFactory } from '@/utils/index'
    import Lodash from 'lodash'

    export default {
        name: 'Node',
        directives: { waves },
        filters: {
            statusFilter(status) {
                return status ? 'success' : 'danger'
            },
            statusPlainFilter(status) {
                return status ? '激活' : '禁用'
            },
            typeFilter(type) {
                const typeMap = {
                    0: '目录',
                    1: '菜单',
                    2: '按钮'
                }
                return typeMap[type]
            }
        },
        components: { Sticky, NodeFormDialog, BackToTop },
        data() {
            return {
                list: null,
                listLoading: true,
                dialogVisible: false,
                dialogStatus: '',
                listQuery: {
                    name: ''
                },
                nodeForm: {},
                tableHeight: document.body.clientHeight - 200
            }
        },
        computed: {
            parentOptions() {
                let options = [{ menuId: 0, name: '无父节点' }]
                if(this.list) {
                    const data = this.list
                    options = options.concat(recursiveArrFactory(data, 'menuId', 'parentId'))
                }
                return options
            }
        },
        created() {
            this.fetchData()
        },
        methods: {
            fetchData() {
                fetchNodeList().then(response => {
                    this.list = response.menuList
                    this.listLoading = false
                })
            },
            // 刷新节点列表
            handleRefresh() {
                this.fetchData()
            },
            // 创建节点
            handleCreate() {
                this.$refs['nodeFormDialog'].resetModel()
                this.dialogStatus = 'create'
                this.dialogVisible = true
                this.$nextTick(() => {
                    this.$refs['nodeFormDialog'].resetValidate()
                })
            },
            // 编辑节点
            handleEdit(index, row) {
                const rowData = Object.assign({}, row)
                rowData.parentId = this.getAllParent(rowData.parentId)
                this.nodeForm = Object.assign({}, rowData)
                this.dialogStatus = 'update'
                this.dialogVisible = true
                this.$nextTick(() => {
                    this.$refs['nodeFormDialog'].resetValidate()
                })
            },
            // 删除节点
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // deleteNode(row.menuId).then(response => {
                    //     console.log(response)
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
            // 搜索查询
            handleFilter() {
                alert('search')
            },

            // 获取完整继承链
            getAllParent(id, arr=[]) {
                arr.unshift(id)
                const currNode = this.list.find(item => item.menuId === id)
                if(currNode && currNode.parentId) {
                    this.getAllParent(currNode.parentId, arr)
                }
                return arr
            }
        },
        mounted: function () {
            const that = this
            // _.debounce 是一个通过 lodash 限制操作频率的函数。
            window.onresize = _.debounce(() => {
                that.tableHeight = document.body.clientHeight - 200
            }, 400)
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .table-expand {
        label {
            width: 100px;
            color: #99a9bf;
        }
        .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 1 / 3 * 100%;
        }
    }
</style>
