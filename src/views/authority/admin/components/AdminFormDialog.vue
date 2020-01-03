<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
    >
        <el-form
            ref="adminForm"
            :rules="formRules"
            :model="model"
            label-position="right"
            label-width="100px"
        >
            <el-form-item v-if="dialogStatus === 'update'" label="ID">
                <span>{{ model.userId }}</span>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="model.status">
                    <el-radio :label="1">激活</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="角色">
                <el-select
                    multiple
                    filterable
                    v-model="model.roleIdList"
                    placeholder="请选择角色"
                >
                    <el-option
                        v-for="item in roleOptions"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="账户名称" prop="username">
                <el-input v-model="model.username" />
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="model.email" />
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="model.mobile" />
            </el-form-item>

            <el-form-item
                v-if="dialogStatus === 'create'"
                label="密码"
            >
                <el-input type="password" v-model="model.password" />
            </el-form-item>

            <el-form-item
                v-if="dialogStatus === 'create'"
                label="确认密码"
            >
                <el-input type="password" v-model="model.checkPass"/>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="dialogStatus === 'create' ? saveAdmin() : updateAdmin()">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { fetchRoleOptions, saveAdmin, updateAdmin } from '@/api/authority'
    import { parseTime } from '@/utils/index'

    export default {
        name: "AdminFormDialog",
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
            }
        },
        created() {
            this.fetchRoleOptions()
        },
        data() {
            const validPass = (rule, value, callback) => {
                if(value.trim() === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if(this.model.checkPass !== '') {
                        this.$refs['adminForm'].validateField('checkPass')
                    }
                    callback()
                }
            }
            const validCheckPass = (rule, value, callback) => {
                if(value.trim() === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.model.password) {
                    callback(new Error('两次输入密码不一致！'))
                } else {
                    callback()
                }
            }
            return {
                formRules: {
                    username: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }],
                    password: [{ validator: validPass, trigger: 'blur' }],
                    checkPass: [{ validator: validCheckPass, trigger: 'blur' }]
                },
                roleOptions: []
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.visible
                },
                set(val) {
                    this.$emit('update:visible', val)
                }
            },
            title() {
                const textMap = {
                    create: '创建管理员',
                    update: '编辑管理员'
                }
                return textMap[this.dialogStatus]
            }
        },
        methods: {
            fetchRoleOptions() {
                fetchRoleOptions().then(response => {
                    this.roleOptions = response.list
                })
            },

            saveAdmin() {
                this.$refs['adminForm'].validate(valid => {
                    if(valid) {
                        const createTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
                        const body = Object.assign({createTime}, this.model)
                        saveAdmin(body).then(data => {
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

            updateAdmin() {
                this.$refs['adminForm'].validate(valid => {
                    if(valid) {
                        const createTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
                        const body = Object.assign({createTime}, this.model)
                        updateAdmin(body).then(data => {
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
                    userId: 0,
                    email: '',
                    mobile: '',
                    password: '',
                    checkPass: '',
                    roleIdList: [],
                    status: 1,
                    username: ''
                })
            },
            resetValidate() {
                this.$refs['adminForm'].clearValidate()
            }
        }
    }
</script>

<style scoped>
</style>
