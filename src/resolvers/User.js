import getUserId from '../utils/get-user-id'

const User = {
    //locking one specific field
    email(parent, args, { request }, info) {
        const userId = getUserId(request, false)
        
        if(userId && userId === parent.id){
            return parent.email
        } else {
            return null
        }
    }
}

export { User as default }