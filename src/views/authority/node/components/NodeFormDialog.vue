<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
    >
        <el-form
            ref="nodeForm"
            :rules="formRules"
            :model="model"
            label-position="right"
            label-width="100px"
        >
            <el-form-item v-if="dialogStatus === 'update'" label="ID">
                <span>{{ model.menuId }}</span>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="model.open">
                    <el-radio :label="true">激活</el-radio>
                    <el-radio :label="false">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="节点类别" prop="type">
                <el-select v-model="model.type" placeholder="请选择节点类别">
                    <el-option label="目录" :value="0"/>
                    <el-option label="菜单" :value="1"/>
                    <el-option label="按钮" :value="2"/>
                </el-select>
            </el-form-item>
            <el-form-item label="父节点">
                <el-cascader
                    v-model="model.parentId"
                    change-on-select
                    :options="options"
                    :props="props"
                    placeholder="请选择父节点"
                />
            </el-form-item>
            <el-form-item label="节点名称" prop="name">
                <el-input v-model="model.name"/>
            </el-form-item>
            <el-form-item label="菜单路径" prop="url">
                <el-input v-model="model.url" />
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="dialogStatus === 'create' ? saveNode() : updateNode()">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { saveNode, updateNode } from '@/api/authority'

    export default {
        name: "NodeFormDialog",
        props: {
            visible: {
                required: true,
                type: Boolean
            },
            dialogStatus: {
                type: String,
                default: 'create'
            },
            model: {
                required: true,
                type: Object
            },
            options: {
                required: true,
                type: Array
            }
        },
        data() {
            return {
                dialogVisible: this.visible,
                formRules: {
                    name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
                    type: [{ required: true, message: '请选择节点类别', trigger: 'change' }],
                    url: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }]
                },
                props: {
                    value: 'menuId',
                    label: 'name'
                }
            }
        },
        computed: {
            title() {
                const textMap = {
                    update: '编辑节点',
                    create: '创建节点'
                }
                return textMap[this.dialogStatus]
            }
        },
        watch: {
            visible(val) {
                this.dialogVisible = val
            },
            dialogVisible(val) {
                this.$emit('update:visible', val)
            }
        },
        methods: {
            saveNode() {
                this.$refs['nodeForm'].validate(valid => {
                    if(valid) {
                        let body = Object.assign({}, this.model)
                        body.parentId = body.parentId.slice(-1).toString()
                        saveNode(body).then(data => {
                            console.log(data)
                            this.$message({
                                type: 'success',
                                message: 'success',
                                duration: 5 * 1000
                            })
                            this.$emit('refresh')
                            this.$emit('update:visible', false)
                        })
                    }
                })
            },

            updateNode() {
                this.$refs['nodeForm'].validate(valid => {
                    if(valid) {
                        let body = Object.assign({}, this.model)
                        body.parentId = body.parentId.slice(-1).toString()
                        updateNode(body).then(data => {
                            console.log(data)
                            this.$message({
                                type: 'success',
                                message: 'success',
                                duration: 5 * 1000
                            })
                            this.$emit('refresh')
                            this.$emit('update:visible', false)
                        })
                    }
                })
            },

            resetModel() {
                this.$emit('update:model', {
                    name: '',
                    open: true,
                    type: undefined,
                    url: '',
                    parentId: [0]
                })
            },
            resetValidate() {
                this.$refs['nodeForm'].clearValidate()
            }
        }
    }
</script>

<style scoped>

</style>
