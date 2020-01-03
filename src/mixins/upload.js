import { getToken } from '@/utils/auth'

const uploadMixin = {
    data() {
        return {
            action: process.env.BASE_API + '/flow/flow/uploadFile',
            headers: { token: getToken() }
        }
    }
}

export default uploadMixin
